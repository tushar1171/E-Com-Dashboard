const express = require("express");
const cors = require("cors");
require("./DB/Config");
const User = require("./DB/User");
const product = require("./DB/Product");
const Product = require("./DB/Product");
const jwt = require("jsonwebtoken");
const jwtkey = "e-comm";
const app = express();
app.use(cors());
app.use(express.json());



app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (error,token) => {
    if(error){
      res.status(404).send("Something wents to wrong Try After Some Time ");
    }
    res.send({result ,auth:token});
  })

});

// app.post('/Login',async (req,res)=>{
//     const user=User.findOne(req.body).select("-password");
//     if(user)
//     {res.send(user)
//     }
//     else{
//     res.send("Result : No User Found  : ")
//     }
// })

app.post("/login" ,async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    }).select("-password");

    if (user) {
      jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (error,token) => {
        if(error){
          res.status(404).send("Something wents to wrong Try After Some Time ");
        }
        res.send({user,auth:token});  

      });
      
    } else {
      res.status(404).send("Result: No User Found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add-products" ,verifyToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    const result = await product.save();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/products",(req,res)=>{
//   const product=Product.find();
//   if(product.length>0)
//   {
//     res.send(product);
//   }
//   else{
//     res.send({result:"No Product Found"});
//     console.log(product);
//   }
// })

app.get("/products" ,verifyToken,async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ result: "No Product Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteProduct/:id",verifyToken, async (req, res) => {
  let result = await product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/productdeleteget/:id",verifyToken,async (req, res) => {
  const id = req.params.id;
  let result = await product.findOne({ _id: id });
  if (result) {
    res.send(result);
  } else {
    res.status(404).send("No Record Found");
  }
});

app.put("/productup/:id" ,verifyToken,async (req, res) => {
  let result = await product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.get("/search/:key",verifyToken, async (req, res) => {
  let result = await product.find({
    $or: [
      {
        product_name: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});

// function verifyToken(req, res, next) {
//   let token = req.headers['authorization'];
//   if(token){
//     token = token.split(' ')[1];
//     console.log("Middleware called ", token);
//     jwt.verify(token,jwtkey),(error,valid)=>{
//       if(error)
//       {
//         res.status(401).send({result:"Please provide valid Token : "})
//       }
//       else{
//           next();
//       }

//     };


//   }
//   else
//   {
//     res.send({result: "Please Add Token with Headers  :"});
    
//   }

  
//   next();

  // if (token) {
  //   token = token.split(' ')[1];

  //   jwt.verify(token, jwtkey, (error, valid) => {
  //     if (error) {
  //       res.status(401).send({ result: "Please provide a valid token." });
  //     } else {
  //       next();
  //     }
  //   });
  // } else {
  //   res.status(403).send({ result: "Please add a token with headers." });
  // }
//}


function verifyToken(req, res, next) {
  let token = req.headers['authorization'];

  if (token) {
    token = token.split(' ')[1];

    jwt.verify(token, jwtkey, (error, valid) => {
      if (error) {
        res.status(401).send({ result: "Please provide valid Token : " });
      } else {
        next();
      }
    });
  } else {
    res.status(403).json({ result: "Please Add Token with Headers  :" });
  }
}

app.listen(5000, () => {
  console.log("started in 5000");
});
