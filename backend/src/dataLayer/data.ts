import 'source-map-support/register'
import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)
// const ddb = AWSXRay.captureAWSClient(new AWS.DynamoDB());

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { EventItem } from '../models/eventItem'
import { EventUpdate } from '../models/eventUpdate'
import { createLogger } from '../utils/logger'
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('createEvent')

export class Data {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly eventsTable = process.env.EVENTS_TABLE,
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,

    ) {
    }

    async getEvents(userId: string): Promise<EventItem[]> {
        //const todoIndex = process.env.INDEX_NAME

        const result = await this.docClient.query({
            TableName: this.eventsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()


        logger.info("Event's retrieved successfully")

        const items = result.Items
        return items as EventItem[]
    }

    async createEvent(eventItem: EventItem): Promise<EventItem> {
        await this.docClient.put({
            TableName: this.eventsTable,
            Item: eventItem
        }).promise()

        return eventItem
    }

    async updateEvent(userId: string, eventId: string, eventUpdate: EventUpdate): Promise<EventUpdate> {
        var params = {
            TableName: this.eventsTable,
            Key: {
                userId: userId,
                eventId: eventId
            },
            UpdateExpression: "set #n = :r, start=:p, end=:a",
            ExpressionAttributeValues: {
                ":r": eventUpdate.name,
                ":p": eventUpdate.start,
                ":a": eventUpdate.end
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(params).promise()
        logger.info("Update was successful")
        return eventUpdate

    }



    async deleteEvent(userId: string, eventId: string): Promise<String> {
        await this.docClient.delete({
            TableName: this.eventsTable,
            Key: {
                userId: userId,
                eventId: eventId
            }
        }).promise()
        
        logger.info("delete successfull")

        return ''

    }

    async generateUploadUrl(userId: string, eventId: string): Promise<String> {
        const url = getUploadUrl(eventId, this.bucketName)

        const attachmentUrl: string = 'https://' + this.bucketName + '.s3.amazonaws.com/' + eventId

        const options = {
            TableName: this.eventsTable,
            Key: {
                userId: userId,
                eventId: eventId
            },
            UpdateExpression: "set attachmentUrl = :r",
            ExpressionAttributeValues: {
                ":r": attachmentUrl
            },
            ReturnValues: "UPDATED_NEW"
        };

        await this.docClient.update(options).promise()
        logger.info("url generated successfully ", url)

        return url;
    }

}


function getUploadUrl(eventId: string, bucketName: string): string {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: eventId,
        Expires: parseInt(urlExpiration)
    })
}



function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}