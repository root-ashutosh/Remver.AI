import React from 'react'
import { assets } from '../assets/assets'

const Uplaod = () => {
    return (
        <div>
            <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-black to-blue-400 bg-clip-text text-transparent py-5 md:py-16'>See the magic. Try Now</h1>

            {/* Button */}
            <div className='text-center mb-24'>
                <input type="file" name="" id="upload2" hidden />
                <label className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-black to-blue-400 m-auto hover:scale-105 transition-all duration-500' htmlFor="upload2">
                    <img width={20} src={assets.upload_btn_icon} alt="" />
                    <p className='text-white text-sm'>Upload your image</p>
                </label>
            </div>



        </div>
    )
}

export default Uplaod
