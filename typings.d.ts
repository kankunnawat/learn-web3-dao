export interface NftMetadata {
	name: string
	description: string
	imageURL: string
	amount: number
}

export interface RawNftMetadata {
	name: string
	description: string
	imageURL: string
}

export interface OwnedNftsResponse {
	ownedNfts: OwnedNft[]
	pageKey?: string
	totalCount: number
	blockHash?: string
}

export interface OwnedNft {
	balance: number
	contract: {
		address: string
	}
	description: string
	media: TokenUri[]
	metadataError?: string
	rawMetadata: {
		attributes: Attribute[]
		description: string
		image: string
		name: string
	}
	timeLastUpdated: string
	title: string
	tokenId: string
	tokenType: string
	tokenUri: TokenUri
}

interface TokenUri {
	gateway: string
	raw: string
}

interface Attribute {
	value: string
	trait_type: string
}
