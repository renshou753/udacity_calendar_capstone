
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { Data } from '../dataLayer/data'
import { EventItem } from '../models/eventItem'

import { CreateEventRequest } from '../requests/createEventRequest'
import { UpdateEventRequest } from '../requests/updateEventRequest'
import { EventUpdate } from '../models/eventUpdate'

const docClient = new AWS.DynamoDB.DocumentClient()
const eventsTable = process.env.EVENTS_TABLE

const data = new Data()

export async function getEventsPerUser(userId: string): Promise<EventItem[]> {

  return await data.getEvents(userId)
}

export async function createEvent(
    createEventRequest: CreateEventRequest,
    userId: string
    ): Promise<EventItem>{
    const eventId = uuid.v4()

    const newEvent: EventItem = {
        userId: userId,
        eventId: eventId,
        details: createEventRequest.details,
        name: createEventRequest.name,
        start: createEventRequest.start,
        end: createEventRequest.end,
        color: createEventRequest.color,
        createdAt: new Date().toISOString(),
    }

    return await data.createEvent(newEvent)
}

export async function deleteEvent(userId: string, eventId: string): Promise<String>  {

    return data.deleteEvent(userId, eventId)
}

export async function generateUploadUrl(userId: string, eventId: string):  Promise < String >{
    return data.generateUploadUrl(userId, eventId)
}

export async function updateEvent(
    userId: string,
    eventId: string,
    updateEventRequest: UpdateEventRequest
): Promise<EventUpdate> {

    const updatedEvent: EventUpdate = {
        name: updateEventRequest.name,
        start: updateEventRequest.start,
        end: updateEventRequest.end
    }

    return await data.updateEvent(userId, eventId, updatedEvent)
}

export async function eventExists(userId: string, eventId: string) {
  const result = await docClient
    .get({
      TableName: eventsTable,
      Key: {
        userId: userId,
        eventId: eventId
      }
    })
    .promise()

  console.log('Get event: ', result)
  return !!result.Item
}