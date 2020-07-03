/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateEventRequest {
  name: string
  start: string
  end: string
  details: string
  color: string
}
