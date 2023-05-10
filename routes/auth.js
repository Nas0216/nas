const express = require ("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');


// SIGN UP
authRouter.post("/api/signup", async (req, res) => {
    try {
const {name, email, password, pharmacyName, tinNumber,phoneNumber, address, documents} = req.body;

const existingUser = await User.findOne({tinNumber});
if(existingUser) {
return res
.status(400)
.json({msg: 'User with the same tin number already exist!'})
}

const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new User({
        
        password: hashedPassword,
        name,
        pharmacyName,
        tinNumber,
        documents,
        phoneNumber,
        address,
    })
    user = await user.save();
    res.json(user); 
} catch (e){
    res.status(500).json({ error: e.message});
}

    // Post that data in database
    // Return that data to the user
});

// SIGN IN

authRouter.post("/api/signin", async (req, res) =>{
    try {
        const {tinNumber, password} = req.body;
        const user = await User.findOne({tinNumber});
        if(!user) {
            return res
            .status(400)
            .json({msg: "No user with this tin number"});
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){ 
            return res
            .status(400)
            .json({msg: "Incorrect Password"});
        }
        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});
    } catch (e){
        res.status(500).json({error: e.message});
    }
});
//token
authRouter.post("/tokenIsValid", async (req, res) =>{
    try {
       const token = req.header('x-auth-token');
       if(!token) return res.json(false);
       const verified = jwt.verify(token,"passwordKey");
       if(!verified) return res.json(false);

       const user = await User.findById(verified.id);
       if(!user) return res.json(false);
       res.json(true);
    } catch (e){
        res.status(500).json({error: e.message});
    }
});

authRouter.get("/", auth , async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

authRouter.patch('/api/change-password', async (req, res) => {
    try {
        
        const {phoneNumber,password,tinNumber} = req.body;
        const existingUser = await User.findOne({phoneNumber: phoneNumber,
            tinNumber: tinNumber,});
if(!existingUser) {
return res
.status(400)
.json({msg: 'User with these credentials does not exist!'})
}

const hashedPassword = await bcryptjs.hash(password, 8);
       let user = await User.findOneAndUpdate({
        phoneNumber: phoneNumber,
        tinNumber: tinNumber,
    },
    {
        password:hashedPassword,
    },
    {
        upsert:false,
    },
    );
       
       
       user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
    
});

//update-profile

authRouter.patch('/api/update-profile',auth, async (req, res) => {
    try {
        
        const {phoneNumber,password,tinNumber, address, name,pharmacyName, email, documents} = req.body;
        
        
       let user = await User.findByIdAndUpdate(req.user); 
       if(name!=null){
        user.name  = name;
        }
        if(phoneNumber!=null){
            user.phoneNumber  = phoneNumber;
            }
            if(pharmacyName!=null){
                user.pharmacyName  = pharmacyName;
                }
                if(tinNumber!=null){
                    user.tinNumber  = tinNumber;
                    }
                    if(password!=null){
                        const hashedPassword = await bcryptjs.hash(password, 8);
                        user.password  = hashedPassword;
                        }
      
                        if(email!=null){
                            user.email  = email;
                            }
                            if(address!=null){
                                user.address  = address;
                                }
                                if(documents!=null){
                                    user.documents = documents;
                                }
                                
       
       user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
       
});

module.exports = authRouter;