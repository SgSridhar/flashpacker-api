import Location from '../../model/locationSchema'

export function userInflux() {
  Location
    .find({category: "HILL_STATION"})
    .then((doc) => {

    })
}