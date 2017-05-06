import {mongoCreds} from '../mongo-creds'

export const app = {
	name: 'FlashPacker',
	uriPrefix: '/api/v1',
	port: process.env.PORT || '3000',
}

export const mongo = {
	uri: `mongodb://${mongoCreds.username}:${mongoCreds.password}@ds137090.mlab.com:37090/flashpacker`,
	poolSize: 5,
}

