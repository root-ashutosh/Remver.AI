import { createContext, useState } from "react";
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [credit, setcredit] = useState(false)
    const [image, setimage] = useState(false) // to store image from user with bg
    const [resultImage, setresultImage] = useState(false) // to store image from backend without bg

    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const { getToken } = useAuth()
    const { isSignedIn } = useUser()
    const { openSignIn } = useClerk() // clerk function to open sign in menu


    // function to load user credits 
    const loadCreditData = async () => {

        try {
            const token = await getToken();

            // get user credits from the backend
            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } });

            console.log("Response from backend:", data);

            if (data.success) { //data fetched succesfully from backend
                setcredit(data.credits);
                console.log(" Credits set to:", data.credits);
            } else {
                toast.error(data.message || "AppContext:Failed to load credits");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // function to remove the background of the uploaded image
    const removeBg = async (image) => {
        try {
            if (!isSignedIn) { //user not signed in 
                return openSignIn()
            }
            // storing the image from user with bg
            setimage(image)
            setresultImage(false)

            // redirect user to result page 
            navigate('/result')

            const token = await getToken() //getting token from clerk

            // sending image to backend as formdata
            const formData = new FormData()
            image && formData.append('image',image)

            const {data} = await axios.post(backendUrl + '/api/image/remove-bg',formData,{headers:{token}})

            if(data.success){
                setresultImage(data.resultImage)
                data.creditBalance && setcredit(data.creditBalance) //if we get credit balance in response then set credit
            }
            else{
                toast.error(data.message)
                data.creditBalance && setcredit(data.creditBalance)

                // if credit balance is 0 then send user to purchase page
                if ( data.creditBalance === 0 ){
                    navigate('/buy')
                }

            }


        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const value = {
        credit, setcredit, loadCreditData, backendUrl,image, setimage, removeBg,resultImage,setresultImage,
    }

    return (

        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider