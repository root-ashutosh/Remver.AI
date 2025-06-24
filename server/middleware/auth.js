

import jwt from 'jsonwebtoken'


const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorised. Login again" });
    }

    const token_decode = jwt.decode(token);

    //  Use .sub instead of .clerkId to get clerkId from clerk token
    req.body = req.body || {}; // if req.body is undefined assign it an empty object
    req.body.clerkId = token_decode?.sub; // jo hum custom session create kiye the wo save nhi hua iske wajah se.clerkId use nhi krr paye

    if (!req.body.clerkId) {
      return res.json({ success: false, message: "userAuth me:clerkId is not defined in token" });
    }

    next();


  } catch (error) {
    console.log("authUser ka error:", error.message);
    res.json({ success: false, message: error.message });
  }
}
export default authUser;