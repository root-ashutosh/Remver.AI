import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from '../model/userModel.js'


// function to remove bg from image
const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.body
        const user = await userModel.findOne({ clerkId })

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }
        // checking credit balance of user if it's sufficient then only will remove bg

        if (user.creditBalance <= 0) {
            return res.json({ success: false, message: "No credit Balance", creditBalance: user.creditBalance })
        }
        // if user has some credit - getting image to edit
        const imagePath = req.file.path

        // reading image file -- now we have image in this variable
        const imageFile = fs.createReadStream(imagePath)

        // storing image as formdata so that we can accces clip drop API
        const formdata = new FormData()
        formdata.append('image_file', imageFile)

        // api call to clipdrop api for bg removal
        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formdata, {
            headers: { 'x-api-key': process.env.CLIPDROP_API },
            responseType: 'arraybuffer'

        })

        // Now in data we will get image with removed bg
        // so we have to send this data as response to frontend and for that
        //  we will create a base64 image with this data
        const base64Image = Buffer.from(data, 'binary').toString('base64')

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`


        // // So before sending the final image we will deduct 1 credit from user credits 
        // Deduct 1 credit
        await userModel.findByIdAndUpdate(user._id, {
            $inc: { creditBalance: -1 }
        });

        // Get the updated user data
        const updatedUser = await userModel.findById(user._id);

        // Send response with correct balance
        res.json({
            success: true,
            resultImage,
            creditBalance: updatedUser.creditBalance,
            message: 'Background Removed'
        });




    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}
export { removeBgImage }