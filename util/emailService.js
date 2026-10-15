import nodemailer from "nodemailer";



// sender email. backend k pas hogi
// recevier email. users ki email hogi

const transporter = nodemailer.createTransport({
    service: "gmail",

    // email kon send krega?
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }

})




export async function sendPasswordResetEmail(email , resetToken){

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;


    try {
        
        const forgotEmail = {
            from : `Shopify Support ${process.env.PASS}`,
            to: email,
            subject: "Reset Your Password",
            html: `
            <p>Click this link to reset your Password <p/>
            <a href=${resetLink} > Click Here  </a>
            `
        }


         await transporter.sendMail(forgotEmail);

    } catch (error) {
        throw new Error("Unable to send Email")
    }




}






