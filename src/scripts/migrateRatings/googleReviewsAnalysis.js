import Rx from 'rxjs'
import axios from 'axios'
import R from 'ramda'
import Location from '../../model/locationSchema'
import mongoose from 'mongoose'
import * as config from '../../config'


import P from 'bluebird'

function getRatingBasedOnStateInflux(s) {
    if (s === 'LOW') {
        return 5
    }
    if (s === 'MEDIUM') {
        return 3.5
    }
    return 2
}

function fetchData() {
    return new P((resolve, reject) => {
        Location
            .find({location: {$not: {$size: 0}}})
            .then((docs) => {
                resolve(docs.map((doc) => R.merge(doc.toJSON(), {_id: doc._id.toString()})))
            })
            .catch((err) => {
                console.log('Error fetching values')
                reject(err)
            })
    })
}

if (!config.mongo.uri) {
    process.exit(2)
} else {
    mongoose.connect(config.mongo.uri)
}

mongoose.connection.once('open', () => {
    console.log('--- Connected to mongo ---')
    fetchData()
        .then((docs) => {
            const source = Rx.Observable.from(docs)
            const source1 = source.concatMap((doc) => {
                const reviewStateRate = doc.stateInflux ? (getRatingBasedOnStateInflux(doc.stateInflux) + (doc.rating ? doc.rating : 0))/2 : (doc.rating ? doc.rating : 0)
                const reviewCountryRate = doc.countryInflux ? (getRatingBasedOnStateInflux(doc.countryInflux) + (doc.rating ? doc.rating : 0))/2 : (doc.rating ? doc.rating : 0)

                console.log('Review state rate --->', reviewStateRate)
                console.log('Review country rate --->', reviewCountryRate)

                return Location
                    .findOneAndUpdate(
                        {_id: doc._id},
                        {$set: {reviewStateRate, reviewCountryRate}},
                        {new: true}
                    )
            })
                .concatMap((doc) => {
                    return Rx.Observable.of(doc)
                })
                .catch((err) => {
                return Rx.Observable.of(err)
            })

            source1.subscribe((val) => {
                console.log('Document Updated --->', val)
            })
        })
})

mongoose.connection.once('error', () => {
    console.error('Failed connection to mongoose')
})