//IMPORT FROM PACKAGES
const express = require("express");
// Database package
const mongoose = require('mongoose');  
const adminRouter = require('./routes/admin');

//IMPORT FROM OTHER FILES
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require("./routes/user");

//INIT
const PORT = process.env.PORT || 3000;
const app = express();
const DB= "mongodb+srv://Nas:123456nas@cluster0.lgwjw3v.mongodb.net/?retryWrites=true&w=majority";

//MIDDLEWARE
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//Connections
mongoose.connect(DB).then(() => {
    console.log('Connection Successfull');
}).catch((e) => {
    console.log(e);
});

app.listen(PORT, "0.0.0.0", () => {
console.log(`connected at port ${PORT}`);
});