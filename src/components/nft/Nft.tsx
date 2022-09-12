import learnWeb3NFTsData from '../../constants/learnWeb3Data'
import Image from 'next/image'
import { useEffect, useState, CSSProperties } from 'react'
import { NftMetadata, RawNftMetadata } from '../../../typings'
import HashLoader from 'react-spinners/HashLoader'

interface Props {
	nftAmountOwnByUser: number[]
}

const loaderCss: CSSProperties = {
	display: 'block',
	margin: '0 auto',
}

const Nft: React.FC<Props> = ({ nftAmountOwnByUser }) => {
	const [result, setResult] = useState<NftMetadata[]>([])

	const mapAmountToNft = () => {
		let values: RawNftMetadata[] = []
		Object.entries(learnWeb3NFTsData).map(([key, value]) => {
			values.push(value)
		})
		let result: NftMetadata[] = []

		result = values.map((item, index) => ({
			...item,
			amount: nftAmountOwnByUser[index],
		}))
		setResult(result)
	}

	useEffect(() => {
		if (!nftAmountOwnByUser) return

		mapAmountToNft()
		console.log('result', result)
	}, [nftAmountOwnByUser])

	if (!result) {
		return <HashLoader cssOverride={loaderCss} />
	}

	return (
		<div className='bg-slate-100 p-10 shadow-xl shadow-rose-400/20'>
			<div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
				{result.map((item, index) => (
					<section
						key={index}
						className='flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-105'
					>
						<Image
							className='object-cover rounded-2xl'
							src={item.imageURL}
							alt='nft'
							width={280}
							height={350}
						/>
						<div className='p-5'>
							<h2 className='text-3xl'>{item.name}</h2>
							<h3 className='pt-2 text-lg text-gray-700'>
								Amount: {item.amount}
							</h3>
							<p className='mt-2 text-sm text-gray-400'>{item.description}</p>
						</div>
					</section>
				))}
			</div>
		</div>
	)
}

export default Nft
