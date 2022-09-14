import { OwnedNft } from 'alchemy-sdk'

export const friendlyWalletName = (address: String) => {
	const addressLength = address.length
	return `${address.substring(0, 5)}...${address.substring(addressLength - 5)}`
}

export const isUserOwnNothing = (
	buildSpaceNfts: OwnedNft[] | undefined,
	learnWeb3Nfts: number[]
): boolean => {
	return (
		(buildSpaceNfts?.length === 0 || !buildSpaceNfts) &&
		learnWeb3Nfts.every((item) => item == 0)
	)
}
