
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../database/models/blog_model");
const Comment = require("../database/models/comment_model");
const Asset = require("../database/models/assets");

const createBlog = (req,res) => {
    const newBlog = new Blog.Blog({
        title: req.body.title,
        content: req.body.content,
        name: req.user.name,
        category: req.body.category,
        user_id: req.user._id,
        image: req.user.image
    });
    
    newBlog.save((err)=>{
        if(err){
        console.log(err);
        }else{
        
        res.redirect("/secrets")
        }
    }); 
}

const userBlog = (req, res)=>{
    Blog.Blog.find({user_id: req.user._id},(err, foundBlogs)=>{
        res.render("userPage",{blog: foundBlogs.reverse(), user: req.user});

      })
}


const blogCategory = (req, res)=>{
    const category = req.params.categoryname;
    Blog.Blog.find({category: category},(err, foundBlogs)=>{
        Asset.findOne({id: category}, (err, foundAsset)=>{
          res.render("category",{blogs: foundBlogs.reverse(), user: req.user, asset: foundAsset});
        })
        
        
      });
}

const createComment = (req, res)=>{
    const comment = req.body.comment;
      const blogId = req.body.Id;
      const orign = req.body.orign;
      const newComment = new Comment.Comment({
        name: req.user.name,
        content: comment,
        image: req.user.image
      })
      Blog.Blog.findOne({_id: blogId}, (err, foundBlog)=>{
        foundBlog.comment.push(newComment);
        foundBlog.save((err)=>{
          if(!err){
            res.redirect("/category/blog/"+blogId+"w"+orign);
          }
        })
      });
}

const singleBlog = (req, res)=>{
      const blog = req.params.singleblog.split("w");
      const blogId = blog[0];
      const blogOrign = blog[1];
      Blog.Blog.findOne({_id: blogId},(err, foundBlog)=>{
        const comments = foundBlog.comment;
        res.render("singleblog",{blog: foundBlog, user: req.user, orign: blogOrign, comments: comments});
      });
}

module.exports = {
    createBlog: createBlog,
    userBlog: userBlog,
    blogCategory: blogCategory,
    createComment: createComment,
    singleBlog: singleBlog
}