import Location from '../../model/locationSchema'
import getFacebookData from '../../utils/facebook-api'

export default function getLocationData() {
  Location
    .find({})
    .sort({name:1})
    .then((doc) => {
      doc.map((location) => {
        getFacebookData(location.name)
          .then((data) => {
            if(data) {
              Location
                .find({name: location.name})
                .then((d) => {
                console.log(d)
                  // const checkinPresent = d.checkins.filter((c) => c.date === new Date().getDate()) ? true : false
                  // const updatedCheckins = (() => {
                  //   if (checkinPresent) {
                  //     return d.checkins.map((c) => {
                  //       if (c.date === new Date().getDate()) {
                  //         return {...c, checkins: data.checkins}
                  //       }
                  //       return c
                  //     })
                  //   } else{
                  //     return R.append({checkin: data.checkin, date: new Date().getDate()}, checkinPresent)
                  //   }
                  // })()
                  const updatedLocation = {...d,
                    fbPlaceId: data.id,
                    city: data.location.city,
                    location: [data.location.longitude, data.location.latitude],
                    // checkins: updatedCheckins
                  }
                  console.log(updatedLocation)
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
        setTimeout(() => {}, 3000)
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
