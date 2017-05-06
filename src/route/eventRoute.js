import express from 'express'
import R from 'ramda'
import Location from '../model/locationSchema'


export default function eventRoute() {
	const route = express.Router()

	route.get('/places', (req, res) => {
		const params = req.query.params
		console.log(params)
		Event
			.find({})
			.then((places) => {
				res.status(200).send(places)
			})
			.catch((err) => {
				console.log('Error --->', err)
				res.status(400).send()
			})
	})


	return route
}
