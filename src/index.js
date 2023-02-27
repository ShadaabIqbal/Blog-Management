const express = require('express');
const route = require("./routes/route")
const mongoose  = require('mongoose');
const app = express();


app.use(express.json())


mongoose.connect("mongodb+srv://ShadaabIqbal:9dwgAZ6YUEdRiDyx@mycluster.cuj3crc.mongodb.net/ShadaabIqbal-DB-Coin?retryWrites=true&w=majority", {
    useNewUrlParser: true
}, mongoose.set("strictQuery", false))
.then(() => console.log("MongoDB is connected"))
.catch(err => console.log(err))

app.use('/', route);

app.use( (req ,res) => {
    res.status(404).send({status : false , message : "Url is inorrect"})
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
