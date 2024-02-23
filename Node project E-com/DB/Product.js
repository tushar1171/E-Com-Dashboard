const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
        product_name:String,
        product_Price:Number,
        product_categary:String,
        product_userId:String,
        product_company:String
});
module.exports=mongoose.model("products",productSchema);