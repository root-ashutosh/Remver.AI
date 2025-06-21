import React from 'react'
import { testimonialsData } from '../assets/assets'

const Testimonial = () => {
    return (
        <div>
            {/* Title */}
            <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent py-5' >Customer Testimonials
            </h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto px-4 py-8'>

                {testimonialsData.map((item, index) => (
                    <div className='bg-white rounded-xl p-6 drop-shadow-md max-w-lg m-auto hover:scale-105 transition-all duration-500' key={index}>
                        <p className=' text-4xl text-gray-500'>"</p>
                        <p  className=' text-md text-gray-700'>{item.text}</p>
                        <div className='flex items-center mt-4'>
                            <img src={item.image} alt={item.author} className='w-12 h-12 rounded-full mr-4' />
                            <div>
                                <p className='font-semibold'>{item.author}</p>
                                <p className='text-gray-600 text-sm'>{item.jobTitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial
