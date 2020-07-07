import { apiEndpoint } from '../../config'
import Axios from 'axios'

export async function getEvents(idToken) {
  console.log('Fetching events')

  const response = await Axios.get(`${apiEndpoint}/events`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Events:', response.data)
  return response.data.items

}

export async function createEvent(idToken, newEvent) {
  const response = await Axios.post(`${apiEndpoint}/events`, JSON.stringify(newEvent), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchEvent(idToken, eventId, updatedevent) {
  await Axios.patch(`${apiEndpoint}/events/${eventId}`, JSON.stringify(updatedevent), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteEvent(idToken, eventId) {
  await Axios.delete(`${apiEndpoint}/events/${eventId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(idToken, eventId) {
  const response = await Axios.post(`${apiEndpoint}/events/${eventId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await Axios.put(uploadUrl, file)
}