import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../context/AppContext'


const Navbar = () => {

    const { openSignIn } = useClerk()
    const { isSignedIn, user, isLoaded } = useUser() // provides access to users data
    const { credit, loadCreditData } = useContext(AppContext)

    const navigate = useNavigate()



    // to avoid error when page is not loaded -- call loadcreditData only after the page is loaded and user is signed in to avoid error
    useEffect(() => {
        console.log("isLoaded:", isLoaded, "isSignedIn:", isSignedIn);
        if (isSignedIn && isLoaded) {
            loadCreditData()
        }

    }, [isSignedIn, isLoaded])


    return (
        <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
            <Link to={'/'}><img className=' w-32 sm:44' src={assets.logo} alt="" /></Link>

            {/* If the user is signed in then we will show users profile else we will show the get started button  */}
            {
                isSignedIn
                    ? <div className='flex items-center gap-2 sm:gap-3'>
                        <button onClick={() => navigate('/buy')} className=' flex items-center gap-2 bg-gradient-to-tr from-black to-yellow-400 text-white px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-500 '>
                            <img className=' w-5' src={assets.credit_icon} alt="" />
                            <p className=' text-xs sm:text-sm font-medium'>Credits : {credit} </p>
                        </button>
                        <p className='text-gray-600 max-sm:hidden '>Hi,{user.firstName}</p>
                        <UserButton />
                    </div>

                    : <button onClick={() => openSignIn({})} className='bg-gradient-to-tr from-black to-blue-600 hover:from-blue-600 hover:to-black 
             transition-all duration-500 ease-in-out transform hover:scale-105 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'>Get Started !!</button>
            }

        </div>
    )
}

export default Navbar
