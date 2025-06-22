
import { Webhook } from 'svix';
import userModel from '../model/userModel.js';


// // here we will add the logic so whenever we create a new user in the frontend then we will get the user data in the backend also

const clerkWebhooks = async (req, res) => {
    try {
        console.log("Clerk webhook triggered");

        // whenever a new user is created we will get some data in the request body 
        // and headers at this endpoint so we will use this data to verify this webhook event
        const payload = req.body.toString(); // Raw body as string for Svix
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        //  creatimg a svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        // verifying webhook event -- similar to jwt token decode
        const evt = await whook.verify(payload, headers);


        // Now if the webhook event is correct -- then check type of 
        // i.e user created ,deleted,updated
        const { data, type } = evt;


        switch (type) {

            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses?.[0]?.email_address || '',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    photo: data.image_url || '',
                };

                console.log(" Creating user in DB:", userData);

                try {
                    await userModel.create(userData);
                    console.log("User created and saved to DB");
                } catch (dbErr) {
                    console.error("DB error while creating user:", dbErr.message);
                }

                break;
            }

            case "user.updated": {

                const userData = {
                    email: data.email_addresses?.[0]?.email_address || '',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    photo: data.image_url || '',
                };

                try {
                    await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
                    console.log("User updated in DB");
                } catch (dbErr) {
                    console.error("DB Error while updating user:", dbErr.message);
                }

                break;
            }

            case "user.deleted": {
                try {
                    await userModel.findOneAndDelete({ clerkId: data.id });
                    console.log("User deleted from DB");
                } catch (dbErr) {
                    console.error("DB Error while deleting user:", dbErr.message);
                }

                break;
            }

            default:
                console.log("Unhandled webhook type:", type);
        }

        res.status(200).json({ success: true });


    } catch (err) {
        console.error(" Webhook verification or logic error:", err.message);
        res.status(400).json({ success: false, message: err.message });
    }
};

export { clerkWebhooks };

