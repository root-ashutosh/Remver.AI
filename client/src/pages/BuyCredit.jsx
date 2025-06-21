import React from 'react'
import { plans } from '../assets/assets'
import { assets } from '../assets/assets'

const BuyCredit = () => {
  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6 hover:scale-105 transition-all duration-300'>Our Plans</button>
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent py-2 mb-6 sm:mb-10 '>Choose the plan that's right for you</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4'>
        {plans.map((item, index) => (
          <div key={index} className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
            <img width={40} src={assets.logo_icon} alt={`${item.id} icon`} className='mx-auto mb-4' />
            <p className='font-bold text-lg mb-2'>{item.id}</p>
            <p className='text-gray-600 mb-4'>{item.desc}</p>
            <p className='text-xl font-semibold mb-4'>
              <span>${item.price}</span> / {item.credits} credits
            </p>
            <button className="text-white px-6 py-2 rounded-full bg-gradient-to-br from-black to-blue-600 hover:from-blue-600 hover:to-black 
             transition-all duration-500 ease-in-out transform hover:scale-105">
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyCredit
