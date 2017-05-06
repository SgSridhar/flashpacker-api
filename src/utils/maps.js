import googleMaps from '@google/maps'
import P from 'bluebird'

var map

const googleMapsClient = googleMaps.createClient({
  key: 'AIzaSyBN8HDf7Ua-fdjECRtlQ3ziKuQJKQgZEKw',
  Promise: P,
  timeout: 30000,
  rate : {
    limit: 1000,
  }
});

// map = googleMaps.

export function getPlaceIdsByName(name) {
  console.log('Getting place Id for ---> ', name  )
  return googleMapsClient.places({
    query: name
  }).asPromise()
}
