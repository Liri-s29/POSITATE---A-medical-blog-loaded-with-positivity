
const express = require("express");
const passport = require("passport");
const blogService = require('../service/blogService');
const router = express.Router();

router.get("/", (req, res) => {
  res.render("Landing");
});

router.post("/create",(req, res)=>{
    if(req.isAuthenticated()){
        blogService.createBlog(req,res);
    }else{
      console.log("err")
    }
});

router.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
      
      res.render("secrets", {user: req.user});
    } else {
      res.redirect("/login");
    }
});

router.get("/createblog", (req, res) => {
    if (req.isAuthenticated()) {
      
      res.render("createblog",{user: req.user});
    } else {
      res.redirect("/login");
    }
});

router.get("/:categoryname", (req, res)=>{
    if (req.isAuthenticated()) {
      
      blogService.blogCategory(req,res);
    } else {
      res.redirect("/login");
    }
    
});

router.post("/createcomment", (req, res)=>{
    if (req.isAuthenticated()) {
        blogService.createComment(req,res);
    } else {
      res.redirect("/login");
    }
    
});

router.get("/category/blog/:singleblog", (req, res)=>{
    if (req.isAuthenticated()) {
        blogService.singleBlog(req,res);
      
    } else {
      res.redirect("/login");
    }
});

router.get("/category/userpage", (req, res) => {
  if (req.isAuthenticated()) {
    
      blogService.userBlog(req,res);
  } else {
    res.redirect("/login");
  }
});

router.post("/blog/delete", (req, res) => {
  if (req.isAuthenticated()) {
    
      blogService.deleteBlog(req,res);
  } else {
    res.redirect("/login");
  }
});



module.exports = router;
