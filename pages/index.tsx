import { useState } from 'react'
import { ethers, providers } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
	const [walletAddress, setWalletAddress] = useState('')

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
	}

	// Create a provider to interact with a smart contract
	async function connectWallet() {
		if (typeof window.ethereum !== 'undefined') {
			await requestAccount()

			const provider = new ethers.providers.Web3Provider(window.ethereum)
		}
	}

	return (
		<div className='relative h-screen bg-gradient-to-b lg:h-[140vh]'>
			<Head>
				<title>Assignment Kan - LearnWeb3 Dao</title>
				<link rel='icon' href='/logo.jpeg' />
			</Head>
			<main>
				<h1 className='mb-10 text-4xl font-extralight text-center pt-10'>
					Learn
					<span className='font-extrabold underline decoration-blue-900 hover:decoration-blue-400'>
						Web3
					</span>
					Dao Assignment
				</h1>
				<section>
					<button onClick={requestAccount}>Request Account</button>
					<h3>Wallet Address: {walletAddress}</h3>
				</section>
			</main>
		</div>
	)
}

export default Home
