import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import P from 'bluebird'

import * as config from './config'

import eventRoute from './route/eventRoute'
import extractDataFromWikipedia from './scripts/scrappers/wikipediaScrapper'
import getLocationData from './scripts/scrappers/getLocationData'

const app = express()
mongoose.Promise = P

app.use(cors())
app.use(bodyParser.json())

app.use(config.app.uriPrefix, eventRoute())

// extractDataFromWikipedia()
// getLocationData()

if (!config.mongo.uri) {
	process.exit(2)
} else {
	mongoose.connect(config.mongo.uri)
}

mongoose.connection.once('open', () => {
		app.listen(config.app.port, () => {
		console.log(`Server started in the port ${config.app.port}`)
	})
})

mongoose.connection.once('error', () => {
	console.error('Failed connection to mongoose')
})
