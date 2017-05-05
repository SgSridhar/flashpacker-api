import express from 'express'
import R from 'ramda'

import Location from '../model/locationSchema'


export default function eventRoute() {
	const route = express.Router()

	route.post('/location', (req, res) => {
		Event
			.find({})
			.then((events) => {
				res.status(200).send(events)
			})
			.catch((err) => {
				console.log('Error --->', err)
				res.status(400).send()
			})
	})


	return route
}
