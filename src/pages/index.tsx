import type { NextPage } from 'next'
import Head from 'next/head'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Alchemy } from 'alchemy-sdk'
import { alchemyConfig } from '../../alchemy'

// Components
import NftList from 'components/NftList'
import Login from 'components/Login'
import HashLoader from 'react-spinners/HashLoader'
import { NftProps, RawNftMetadata } from '../../typings'

// Thirdweb
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

// Contract Address
import { LearnWeb3DaoAddress } from '../constants/address'
import { BuildSpaceV2Address } from '../constants/address'
//Test Account Address
import { LearnWeb3DaoOwner } from '../constants/address'
import { BuildSpaceV2Owner } from '../constants/address'
// Getting an abi through require to fix typescript issue with web3js
const LearnWeb3DaoABI = require('../abi/learn_web3_dao_abi.json')

import learnWeb3NFTsData from '../constants/learnWeb3Data'
import { friendlyWalletName, userOwnNothing } from '../utlis'

const Home: NextPage = () => {
	const [loading, setLoading] = useState<boolean>(false)
	const totalItemsLearnWeb3NFTs = 4 // learnWeb3Dao nft collection has only 4 items

	// Auth with thirdweb
	const connectWithMetamask = useMetamask()
	const address = useAddress()
	const disconnect = useDisconnect()
	// Alchemy
	const alchemy = new Alchemy(alchemyConfig)

	const [buildspaceNfts, setBuildspaceNfts] = useState<NftProps[]>([])
	const [learnWeb3Nfts, setlearnWeb3Nfts] = useState<NftProps[]>([])

	// Native Approach to get Nfts data from LearnWeb3Dao collection
	const loadLearnWeb3DaoNFTs = async () => {
		const web3 = new Web3(window.ethereum)
		const learnWeb3Contract = new web3.eth.Contract(
			LearnWeb3DaoABI,
			LearnWeb3DaoAddress
		)
		setLoading(true)
		const ownerLists = await learnWeb3Contract.methods
			.balanceOfBatch(
				Array(totalItemsLearnWeb3NFTs).fill(address),
				[0, 1, 2, 3]
			)
			.call()

		let values: RawNftMetadata[] = []
		Object.values(learnWeb3NFTsData).map((value) => {
			values.push(value)
		})

		let learnWeb3Nfts: NftProps[] = []
		learnWeb3Nfts = values.map((item, index) => ({
			...item,
			amount: ownerLists[index],
		}))
		setlearnWeb3Nfts(learnWeb3Nfts)

		setLoading(false)
	}

	// Alchemy approach for fetching Nfts data from BuildSpaceV2 collection
	const loadBuildspaceNfts = async () => {
		setLoading(true)
		if (!address) {
			return
		}

		const nfts = await alchemy.nft.getNftsForOwner(address)
		const filteredNfts = nfts.ownedNfts.filter((nft) => {
			return nft.contract.address === BuildSpaceV2Address.toLowerCase()
		})

		let buildspaceNfts: NftProps[] = []
		buildspaceNfts = filteredNfts.map((item) => ({
			name: item.rawMetadata?.name,
			image: item.rawMetadata?.image,
			amount: item.balance,
			description: item.rawMetadata?.description,
		}))
		setBuildspaceNfts(buildspaceNfts)
		setLoading(false)
	}

	// Load nft when log in
	useEffect(() => {
		if (address) {
			loadLearnWeb3DaoNFTs()
			loadBuildspaceNfts()
		}
	}, [address])

	if (!address) {
		return <Login connectWithMetamask={connectWithMetamask} />
	}

	if (loading) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<HashLoader size={150} />
			</div>
		)
	}

	return (
		<div className='mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0'>
			<Head>
				<title>Assignment - LearnWeb3 Dao</title>
				<link rel='icon' href='/logo.jpeg' />
			</Head>
			<main>
				<h1 className='mb-10 text-4xl font-extralight text-center '>
					This is all{' '}
					<span className='font-extrabold underline decoration-blue-900 hover:decoration-blue-400'>
						Nfts{' '}
					</span>
					You own
				</h1>
				<section className='text-center'>
					<button
						className='bg-transparent hover:bg-blue-500 hover:scale-110 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all ease-in-out delay-10 mb-5'
						onClick={() => disconnect()}
					>
						Sign out
					</button>
					<h3 className='m-2 text-sm text-blue-400'>
						Wallet Address: {friendlyWalletName(address)}
					</h3>
				</section>
				{/* Display nfts user owns */}

				{!userOwnNothing(buildspaceNfts, learnWeb3Nfts) ? (
					<div className='text-center p-4 text-3xl text-blue-900'>
						You don't own any Build Space V2 or Learn Web3 Dao Nfts
					</div>
				) : (
					<section>
						<NftList nfts={learnWeb3Nfts} title='Learn Web3 Dao Collection' />
						<NftList nfts={buildspaceNfts} title='Build Space V2 Collection' />
					</section>
				)}
			</main>
		</div>
	)
}

export default Home
