
import { messageInRaw, Webhook } from 'svix';
import userModel from '../model/userModel.js';
import razorpay from 'razorpay'
import transactionModel from '../model/transactionModel.js';
// import orders from 'razorpay/dist/types/orders.js';


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




// Controller function to get user available credits data


const userCredit = async (req, res) => {
    try {
        const { clerkId } = req.body;

        if (!clerkId) {
            return res.json({ success: false, message: "Missing clerkId" });
        }

        const userData = await userModel.findOne({ clerkId });

        if (!userData) {
            return res.json({ success: false, message: "User not found in DB" });
        }

        res.json({ success: true, credits: userData.creditBalance });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




// Gateway initialise
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// API to make payment for credits 

const paymentRazorpay = async (req, res) => {
    try {
        const { clerkId, planId } = req.body
        const userData = await userModel.findOne({ clerkId })

        if (!userData || !planId) {
            return res.json({ success: false, message: 'Invalid credentials' })

        }

        // creating data for the transaction
        let credits, plan, amount, date

        switch (planId) {

            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break
            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break
            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break
        }
        date = Date.now()

        // creating transaction
        const transactionData ={
            clerkId,
            plan,
            amount,
            credits,
            date
        }
        // saving transaction data on the database
        const newTransaction = await transactionModel.create(transactionData)

        // creating options for razorpay order
        const options ={
            amount: amount* 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id // we get an id in mongo on creating new data

        }

        // creating razorpay order
        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){ 
                return res.json({success:false,message:error})
            }
            res.json({success:true,order}) //if order created successfuly send response with order details
        })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}


// function to verify razorpay payment
const verifyPayment = async (req,res) => {
    try {
        const {razorpay_order_id  } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id ) 

        if(orderInfo.status === 'paid'){ //payment is succesful

            // fetching transaction data from database
            const transactionData = await transactionModel.findById(orderInfo.receipt) //we stored id in receipt in options

            if(transactionData.payment){ //if the payment is already true i.e it is already verified
                res.json({success:false,message: 'Payment Failed : credits already added'})
            } 
            
            //  adding credits -- for that user
            const userData = await userModel.findOne({clerkId: transactionData.clerkId})
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id,{creditBalance}) //adding credit in user account

            // making the payment true in database
            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

            res.json({success:true, message: "credits Added"})

        }



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}






export { clerkWebhooks, userCredit, paymentRazorpay, verifyPayment }



