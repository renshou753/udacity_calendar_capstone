import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { createLogger } from '../../utils/logger'
import { deleteEvent } from '../../logicLayer/event'
import 'source-map-support/register'

const logger = createLogger('Event')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)
  const eventId = event.pathParameters.eventId
  await deleteEvent(userId, eventId)
  

  // EVENT Remove a EVENT item by id
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      
    })
  }
}

