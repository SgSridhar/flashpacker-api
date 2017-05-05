import mongoose from 'mongoose'

const LocationSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	placeId: {
		type: String,
	},
  location: {
		type: Number,
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
	state: String,
	country: String,
	relativeLocation: String,
	popularity: String,
	checkins: [{
		date: Number,
		checkins: Number
	}]
})

export default mongoose.model('Location', LocationSchema)

