const express =require("express");
const app =express();
const router=express.Router();






//Home Route
router.get("/",(req,res)=>{
    res.render("front/Home.ejs");
});


module.exports = router;