import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { eventExists } from '../../logicLayer/event'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../logicLayer/event'
import 'source-map-support/register'

const logger = createLogger('Event')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)

  const eventId = event.pathParameters.eventId
  const validEventId = await eventExists(userId, eventId)
  
  if (!validEventId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Event item does not exist'
      })
    }
  }

  let url = await generateUploadUrl(userId, eventId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}



