import type { NextPage } from 'next'
import Head from 'next/head'

import { useState, useEffect } from 'react'
import Web3 from 'web3'
import { Alchemy } from 'alchemy-sdk'
import { alchemyConfig } from '../../alchemy'

// Components
import NftList from 'components/NftList'
import Login from 'components/Login'
import OwnNothing from 'components/OwnNothing'
import HashLoader from 'react-spinners/HashLoader'
import { NftProps } from '../../typings'

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

import { friendlyWalletName } from '../utlis'

const Home: NextPage = () => {
	const [isLearnWeb3DaoLoading, setIsLearnWeb3DaoLoading] =
		useState<boolean>(false)
	const [isBuildSpaceLoading, setIsBuildSpaceLoading] = useState<boolean>(false)

	const totalItemsLearnWeb3NFTs = 4 // learnWeb3Dao nft collection has only 4 items on opensea

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
		if (!address) return

		const web3 = new Web3(window.ethereum)
		const learnWeb3Contract = new web3.eth.Contract(
			LearnWeb3DaoABI,
			LearnWeb3DaoAddress
		)
		try {
			setIsLearnWeb3DaoLoading(true)
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
			try {
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

				if (learnWeb3Nfts.every((item) => item.amount === '0')) {
					setlearnWeb3Nfts([])
				} else {
					setlearnWeb3Nfts(learnWeb3Nfts)
				}
			} catch (err) {
				console.log(err)
			}
		} catch (error) {
			console.log(error)
		}
		setIsLearnWeb3DaoLoading(false)
	}

	// Alchemy approach for fetching Nfts data from BuildSpaceV2 collection
	const loadBuildspaceNfts = async () => {
		if (!address) return

		try {
			setIsBuildSpaceLoading(true)
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
			setBuildspaceNfts(buildspaceNfts)
		} catch (error) {
			console.log(error)
		}
		setIsBuildSpaceLoading(false)
	}

	const checkIsUserOwnNothing = () => {
		return buildspaceNfts.length === 0 && learnWeb3Nfts.length === 0
	}

	// Load nft when log in
	useEffect(() => {
		if (!address) return

		loadLearnWeb3DaoNFTs()
		loadBuildspaceNfts()
	}, [address])

	if (!address) {
		return <Login connectWithMetamask={connectWithMetamask} />
	}

	if (isLearnWeb3DaoLoading || isBuildSpaceLoading) {
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
				<h1 className='mb-5 text-4xl font-extralight text-center md:mb-10'>
					This is all{' '}
					<span className='font-extrabold underline decoration-blue-900 hover:decoration-blue-400'>
						Nfts{' '}
					</span>
					You own
				</h1>
				<div className='text-center'>
					<h3 className='m-2 text-xl text-blue-400 pb-4'>
						Wallet Address: {friendlyWalletName(address)}
					</h3>
					<button
						className='bg-transparent hover:bg-red-500 hover:scale-110 text-red-400 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded transition-all ease-in-out delay-10 mb-5'
						onClick={() => disconnect()}
					>
						Sign out
					</button>
				</div>
				{checkIsUserOwnNothing() ? (
					<OwnNothing />
				) : (
					<>
						<NftList nfts={learnWeb3Nfts} title='Learn Web3 Dao Collection' />
						<NftList nfts={buildspaceNfts} title='Build Space V2 Collection' />
					</>
				)}
			</main>
		</div>
	)
}

export default Home
