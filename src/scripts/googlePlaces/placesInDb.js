import P from 'bluebird'
import R from 'ramda'
import mongoose from 'mongoose'
import * as config from '../../config'

import Location from '../../model/locationSchema'
import {getPlaceIdsByName} from '../../utils/maps'

import fs from 'fs'

mongoose.Promise = P

if (!config.mongo.uri) {
    process.exit(2)
} else {
    mongoose.connect(config.mongo.uri)
}

mongoose.connection.once('open', () => {
    console.log(`Server started in the port ${config.app.port}`)

    function fetchPlacesInDb() {
        return new P((resolve, reject) => {
            Location
                .find({})
                .then((docs) => {
                    resolve(docs.map((d) => R.assoc('_id', d._id.toString(), d.toJSON())))
                })
                .catch((err) => {
                    console.log('Error fetching docs :::', err)
                    reject(err)
                })
        })
    }

    fetchPlacesInDb()
        .then((locations) => {
            fs.writeFile('./src/scripts/googlePlaces/placesInDb.json', JSON.stringify(locations, null, 2), function (err, body) {
                if(err) {
                    return console.log(err);
                }

                console.log("Locations saved!");
            })
        })
        .catch((err) => {
            console.log(err)
        })

})

mongoose.connection.once('error', () => {
    console.error('Failed connection to mongoose')
})
