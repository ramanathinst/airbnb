const Listing = require("../models/listings")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    let allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderFormListing = async (req, res) => {
    // console.log(req.user)
    res.render("listings/new.ejs")
}

module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1, 
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url , ".." , filename)
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = { url, filename }

    newListing.geometry = response.body.features[0].geometry;
    let saveListing = await newListing.save()

    // console.log(saveListing)
    req.flash("success", "New Listing Created!")
    res.redirect("/listings")

}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    // console.log(listing)
    if (!listing) {
        req.flash("error", "Listing you requested does not exit!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.renderEditListingForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing you requested does not exit!")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_200")
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save()
    }

    req.flash("success", " Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success", " Listing Deleted!")
    res.redirect(`/listings`)
}