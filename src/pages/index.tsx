import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
// Thirdweb
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
// Components
import NftList from 'components/NftList'
import Login from 'components/Login'
import OwnNothing from 'components/OwnNothing'
import HashLoader from 'react-spinners/HashLoader'
import { NftProps } from '../../typings'
//Helper Functions
import { friendlyWalletName } from '../helperFunctions/utlis'
import { getLearnWeb3Nfts } from '../helperFunctions/getLearnWeb3Nfts'
import { getBuildspaceNfts } from '../helperFunctions/getBuildSpaceNfts'

const Home: NextPage = () => {
	const [loading, setLoading] = useState<boolean>(false)

	// Auth with thirdweb
	const connectWithMetamask = useMetamask()
	const address = useAddress()
	const disconnect = useDisconnect()

	const [buildspaceNfts, setBuildspaceNfts] = useState<NftProps[]>([])
	const [learnWeb3Nfts, setlearnWeb3Nfts] = useState<NftProps[]>([])

	const checkIsUserOwnNothing = () => {
		return buildspaceNfts.length === 0 && learnWeb3Nfts.length === 0
	}

	// Load Nfts when log in
	useEffect(() => {
		if (!address) return

		setLoading(true)
		Promise.all([getLearnWeb3Nfts(address), getBuildspaceNfts(address)]).then(
			(arr) => {
				setlearnWeb3Nfts(arr[0])
				setBuildspaceNfts(arr[1])
				setLoading(false)
			}
		)
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
