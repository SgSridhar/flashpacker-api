import axios from 'axios'
import R from 'ramda'
import {facebookCreds} from '../../facebook-creds'

const facebookPlaceSearchBaseUri = 'https://graph.facebook.com/v2.9/search?type=place&limit=3&fields=name,id,location,checkins'

function facebookPlacesSearchUriBuilder(name) {
  const {app_id, app_secret} = facebookCreds
  return `${facebookPlaceSearchBaseUri}&q=${name}&access_token=${app_id}|${app_secret}`
}

export default function getFacebookData(locationName) {
  const url = facebookPlacesSearchUriBuilder(locationName)
  return axios.get(url)
    .then((res) => {
      const data = R.reverse(R.compose(
        R.sortBy(R.prop('checkins')),
        R.filter((doc) => doc.location.country === 'India'))(res.data.data))[0]
      // console.log("DATA ------> ",data)
      return data
    })
    .catch((err) => {
      console.log(err)
    })
}


