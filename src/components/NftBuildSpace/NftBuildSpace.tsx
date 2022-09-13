import { useEffect, useState, CSSProperties } from 'react'
import { OwnedNft } from 'alchemy-sdk'
import HashLoader from 'react-spinners/HashLoader'
import Image from 'next/image'

interface Props {
	nfts: OwnedNft[] | undefined
}

const loaderCss: CSSProperties = {
	display: 'block',
	margin: '0 auto',
}

const NftBuildSpace: React.FC<Props> = ({ nfts }) => {
	console.log('nft buildspace own', nfts)
	if (!nfts || nfts.length === 0) {
		return <div>You don't own any Buildspace nft</div>
	}

	return (
		<div className='bg-slate-100 px-10 shadow-xl shadow-rose-400/20'>
			<h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold pb-10'>
				Build Space V2 Collection
			</h1>
			<div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
				{nfts.map((item, index) => {
					return (
						<section
							key={index}
							className='flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-105'
						>
							{item.rawMetadata?.image && (
								<Image
									className='object-cover rounded-2xl'
									src={item.rawMetadata?.image}
									alt='nft'
									width={280}
									height={350}
								/>
							)}
							<div className='p-5'>
								<h2 className='text-3xl'>{item.rawMetadata?.name}</h2>
								<h3 className='pt-2 text-lg text-gray-700'>
									Amount: {item.balance}
								</h3>
								<p className='mt-2 text-sm text-gray-400'>
									{item.rawMetadata?.description}
								</p>
							</div>
						</section>
					)
				})}
			</div>
		</div>
	)
}

export default NftBuildSpace
