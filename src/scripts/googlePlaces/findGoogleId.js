import {getPlaceIdsByName} from '../../utils/maps'
import {categoriesByGroup} from './groupByIdInJSON'

import fs from 'fs'

categoriesByGroup['HILL_STATION'].map((loc) => {
    getPlaceIdsByName((loc.name))
        .then((response) => {
            console.log('Saved for location ---> ', loc.name)
            fs.appendFile('./src/scripts/googlePlaces/placesIDHillStationIDInJSON.js',
                `${JSON.stringify({name: loc.name, results: response}, null, 2)},`,
                (err, doc) => {
                    if (err) {
                        console.log(err)
                    }
                }
            )
        })
        .catch((err) => {
            console.log('Failed for location ---> ', loc.name)
            fs.appendFile('./src/scripts/googlePlaces/timedOutPlaceNames.js',
                `${loc.name}\n`,
                (err, doc) => {
                    if (err) {
                        console.log('Failed for --> ', loc.name)
                    }
                }
            )
        })
})