import express from 'express'
import R from 'ramda'
import Location from '../model/locationSchema'


function queryBuilder(params) {
  let query={};
  if(params.category) {
    query = {...query, category: params.category}
  }
  if(params.city) {
    query = {...query, city: params.city}
  }
  if(params.state) {
    query = {...query, state: params.state}
  }
  return query
}

export default function eventRoute() {
	const route = express.Router()

	route.get('/places', (req, res) => {
		const params = req.query
		const query = queryBuilder(params)
		Location
			.find(query)
			.then((places) => {
				res.status(200).send(places)
			})
			.catch((err) => {
				console.log('Error --->', err)
				res.status(400).send()
			})
	})

	route.get('/places/recommendations', (req, res) => {
		const params = req.query
    let query = queryBuilder(R.dissoc('city', params))
		query = {...query, city: {$not: new RegExp(params.city, 'gi')}}
    Location
      .find(query)
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
