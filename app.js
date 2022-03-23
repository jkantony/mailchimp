const mailChimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mailChimp.setConfig({
    apiKey: "ccdf9cb0389796ab70996e16647cdef7-us14",
    server: "us14"
});

app.get("/", function (req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const subscribingUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailAddress
    }
    const run = async() => {
        const response = await mailChimp.lists.addListMember("00fba5cdce", {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        })
        res.sendFile(__dirname + "/success.html");
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.listen(process.env.PORT || 3000, function (){
    console.log("Server has been successfully deployed on port 3000");
});