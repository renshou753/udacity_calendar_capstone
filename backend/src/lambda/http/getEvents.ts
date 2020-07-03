import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../util'
import { getEventsPerUser } from '../../logicLayer/event'
import { createLogger } from '../../utils/logger'
import 'source-map-support/register'


const logger = createLogger('Event')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event)
  console.log('Processing event: ', event)
  logger.info("processing event ", event)

  
  const items = await getEventsPerUser(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}



