import Rx from 'rxjs'
import P from 'bluebird'
import R from 'ramda'
import mongoose from 'mongoose'
import * as config from '../../config'

import Location from '../../model/locationSchema'
import {HILL_STATION} from '../googlePlaces/placesIDHillStationIDInJSON'

mongoose.Promise = P

if (!config.mongo.uri) {
    process.exit(2)
} else {
    mongoose.connect(config.mongo.uri)
}

mongoose.connection.once('open', () => {
    console.log(`-------- Database connected -------`)

    const source1 = Rx.Observable.from(HILL_STATION)
    const source2 = source1.concatMap((b) => {
        const rating = b && b.results && b.results.json && b.results.json.results && !R.isEmpty(b.results.json.results) ? (() => {
            return (b.results.json.results.reduce((acc, val) => {return acc + (val.rating ? val.rating : 0)}, 0) / b.results.json.results.length)
        })() : 0

        return Location
            .findOneAndUpdate(
                {category: 'HILL_STATION', name: b.name},
                {$set: {rating, places:
                    b && b.results && b.results.json && b.results.json.results && !R.isEmpty(b.results.json.results) ? (
                        b.results.json.results
                    ) : []
                }},
                {new: true}
            )
    })
        .concatMap((doc) => {
            return Rx.Observable.of(doc)
        })
        .catch((err) => {
            return Rx.Observable.of(err)
        })

    source2.subscribe((doc) => {console.log(doc)})

})

mongoose.connection.once('error', () => {
    console.error('Failed connection to mongoose')
})
