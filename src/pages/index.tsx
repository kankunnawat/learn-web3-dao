import type { NextPage } from 'next'
import Head from 'next/head'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Alchemy, Network, OwnedNft } from 'alchemy-sdk'

// Contract Address
import { LearnWeb3DaoAddress } from '../constants/address'
import { BuildSpaceV2Address } from '../constants/address'

//Test Account Address
import { LearnWeb3DaoOwner } from '../constants/address'
import { BuildSpaceV2Owner } from '../constants/address'

// Getting an abi, use require to fix typescript issue with web3js
const LearnWeb3DaoABI = require('../abi/learn_web3_dao_abi.json')
const BuildSpaceV2ABI = require('../abi/build_space_v2_abi.json')
const ERC721EnumerableABI = require('../abi/erc721_abi.json')

// Components
import Nft from '../components/nft'
import NftBuildSpace from 'components/NftBuildSpace'

// Thirdweb
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

const Home: NextPage = () => {
	// State for learnWeb3Dao nft
	const [nftAmountOwnByUser, setNftAmountOwnByUser] = useState<number[]>([])
	const totalItemsLearnWeb3NFTs = 4 // learnWeb3Dao nft collection has only 4 items

	// Auth with thirdweb
	const connectWithMetamask = useMetamask()
	const address = useAddress()
	const disconnect = useDisconnect()
	// Alchemy
	const [nfts, setNfts] = useState<OwnedNft[]>()

	// Alchemy config
	const config = {
		apiKey: process.env.ALCHEMY_API_KEY,
		network: Network.MATIC_MAINNET,
	}
	const alchemy = new Alchemy(config)

	// Alchemy approach for fetching Nfts data from BuildSpaceV2 collection
	const loadBuildspaceNfts = async () => {
		if (address) {
			const nfts = await alchemy.nft.getNftsForOwner(BuildSpaceV2Owner)

			const filteredNfts = nfts.ownedNfts.filter((nft) => {
				return nft.contract.address === BuildSpaceV2Address.toLowerCase()
			})

			setNfts(filteredNfts)
		}
	}

	// Native Approach to get Nfts data from LearnWeb3Dao collection
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

	// Load nft when log in
	useEffect(() => {
		if (address) {
			loadLearnWeb3DaoNFTs()
			loadBuildspaceNfts()
		}
	}, [address])

	const friendlyWalletName = (address: String) => {
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
							Wallet Address: {friendlyWalletName(address)}
						</h3>
					)}
				</section>
				{/* Display nfts user owns */}
				<section>
					{address && <Nft nftAmountOwnByUser={nftAmountOwnByUser} />}
					{address && <NftBuildSpace nfts={nfts} />}
				</section>
			</main>
		</div>
	)
}

export default Home
