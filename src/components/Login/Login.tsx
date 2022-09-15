import React from 'react'

interface Props {
	connectWithMetamask: () => Promise<
		| {
				data?: import('wagmi-core').ConnectorData<any> | undefined
				error?: Error | undefined
		  }
		| {
				error: Error
		  }
	>
}

const Login: React.FC<Props> = ({ connectWithMetamask }) => {
	return (
		<div className='mx-auto flex min-h-screen max-w-7xl flex-col justify-center items-center'>
			<h1 className='mb-10 text-4xl font-extralight text-center'>
				Learn{' '}
				<span className='font-extrabold underline decoration-blue-900 hover:decoration-blue-400'>
					Web3{' '}
				</span>
				Dao Assignment
			</h1>
			<h1 className='mb-5 text-4xl font-extralight text-center'>
				Kan Kunnawat
			</h1>
			<section className='text-center'>
				<button
					className='bg-transparent hover:bg-blue-500 hover:scale-110 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-all ease-in-out delay-10 mb-5'
					onClick={() => connectWithMetamask()}
				>
					Sign In
				</button>
			</section>
		</div>
	)
}

export default Login
