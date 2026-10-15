import { ProductModel } from "../models/products.model.js";
import mongoose from "mongoose";



//=============================================
// GET ALL PRODUCTS
//=============================================
async function getAllProducts(req,res){
    const allProducts =  await ProductModel.find();
    res.status(200).json(allProducts)
}




//=============================================
// ADD A PRODUCT
//=============================================
async function addProduct(req,res){

    const {title, price, category, desc, imgUrl} = req.body;

    // check karo fields provide ki hain?
    if (!title  || !price || !desc ) {
        res.status(400);
        throw new Error("Title, Price and Desc are required fields")
    }

    // agar data diya hai tw ab data ko prepare karo add karne k lye
    const productData = {
        title,price,category, desc,imgUrl
    }


    // model ab apka data mongodb me add karega
    await ProductModel.create(productData);


    // ab user ko response de do k data add hogaya
    res.status(200).json({
        success: true,
        message: "Product Added Successfully!"
    })
}




//=============================================
// GET A SINGLE PRODUCT
//=============================================
async function getSingleProduct(req,res){

    // user ki req se id lo
    const productID = req.params.id;


    // validate karo k id ka format thekk hai?
    if( !mongoose.Types.ObjectId.isValid(productID) ){
        res.status(400);
        throw new Error("Invalid ID");
    }


    // agar id thekk hai tw ab is id k behalf pe data laaow
    const singleProduct = await ProductModel.findById( productID );


    // agr is id pe product hi nhi hai phir?
    if(!singleProduct){
        res.status(404);
        throw new Error("Item not found")
    }
    
    // agar product hai phir?
    else{
        res.status(200).json(singleProduct);
    }
}




//=============================================
// UPDATE PRODUCT BY ID
//=============================================
async function updateProduct(req,res){


    // pehle user se id lo k konsa product update karna hai?
    const productID = req.params.id;

    // user se data bhi lo jo update karna hai.
    const newData = req.body;


    // validate karo k id ka format thekk hai?
    if( !mongoose.Types.ObjectId.isValid(productID) ){
        res.status(400);
        throw new Error("Invalid ID");
    }


    // data ko update karo or updated data ek variable me rakho
    const updatedData = await ProductModel.findByIdAndUpdate(
        productID, newData, {new: true}
    )



    // response bhejo user ko k data update hogaya!
    res.status(200).json({
        message: "Product Updated!",
        updatedData
    })




}











export default {
    getAllProducts,
    addProduct,
    getSingleProduct,
    updateProduct
}