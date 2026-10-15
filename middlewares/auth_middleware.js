import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export async function protect(req,res,next){

    let token;


    // check karo user ne token bheja hai?
    // or kya uska format thekk hai bhi ya nhi?
    if(req.headers.authorization  && req.headers.authorization.startsWith("Bearer")  ){
        // token ko ek variable me save karengy
        token = req.headers.authorization.split(" ")[1];
    }

    // ab tokin verification krengy
    if(!token){
        res.status(401);
        throw new ("not authorized to access");
    }

    try {

        const decryptedToken = jwt.verify( token, process.env.SECRET_KEY);
        req.user = await UserModel.findById(decryptedToken.id);
        next()
    } 
    
    catch (error) {
        res.status(401);
        next(error)
    }
}


