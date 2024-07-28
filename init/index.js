const mongoose = require('mongoose');
const initData = require("./data.js")
const Listing = require('../models/listings.js');

main()
.then((res) => {
    console.log("connection to DB!")
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({...obj, owner : "66a65dd47bac745fc64b0d0d", }))
    await Listing.insertMany(initData.data)
    console.log("data was save")
}
initDB()

