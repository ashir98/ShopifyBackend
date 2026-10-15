import multer from "multer";
import path from "path";




const storageConfig = multer.diskStorage({
    
    // create storage configuration
    destination: (req,file,cb)=>{
        cb(null,"uploads/")
    },



    // file ka name kya hoga?
    filename: (req,file,cb)=>{
        const timestamp = Date.now(); 
        const extension = path.extname(file.originalname) // apple.png
        const uniqueName = `shopify_`+timestamp+extension;
        cb(null, uniqueName);
    }



    
});




export const upload = multer({
    storage: storageConfig,


    // file filter
    fileFilter: (req,file,cb)=>{
        if(file.mimetype.startsWith("image/")){
            cb(null, true)
        }
        else{
            cb("Only Images are allowed",false)
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }

})