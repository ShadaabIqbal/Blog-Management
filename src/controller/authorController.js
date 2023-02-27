const authorModel = require('../model/authorModel')

const emailValidator = require("email-validator")

const jwt = require("jsonwebtoken")


const matchNames = /^([A-Za-z]+)$/



const authors = async function (req, res) {

    try {
        // // All Data From Body putting in data var.
        let data = req.body

        // // All Mandatory field taking out and checking present or not , if  not present then send an err msg. 
        let { fname, lname, title, password } = req.body

        if (!fname || !lname || !password || !title) return res.status(400).send({ Status: false, message: "Mandatory field is not given" })

        if (!fname.match(matchNames) || !lname.match(matchNames)) return res.status(400).send({ status: false, message: "Invalid formate for First Name or Last Name" })

        if (title !== "Mr" && title !== "Miss" && title !== "Mrs") return res.status(400).send({ status: false, message: "Given tittle is invalid (Only Mr , Mrs , Miss is valid)" })


        // // Email extracting from body to verify given email is correct or not.
        let email = req.body.email


        if (!emailValidator.validate(email)) return res.status(400).send({ Status: false, message: "Invalid Email id , please give valid email id." })

        // Or

        //  let emailFormat = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).([a-z]{2,20})$/
        // if (!email.match(emailFormat)) return res.status(400).send("Email id is invalid.")

        let emailUnique = await authorModel.findOne({ email: email })

        if (emailUnique) return res.status(400).send({ status: false, message: "Email is already exist , please provide other." })


        // // If everyThing is right then create data in DB and send back newy formed data.
        let newData = await authorModel.create(data)   // // Making Blog

        res.status(201).send({ status: true, data: newData })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }

}


const loginAuthor = async function (req, res) {

    try {

        let email = req.body.email
        let password = req.body.password

        if (!email || !password) return res.status(400).send({ Status: false, message: "Email and password required , please send it." })


        let Author = await authorModel.findOne({ email: email, password: password });

        if (!Author) return res.send({ msg: "Email or password is invalid." });

        // // console.log(Author)

        let token = jwt.sign({ _id: Author._id.toString() }, "our first project")

        // res.setHeader("x-auth-token", token)
        res.status(200).send({ status: true, token: token })

    } catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, message: err.message })
    }

}




module.exports = { authors, loginAuthor }
