import mongoose from "mongoose";



const userSchema = mongoose.Schema({


    // fields yahan aayngi
    name: {
        type: String,
        required: [true, "Name is required"]
    },

    email: {
        type: String,
        unique: [true, "Email should be unique"],
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email should have valid format, should have @ and .com"  ]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [6, "Password should be atleast 6 digits long"]
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    profileImageUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
    },

    resetPasswordToken: {
        type: String,
        default: null
    },


    resetPasswordExpires: {
        type: Date,
        default: null
    }

},  {timestamps: true});



export const UserModel = mongoose.model("Users", userSchema);