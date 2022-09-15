import { Alchemy } from 'alchemy-sdk'
import { alchemyConfig } from '../../alchemy'
import { NftProps } from '../../typings'
import { BuildSpaceV2Address } from '../constants/address'

// Alchemy approach for fetching Nfts data from BuildSpaceV2 collection
export const getBuildspaceNfts = async (
	address: string
): Promise<NftProps[]> => {
	const alchemy = new Alchemy(alchemyConfig)
	try {
		const nfts = await alchemy.nft.getNftsForOwner(address)
		const filteredNfts = nfts.ownedNfts.filter((nft) => {
			return nft.contract.address === BuildSpaceV2Address.toLowerCase()
		})
		let buildspaceNfts: NftProps[] = []
		buildspaceNfts = filteredNfts.map((item) => ({
			name: item.rawMetadata?.name,
			image: item.rawMetadata?.image,
			amount: item.balance.toString(),
			description: item.rawMetadata?.description,
		}))
		return buildspaceNfts
	} catch (error) {
		console.log(error)
		return []
	}
}
