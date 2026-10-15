import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../util/generateToken.js";
import crypto from 'crypto';
import { sendPasswordResetEmail } from "../util/emailService.js";

//=============================================
// REGISTER A USER ACCOUNT
//=============================================
async function registerUser(req, res, next) {
    try {
        // user se sara data lo
        const { name, email, password } = req.body;


        // agar user kuch miss karde phir?
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Name, email and password is required")
        }

        if(password.length < 6){
            res.status(400);
            throw new Error("Password should be atleast 6 digit long")

        }

        // check karo user already hai db me email ki basis pe?
        const userExist = await UserModel.findOne({ email });


        // agar already register hai?
        if (userExist) {
            res.status(400);
            throw new Error("This email is already registered");
        }

        // agar register nhi hai?
        else {


            // password ko encrypt karo
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(password, salt);


            // bas ab ye sab data db me insert kardo
            await UserModel.create({
                name,
                email,
                password: encryptedPassword
            });



            // ab user ko response de do k apka account register hogaya
            res.status(200).json({
                success: true,
                message: "Account created!"
            })
        }



    } catch (error) {
        res.status(400);
        next(error)


    }
}



//=============================================
// LOGIN USER ACCOUNT
//=============================================
async function loginUser(req,res,next){
    try {

        // user se email or password lena hai.
        const {email, password} = req.body;
        

        // check karo k email or password provide kiya bhi hai?
        if (!email || !password) {
            res.status(400) // bad request
            throw new Error("Please provide email and password");
        }


        // check karo k user register tha bhi? db me check karo
        const userAccount = await UserModel.findOne({ email });


        // agar register nhi hai?
        if(!userAccount){
            res.status(400) // bad request
            throw new Error("This email is not registered.")
        }
        // agar register hai? phir?
        // phir ek token banaow. 
        else{
            const accessToken = generateToken(
                userAccount._id,
                userAccount.name,
                userAccount.email,
                userAccount.role
            );


            const isPasswordCorrect =  await bcrypt.compare(password, userAccount.password );

            if(isPasswordCorrect){
                res.status(200).json({
                    sucess: true,
                    message: "Login success",
                    accessToken
                })
            }
            else{
                res.status(400);
                throw new Error("Incorrect Password")
            }
        }
    } 
    
    catch (error) {
        next(error) 
    }

}



//=============================================
// GET USER PROFILE
//=============================================
async function getMyProfile(req,res){
    const userData = req.user;
    res.status(200).json({
        success: true,
        message: "Authorized",
        userData
    })
}


//=============================================
// FORGET PASSWORD
//=============================================
async function forgetPassword(req,res,next){
    try {
        const {email} = req.body;


        if(!email){
            res.status(400);
            throw new Error("Please provide email");
        }

        // check krengy k user ka account bana hua hai ya nhi
        const userData = await UserModel.findOne({email});


        // agar nhi bana hua?
        if(!userData){
            return res.status(200).json({message: "If your email is registered. you will receive an email!"});
        }
        else{

            // ek token banaynge reset password link k lye
            const resetToken = crypto.randomBytes(32).toString('hex');

            userData.resetPasswordToken = resetToken;
            userData.resetPasswordExpires = Date.now() + 1800000;
            await userData.save();


            // ab email send krengy
            try {
               await sendPasswordResetEmail(email, resetToken);
               return res.status(200).json({message: "If your email is registered. you will receive an email!"});
            } catch (error) {

                userData.resetPasswordToken = null;
                userData.resetPasswordExpires = null;
                await userData.save();
                throw new Error("Failed to send Email")
            }
        }
    } catch (error) {
        next(error)
    }
}



//=============================================
// RESET PASSWORD
//=============================================
async function resetPassword(req,res,next){

    const {token} = req.params;
    const {newPassword, confirmPassword} = req.body;

    if(!token){
        res.status(400);
        throw new Error("Link expired, Please try again");
    }

    if(!newPassword || !confirmPassword ){
        res.status(400);
        throw new Error("Please provide new and confirm Password");
    }


    if(newPassword.length < 6){
        res.status(400);
        throw new Error("Password must be atleast 6 digits long");
    }

    if( newPassword.trim() !== confirmPassword.trim()   ){
        res.status(400);
        throw new Error("Password does not match");
    }

    const userData = await UserModel.findOne({
        resetPasswordToken: token,
                      //4:47               // 4:57  
        resetPasswordExpires: {   $gt : Date.now() }
    });

    const salt = await bcrypt.genSalt(10);
    const newEncryptedPassword = await bcrypt.hash( newPassword , salt);

    userData.password = newEncryptedPassword;
    userData.resetPasswordToken  = null;
    userData.resetPasswordExpires  = null;
    await userData.save();


    res.status(200).json({
        message: "Password has been changed, you can now login with your new password!"
    })
}



//=============================================
// UPLOAD PROFILE IMAGE
//=============================================
async function uploadProfileImage(req,res,next){
    try {

        // agar user ne image select nhi ki or upload ka button press kar diya
        if(!req.file){
            res.status(400) // bad request
            throw new Error("Please select an image first")
        }


        const userRecord = await UserModel.findById( req.user._id  )
        userRecord.profileImageUrl = req.file.filename;
        await userRecord.save();


        res.status(200).json({
            success: true,
            message: "Image Uploaded",
            imageName: req.file.filename
        })



    } catch (error) {
        next(error)
    }
}




export default {
    registerUser,
    loginUser,
    getMyProfile,
    forgetPassword,
    resetPassword,
    uploadProfileImage
}