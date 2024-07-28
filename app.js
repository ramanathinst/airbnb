if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const port = 8080
const mongoose = require('mongoose');
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require("method-override")
const ExpressError = require("./utils/ExpressError.js")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


// Router
const listingRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

// const mongoDB = 'mongodb://127.0.0.1:27017/airbnb'

const dbUrl = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connection to DB!")
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}


app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, 'public')))

// Mongo DB Store



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error",() => {
    console.log("ERROR IN MONGO SESSION STORE",err)
})

// Cookie Session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}
// app.get('/', (req, res) => {
//     res.send("This is root path")
// })

app.use(session(sessionOptions))
app.use(flash())

// Passport Authenticate
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Fake User for Demo

// app.get("/demouser",async(req,res) => {
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "ramanath"
//     })

//     let registerUser = await User.register(fakeUser,"Freelancer100%")
//     res.send(registerUser)
// })


// Connect flash for message
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    // console.log(res.locals.success)
    next()
})

// Router Middleware
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)


// All Route 
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something weng wrong" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message)
})


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// app.get("/testListings" ,async (req,res) => {
//     let newListing = new Listing({
//         title : "Ramanath",
//         description : "i love coding",
//         image : "https://images.pexels.com/photos/24461005/pexels-photo-24461005/free-photo-of-model-in-coat-and-boots.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         price: 1200,
//         location : "jaipur",
//         country : "india"
//     })
//     newListing.save().then((res) => {
//         console.log(res)
//     })
//     res.send("data save")
// })
//  loving Code