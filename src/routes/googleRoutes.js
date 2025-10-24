const express = require("express")
const passport = require("passport")
const jwt = require ("jsonwebtoken")

const router = express.Router();

router.get("/google", passport.authenticate("google",{scope:["profile", "email"]})
);

router.get("/google/callback", passport.authenticate("google", {session:false}),
(req, res)=>{
    const user = req.user;
    const token = jwt.sign(
        {id: user._id, email: user.email,user_type:user.user_type},
        process.env.JWT_SECRET,
        {expiresIn: "7h"}
    );

    res.status(200).json({
        success:true,
        message:"Google login successful",
        data:{
            token,
            user:{
                id:user._id,
                email:user.email,
                first_name:user.first_name,
                last_name:user.last_name,
                user_type:user.user_type
            }
        }
    })
}
)

module.exports= router