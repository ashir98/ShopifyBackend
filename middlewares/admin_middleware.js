import jwt from "jsonwebtoken";
import {UserModel} from "../models/user.model.js"



export async function adminProtect(req,res,next){

    let token; // isme token aayega

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }

    try {
        const decryptedToken = jwt.verify(token,process.env.SECRET_KEY);
        
        const userId = decryptedToken.id;

        const userData = await UserModel.findById(userId);

        if(!userData){
            res.status(401); // unauthorized;
            throw new Error("User not found or Invalid User");
        }


        if(userData.role !== "admin"){
            res.status(401);
            throw new Error("Access Denied, you cannot access this Admin Route");
        }


        req.user = userData;
        
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized to access this route")
    }

}