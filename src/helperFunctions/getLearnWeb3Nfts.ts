// Native Approach to get Nfts data from LearnWeb3Dao collection
import { NftProps } from '../../typings'
import Web3 from 'web3'
// Getting an abi through require to fix typescript issue with web3js
const LearnWeb3DaoABI = require('../abi/learn_web3_dao_abi.json')
import { LearnWeb3DaoAddress } from '../constants/address'

const totalItemsLearnWeb3NFTs = 4 // learnWeb3Dao nft collection has only 4 items on opensea

export const getLearnWeb3Nfts = async (
	address: string
): Promise<NftProps[]> => {
	const web3 = new Web3(window.ethereum)
	const learnWeb3Contract = new web3.eth.Contract(
		LearnWeb3DaoABI,
		LearnWeb3DaoAddress
	)
	try {
		const ownerLists = await learnWeb3Contract.methods
			.balanceOfBatch(
				Array(totalItemsLearnWeb3NFTs).fill(address),
				[0, 1, 2, 3]
			)
			.call()
		const baseURI = await learnWeb3Contract.methods.baseURI().call()
		let tokenMetadataURI = ''
		let tokenMetadataURIList: string[] = []
		for (let i = 0; i < totalItemsLearnWeb3NFTs; i++) {
			tokenMetadataURI = `https://cloudflare-ipfs.com/ipfs/${
				baseURI.split('ipfs://')[1]
			}/${i}.json`
			tokenMetadataURIList.push(tokenMetadataURI)
		}
		let res = await Promise.all(tokenMetadataURIList.map((e) => fetch(e)))
		let resJson = await Promise.all(res.map((e) => e.json()))
		let learnWeb3Nfts: NftProps[] = resJson.map((item, index) => {
			const image = `https://cloudflare-ipfs.com/ipfs/${
				resJson[index].image.split('ipfs://')[1]
			}`
			return {
				name: item.name,
				description: item.description,
				image: image,
				amount: ownerLists[index],
			}
		})
		return learnWeb3Nfts.every((item) => item.amount === '0')
			? []
			: learnWeb3Nfts
	} catch (error) {
		console.log(error)
		return []
	}
}
