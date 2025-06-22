// import { Webhook } from 'svix'
// import userModel from '../model/userModel.js'




// // API controller funtion to manage clerk user with database
// // http://localhost:4000/api/user/webhooks

// // here we will add the logic so whenever we create a new user in the frontend then we will get the user data in the backend also
// const clerkWebhooks = async (req, res) => {
//     console.log("Webhook triggered", req.body);

//     try {

//         //  create a svix instance with clerk webhook secret
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         // whenever a new user is created we will get some data in the request body and headers at this endpoint so we will use this data to verify the this webhook event
//         await whook.verify(JSON.stringify(req.body), {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         })
//         // After this verify method if the svix id ,timestamp ,signature is correct according to the webhook secret then the process will execute further else it will give an error

//         // Now if the webhook event is correct -- then check type of 
//         // i.e user created ,deleted,updated

//         const { data, type } = req.body

//         switch (type) {

//             case "user.created": {
//                 const userData = {
//                     clerkId: data.id,
//                     email: data.email_address[0].email_address,
//                     firstName: data.first_name,
//                     lastName: data.last_name,
//                     photo: data.image_url
//                 }
//                 // saving user data on database
//                 await userModel.create(userData)
//                 res.json({})

//                 break;
//             }

//             // updating user data in the database
//             case "user.updated": {

//                 const userData = {

//                     email: data.email_address[0].email_address,
//                     firstName: data.first_name,
//                     lastName: data.last_name,
//                     photo: data.image_url
//                 }

//                 await userModel.findOneAndUpdate({ clerkId: data.id }, userData)
//                 res.json({})

//                 break;
//             }

//             // Deleting user data from database
//             case "user.deleted": {
//                 await userModel.findOneAndDelete({ clerkId: data.id })
//                 res.json({})
//                 break
//             }
//         }





//     } catch (error) {
//         console.log("Svix verification failed",error.message);
//         res.json({ success: false, message: error.message })

//     }

// }


// export {clerkWebhooks }

import { Webhook } from 'svix';
import userModel from '../model/userModel.js';

const clerkWebhooks = async (req, res) => {
    try {
        console.log("🔔 Clerk webhook triggered");

        const payload = req.body.toString(); // ✅ raw JSON string from express.raw()
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = await wh.verify(payload, headers); // ✅ will throw if invalid

        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await userModel.create(userData);
                console.log("✅ user.created saved");
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses?.[0]?.email_address || '',
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                };
                await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                console.log("🔄 user.updated handled");
                break;
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id });
                console.log("❌ user.deleted removed");
                break;
            }
        }

        res.status(200).json({ success: true });

    } catch (err) {
        console.error("⚠️ Webhook error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export { clerkWebhooks };
