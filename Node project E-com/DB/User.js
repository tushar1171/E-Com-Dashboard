const mongooes=require("mongoose");
const userSchema=new mongooes.Schema({
    name:String,
    email:String,
    password:String
})

module.exports=mongooes.model("Users",userSchema);