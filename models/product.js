const mongoose = require('mongoose')

//Prodcut Schema
const productSchema = new mongoose.Schema({

    title:{
        type:String,
        required: true
    },
    slug:{
        type:String
    },
    desc:{
        type:String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price:{
        type: Number
    },
    image: {
        type: String
    }
    
})

const Product = mongoose.model('Product',productSchema);

module.exports = Product;





