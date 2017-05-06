import Location from '../../model/locationSchema'
import getFacebookData from '../../utils/facebook-api'
import R from 'ramda'

export default function getLocationData() {
  Location
    .find({})
    .sort({name:1})
    .then((doc) => {
    console.log(doc)
      doc.map((location) => {
        if (!R.isEmpty(location.checkins)) {
          getFacebookData(location.name)
            .then((data) => {
              if(data) {
                console.log(data)
                Location
                  .find({name: location.name})
                  .then((d) => {
                    const originalLocation = d[0].toJSON()
                    // console.log('DB DATA', originalLocation)
                    const latLong = data.location.latitude < 90 ? [data.location.longitude, data.location.latitude] :
                      [data.location.latitude, data.location.longitude]
                    const updatedLocation = {...originalLocation,
                      fbPlaceId: data.id,
                      city: data.location.city,
                      location: latLong,
                      checkins: {date: new Date().getDate(), checkins: data.checkins ? data.checkins : d.checkins}
                    }
                    console.log("Updated", updatedLocation)
                    Location
                      .findOneAndUpdate({name: location.name}, updatedLocation)
                      .then((document) => {
                        console.log(document)
                      })
                      .catch((err) => {
                        console.log(err)
                      })
                  })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
