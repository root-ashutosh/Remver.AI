import { Webhook } from 'svix'
import userModel from '../model/userModel.js'




// API controller funtion to manage clerk user with database
// http:localhost:4000/api/user/webhooks

// here we will add the logic so whenever we create a new user in the frontend then we will get the user data in the backend also
const clerkWebhooks = async (req, res) => {
    try {

        //  create a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // whenever a new user is created we will get some data in the request body and headers at this endpoint so we will use this data to verify the this webhook event
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })
        // After this verify method if the svix id ,timestamp ,signature is correct according to the webhook secret then the process will execute further else it will give an error

        // Now if the webhook event is correct -- then check type of 
        // i.e user created ,deleted,updated

        const { data, type } = req.body

        switch (type) {

            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_address[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }
                // saving user data on database
                await userModel.create(userData)
                res.json({})

                break;
            }

            // updating user data in the database
            case "user.updated": {

                const userData = {

                    email: data.email_address[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.findOneAndUpdate({ clerkId: data.id }, userData)
                res.json({})

                break;
            }

            // Deleting user data from database
            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id })
                res.json({})
                break
            }
        }





    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}


export {clerkWebhooks }