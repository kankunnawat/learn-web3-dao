import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { useState, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

// Contract Address
import { LearnWeb3DaoAddress } from '../constants/address'
import { BuildSpaceV2Address } from '../constants/address'
// Getting an abi
const LearnWeb3DaoABI = require('../abi/ERC1155_abi.json')
const BuildSpaceV2ABI = require('../abi/ERC721_abi.json')

const Home: NextPage = () => {
	const [walletAddress, setWalletAddress] = useState('')

	async function loadNFTs() {
		const web3 = new Web3(window.ethereum)

		const contract = new web3.eth.Contract(LearnWeb3DaoABI, LearnWeb3DaoAddress)
		contract.defaultAccount = '0xd23e883540cc6ba2407cb3b793c6c8a92654c571'
		const learnWeb3DaoBalance = await contract.methods
			.balanceOf('0xd23e883540cc6ba2407cb3b793c6c8a92654c571', 0)
			.call()
		console.log('learnWeb3DaoBalance', learnWeb3DaoBalance)
	}

	async function requestAccount() {
		console.log('Requesting account...')

		// Check if Meta Mask Extension exists
		if (window.ethereum) {
			console.log('detected')
			try {
				const accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				})
				setWalletAddress(accounts[0])
			} catch (error) {
				console.log('Error connecting...')
			}
		} else {
			alert('Meta Mask not detected')
		}
		const web3 = new Web3(window.ethereum)
		const buildSpaceContract = new web3.eth.Contract(
			BuildSpaceV2ABI,
			BuildSpaceV2Address
		)
		const balanceOf = await buildSpaceContract.methods
			.balanceOf('0x197be7B9D4Ab5bcDd3284cc42641Ea6bA961792f')
			.call()
		console.log('buildspaceBalanceOf', balanceOf)
	}

	// Load nft when log in
	useEffect(() => {
		console.log('inside useeffect')
		loadNFTs()
	}, [])

	// Create a provider to interact with a smart contract
	// async function connectWallet() {
	// 	if (typeof window.ethereum !== 'undefined') {
	// 		await requestAccount()

	// 		const provider = new ethers.providers.Web3Provider(window.ethereum)
	// 	}
	// }

	return (
		<div className='relative h-screen bg-gradient-to-b lg:h-[140vh]'>
			<Head>
				<title>Assignment Kan - LearnWeb3 Dao</title>
				<link rel='icon' href='/logo.jpeg' />
			</Head>
			<main>
				<h1 className='mb-10 text-4xl font-extralight text-center mt-10'>
					Learn
					<span className='font-extrabold underline decoration-blue-900 hover:decoration-blue-400'>
						Web3
					</span>
					Dao Assignment
				</h1>
				<section className='text-center'>
					<button
						className='bg-transparent hover:bg-blue-500 hover:scale-110 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all ease-in-out delay-10'
						onClick={requestAccount}
					>
						{walletAddress ? 'Log out' : 'Request Account'}
					</button>
					<h3 className='pt-5'>Wallet Address: {walletAddress}</h3>
				</section>
			</main>
		</div>
	)
}

export default Home
