import type { NextPage } from 'next'
import Head from 'next/head'

import { useState, useEffect } from 'react'
import { Contract, ethers, providers } from 'ethers'
import Web3 from 'web3'

// Contract Address
import { LearnWeb3DaoAddress } from '../constants/address'
import { BuildSpaceV2Address } from '../constants/address'

//Test Account Address
import { LearnWeb3DaoOwner } from '../constants/address'
import { BuildSpaceV2Owner } from '../constants/address'

// Getting an abi, use require to fix typescript issue
const LearnWeb3DaoABI = require('../abi/learn_web3_dao_abi.json')
const BuildSpaceV2ABI = require('../abi/build_space_v2_abi.json')

// Components
import Nft from '../components/nft'

// Thirdweb
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

const Home: NextPage = () => {
	const [nftAmountOwnByUser, setNftAmountOwnByUser] = useState<number[]>([])
	const totalItemsLearnWeb3NFTs = 4 // learnWeb3Dao nft collection has only 4 items
	var ownerOfLists: string[] = []

	// Auth with thirdweb
	const connectWithMetamask = useMetamask()
	const address = useAddress()
	const disconnect = useDisconnect()

	const loadLearnWeb3DaoNFTs = async () => {
		const web3 = new Web3(window.ethereum)

		// LearnWeb3DaoContract
		const learnWeb3Contract = new web3.eth.Contract(
			LearnWeb3DaoABI,
			LearnWeb3DaoAddress
		)
		const ownerLists = await learnWeb3Contract.methods
			.balanceOfBatch(
				Array(totalItemsLearnWeb3NFTs).fill(LearnWeb3DaoOwner),
				[0, 1, 2, 3]
			)
			.call()
		setNftAmountOwnByUser(ownerLists)
	}

	// ERC721Enumerable
	// const getMetaData = async (balance: number, contract: any) => {
	// 	for (let i = 0; i < balance; i++) {
	// 		const tokenId = await contract.methods
	// 			.tokenOfOwnerByIndex(address, i)
	// 			.call()
	// 		console.log('tokenId', tokenId)
	// 	}
	// }

	// Load nft when log in
	useEffect(() => {
		if (address) {
			loadLearnWeb3DaoNFTs()
		}
	}, [address])

	const loadBuildSpaceNfts = async () => {
		const web3 = new Web3(window.ethereum)

		// BuildSpaceContract
		const buildSpaceContract = new web3.eth.Contract(
			BuildSpaceV2ABI,
			BuildSpaceV2Address
		)
		console.log('buildSpaceContract', buildSpaceContract)

		const buildSpaceBalance = await buildSpaceContract.methods
			.balanceOf(BuildSpaceV2Owner)
			.call()
		console.log('buildSpaceBalance', buildSpaceBalance)

		// get totalsupply by binarySearch => max at index 21812
		const ownerOf = await buildSpaceContract.methods.ownerOf(21812).call()
		console.log('ownerOf', ownerOf)

		const baseURI = await buildSpaceContract.methods.tokenURI(10000).call()
		console.log('baseURI', baseURI)

		const claimed = await buildSpaceContract.methods
			.claimed(BuildSpaceV2Owner, 'CHc4f6a1ec-dfa6-4679-9ad3-59301b7f2bee')
			.call()
		console.log('claimed', claimed)

		const tokenURI = await buildSpaceContract.methods.tokenURI(claimed).call()
		console.log('tokenURI', tokenURI)

		console.log('start calling')
		for (let i = 0; i < 20000; i++) {
			try {
				const ownerOf = await buildSpaceContract.methods.ownerOf(i).call()
				ownerOfLists.push(ownerOf)
			} catch (error) {
				console.log('error', error)
			}
		}
		console.log('ownerOfLists', ownerOfLists)
		console.log('finish calling')
	}

	const friendlyWalleName = (address: String) => {
		const addressLength = address.length
		return `${address.substring(0, 5)}...${address.substring(
			addressLength - 5
		)}`
	}

	return (
		<div className='mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0'>
			<Head>
				<title>Assignment Kan - LearnWeb3 Dao</title>
				<link rel='icon' href='/logo.jpeg' />
			</Head>
			<main>
				<h1 className='mb-10 text-4xl font-extralight text-center '>
					Learn
					<span className='font-extrabold underline decoration-blue-900 hover:decoration-blue-400'>
						Web3
					</span>
					Dao Assignment
				</h1>
				<section className='text-center'>
					<button
						className='bg-transparent hover:bg-blue-500 hover:scale-110 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all ease-in-out delay-10 mb-5'
						onClick={() => (address ? disconnect() : connectWithMetamask())}
					>
						{address ? 'Sign out' : 'Sign In'}
					</button>

					{address && (
						<h3 className='m-2 text-sm text-blue-400'>
							Wallet Address: {friendlyWalleName(address)}
						</h3>
					)}
				</section>
				{/* Display nfts user owns */}
				<Nft nftAmountOwnByUser={nftAmountOwnByUser} />
			</main>
		</div>
	)
}

export default Home
