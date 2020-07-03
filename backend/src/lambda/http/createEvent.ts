import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { createLogger } from '../../utils/logger'
import { createEvent } from '../../logicLayer/event'
import { CreateEventRequest } from '../../requests/createEventRequest'
import 'source-map-support/register'


const logger = createLogger('Event')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  console.log('Processing event: ', event)
  logger.info("processing event ", event)
  const userId = getUserId(event)
  const newEvent: CreateEventRequest = JSON.parse(event.body);
  
  if (newEvent.name == ""){
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name cannot be empty'
      })
    }
  }
  
  const item = await createEvent(newEvent, userId)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
