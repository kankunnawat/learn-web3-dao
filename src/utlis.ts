import { NftProps } from '../typings'

export const friendlyWalletName = (address: String) => {
	const addressLength = address.length
	return `${address.substring(0, 5)}...${address.substring(addressLength - 5)}`
}

export const userOwnNothing = (
	buildSpaceNfts: NftProps[],
	learnWeb3Nfts: NftProps[]
): boolean => {
	return (
		(buildSpaceNfts?.length === 0 || !buildSpaceNfts) &&
		(learnWeb3Nfts?.length === 0 || !learnWeb3Nfts) &&
		learnWeb3Nfts.every((item) => item.amount === 0)
	)
}
