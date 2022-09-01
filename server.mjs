import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 3000
app.use(express.json());
app.use(cors());



const productSchema = new mongoose.Schema({
    productName: { type: String },
    productPrice: { type: Number },
    currencyCode: { type: String },
    numberOfSale: { type: Number },
    rating: { type: Number },
    isFreeShipping: { type: Boolean },
    shopName: { type: String },
    createdOn: { type: Date, default: Date.now }

});
const productModel = mongoose.model('product', productSchema);


app.post('/product', (req, res) => {
    let body = req.body;
    if (
        !body.productName ||
        !body.productPrice ||
        !body.currencyCode ||
        !body.numberOfSale ||
        !body.rating ||
        !body.isFreeShipping ||
        !body.shopName

    ) {
        console.log("please fill all fields")
        res.status(400).send({
            message: "please fill all fields"
        })
        return;
    }





    let newproduct = new productModel({
        productName: body.productName,
        productPrice: body.productPrice,
        currencyCode: body.currencyCode,
        numberOfSale: body.numberOfSale,
        rating: body.rating,
        isFreeShipping: body.isFreeShipping,
        shopName: body.shopName
    })
 
    newproduct.save( (err, result)=>{
    
        if (!err) {
            res.send({
                message: "product is created"
            })
            console.log(result, "product is created in database")
        } else {
           res.send({message : "db error in saving product"});
           console.log()
           
        }



    })
})


app.get("/products",  (req, res) => {
    productModel.find({} , (err , result)=>{
        if(err){
            res.send({
                message : "error in getting all products"
            })
            console.log(err , "error in db")
            return;
        }else{
            res.send({
                message: "got all products",
                data :result
            })
        }
    }
    
    
    
    
    
    )
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

let dbURI = 'mongodb+srv://tasmiyah:web@cluster0.cj82tmo.mongodb.net/ecommerceweb?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////


