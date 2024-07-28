const User = require("../models/user");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password)
        // console.log(registerUser)
        req.login(registerUser,(error) => {
            if(error) {
                next(error)
            }
            req.flash("success", "wellcome to airbnb1")
            res.redirect("/listings")
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success","willcome to airbnb! you are logged in!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err) {
            next(err)
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings")
    })
}