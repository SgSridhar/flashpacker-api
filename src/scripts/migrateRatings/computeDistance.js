import Rx from 'rxjs'
import axios from 'axios'
import R from 'ramda'
import Location from '../../model/locationSchema'
import mongoose from 'mongoose'
import * as config from '../../config'


import P from 'bluebird'

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
            let docName
            const source = Rx.Observable.from(docs)
            const source1 = source.concatMap((doc) => {
                docName = doc.name
                return axios({
                    method: 'GET',
                    url: encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${doc.name}&key=AIzaSyBN8HDf7Ua-fdjECRtlQ3ziKuQJKQgZEKw`),
                })
            }).concatMap(({data}) => {
                const lngLat = data && data.results && data.results[0]  && data.results[0].geometry && data.results[0].geometry.location ?
                    [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat] : [0, 0]
                console.log('Long Lat ---> ', lngLat)
                return Location
                    .findOneAndUpdate({name: docName}, {$set: {location: lngLat}}, {new: true})
            })
                .concatMap((updatedDoc) => {
                    return Rx.Observable.of(updatedDoc)
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