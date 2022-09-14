import { Network } from 'alchemy-sdk'

// Alchemy config
export const alchemyConfig = {
	apiKey: process.env.ALCHEMY_API_KEY,
	network: Network.MATIC_MAINNET,
}
