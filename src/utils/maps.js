import googleMaps from '@google/maps'
import P from 'bluebird'

const googleMapsClient = googleMaps.createClient({
  key: 'AIzaSyBN8HDf7Ua-fdjECRtlQ3ziKuQJKQgZEKw',
  Promise: P,
  timeout: 30000,
  rate : {
    limit: 1000,
  }
});

export default function mapFunction(name) {
  console.log('Nameeeee', name  )
  return googleMapsClient.places({
    query: name
  }).asPromise()
}
