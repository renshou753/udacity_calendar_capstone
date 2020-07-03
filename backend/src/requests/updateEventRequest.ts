/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateEventRequest {
  name: string
  start: string
  end: string
}