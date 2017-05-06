import mongoose from 'mongoose'

const LocationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	fbPlaceId: {
		type: String,
	},
	gPlaceId: {
		type: String
	},
  	location: {
		type: [Number],
		index: '2dsphere'
	},
	rating: {
		type: Number,
		min: 0,
		max: 5
	},
	description: String,
	category: {
		type: String
	},
	places: [],
	city: String,
	state: String,
	country: String,
	relativeLocation: String,
	stateInflux: String,
	countryInflux: String,
	checkins: [{
		date: Number,
		checkins: Number
	}]
})

export default mongoose.model('Location', LocationSchema)

