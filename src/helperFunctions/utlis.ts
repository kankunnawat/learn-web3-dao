export const friendlyWalletName = (address: String) => {
	const addressLength = address.length
	return `${address.substring(0, 5)}...${address.substring(addressLength - 5)}`
}
