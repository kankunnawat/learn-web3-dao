import { NftProps } from '../../../typings'
import Image from 'next/image'

interface Props {
	nfts: NftProps[]
	title: string
}
const NftList: React.FC<Props> = ({ nfts, title }) => {
	if (!nfts || nfts.length === 0) {
		return (
			// <div className='text-center p-4 text-3xl text-blue-900'>
			// 	You don't own any nft in {title}
			// </div>
			null
		)
	}

	return (
		<div className='bg-slate-100 px-10 py-5 shadow-xl shadow-rose-400/20'>
			<h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold pb-10'>
				{title}
			</h1>
			<div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
				{nfts.map((item, index) => {
					return (
						<section
							key={index}
							className='flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-105'
						>
							{item.image && (
								<Image
									className='object-cover rounded-2xl'
									src={item.image}
									alt='nft'
									width={280}
									height={350}
								/>
							)}
							<div className='p-5'>
								<h2 className='text-3xl'>{item.name}</h2>
								<h3 className='pt-2 text-lg text-gray-700'>
									Amount: {item.amount}
								</h3>
								<p className='mt-2 text-sm text-gray-400'>{item.description}</p>
							</div>
						</section>
					)
				})}
			</div>
		</div>
	)
}

export default NftList
