import Location from '../../model/locationSchema'

let states = []
let total = 0
let numberOfDocs = 0
let average, min=0, max=0;
let lowThreshold, midThreshold;

function getTotalAndNmberOfDocs(document, area) {
  document.map((doc) => {
    max = max > doc.checkins[0].checkins ? max : doc.checkins[0].checkins
    if(min === 0) {
      min = doc.checkins[0].checkins
    }
    else {
      min = min < doc.checkins[0].checkins ? min : doc.checkins[0].checkins
    }
    if(area === 'country' && !states.includes(doc.state)) {
      states.push(doc.state)
    }
    total += doc.checkins[0].checkins
    numberOfDocs++
    return doc
  })
  return
}

function updateDoc(p, area) {
  let influx;
  if(p.checkins[0].checkins <= lowThreshold) {
    influx = 'LOW'
  }else if(p.checkins[0].checkins <= midThreshold) {
    influx = 'MID'
  } else {
    influx = 'HIGH'
  }
  console.log(area)
  let updatedLocation;
  if(area === 'state') {
    updatedLocation = {...p.toJSON(),
      stateInflux: influx
    }
  } else {
    updatedLocation = {...p.toJSON(),
      countryInflux: influx
    }
  }
  console.log('Updated Location', updatedLocation)

  Location
    .findOneAndUpdate({name: p.name}, updatedLocation)
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
}

export default function userInflux(category) {
  Location
    .find({category: category, checkins: {$not: {$size: 0}}})
    .then((document) => {
      // console.log(document)
      getTotalAndNmberOfDocs(document, 'country')
      average = total / numberOfDocs
      lowThreshold = (min + average) / 2
      midThreshold = (average + max) / 2
      total = 0
      average = 0
      min = 0
      max = 0
      Location
        .find({category: category, checkins: {$not: {$size: 0}}})
        .then((place) => {
          place.map((p) => {
            updateDoc(p, 'country')
            return p
          })
          states.map((s) => {
            Location
              .find({category: category, state: s, checkins: {$not: {$size: 0}}})
              .then((document) => {
                getTotalAndNmberOfDocs(document, 'state')
                average = total / numberOfDocs
                lowThreshold = (min + average) / 2
                midThreshold = (average + max) / 2
                total = 0
                average = 0
                min = 0
                max = 0
                Location
                  .find({category: category, state: s, checkins: {$not: {$size: 0}}})
                  .then((place) => {
                    place.map((p) => {
                      updateDoc(p, 'state')
                      return p
                    })
                  })
              })
          })
        })
    })
}