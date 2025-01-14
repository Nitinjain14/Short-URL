const express = require("express");
const {handleGenerateShortURL,handleClicksOnShortURL} = require("../controllers/url.js");

const router = express.Router();

//POST request to /url to generate a shortened URL.
router.post('/',handleGenerateShortURL);

//GET request to /url/:shortId to redirect to the original URL and track the visit.
router.get("/analytics/:shortId",handleClicksOnShortURL);

module.exports = router;