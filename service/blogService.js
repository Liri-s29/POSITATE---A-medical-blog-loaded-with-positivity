
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../database/models/blog_model");
const Comment = require("../database/models/comment_model");
const Asset = require("../database/models/assets");
const User = require("../database/models/user_model");

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
      
        res.render("userPage",{blogs: foundBlogs.reverse(), user: req.user});

      })
}

const home = (req, res)=>{
    Asset.find({},(err,foundAsset)=>{
      if(!err){
        Blog.Blog.find({},(err, foundBlogs)=>{
          res.render("secrets", {user: req.user, assets: foundAsset, blogs: foundBlogs});
        })  
      }
    })
}


const blogCategory = (req, res)=>{
    const category = req.params.categoryname;
    Blog.Blog.find({category: category},(err, foundBlogs)=>{
        if(!err){
          Asset.findOne({id: category}, (err, foundAsset)=>{
            if(!err){
              res.render("category",{blogs: foundBlogs.reverse(), user: req.user, asset: foundAsset});
            }
          })
        }
        
        
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

const deleteBlog = (req,res)=>{
      const blogid = req.body.blogid;
      Blog.Blog.deleteOne({_id: blogid}, (err)=>{
        if(!err){
          res.redirect("/category/userpage");
        }
      });
}

const deleteaccount = (req, res)=>{
  const userid = req.user._id;
  User.deleteOne({_id: userid},(err)=>{
    if(!err){
      res.redirect("/");
    }
  })
}

module.exports = {
    createBlog: createBlog,
    userBlog: userBlog,
    blogCategory: blogCategory,
    createComment: createComment,
    singleBlog: singleBlog,
    deleteBlog: deleteBlog,
    home: home,
    deleteaccount: deleteaccount
}