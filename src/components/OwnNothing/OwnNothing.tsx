import React from 'react'

interface Props {}

const OwnNothing: React.FC<Props> = ({}) => {
	return (
		<div className=''>
			<div className='text-center p-4 text-3xl text-blue-900'>
				You don't own any nft in Build Space V2 or Learn Web3 Dao collection
			</div>
		</div>
	)
}

export default OwnNothing
