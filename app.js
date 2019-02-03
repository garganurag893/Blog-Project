var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodoverride=require("method-override");
mongoose.connect("mongodb://localhost/blog_app");


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.set('debug', true);
app.use(methodoverride("_method"));

var blogschema = new mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date ,default:Date.now},
});
var Blog=mongoose.model("Blog",blogschema);

app.get("/",function(req, res) {
   res.redirect("/blog"); 
});
app.get("/blog",function(req, res) {
   Blog.find({},function(err,blogs){
      if(err)
      {
          console.log(err);
      }else{
      res.render("home",{blogs:blogs});     
      }
   });
});
app.get("/blog/new",function(req, res) {
   res.render("new"); 
});
app.post("/blog",function(req, res) {
    Blog.create(req.body.blog,function(err,blogs){
      if(err)
      {
          console.log(err);
      }else{
      res.redirect("/blog");     
      }
   });
});
app.get("/blog/:id",function(req, res) {
   Blog.findById(req.params.id,function(err,found){
       if(err)
       {
           console.log(err);
       }else{
           res.render("show",{blog:found});
       }
   }) 
});
app.get("/blog/:id/edit",function(req, res) {
   Blog.findById(req.params.id,function(err,found){
       if(err)
       {
           console.log(err);
       }else{
           res.render("edit",{blog:found});
       }
   }); 
});
app.put("/blog/:id",function(req, res) {
   Blog.findByIdAndUpdate(req.params.id,req.body.blog1,function(err,found){
       if(err)
       {
           console.log(err);
       }else{
           res.redirect("/blog/"+req.params.id);
       }
   }); 
});
app.delete("/blog/:id",function(req, res) {
   Blog.findByIdAndRemove(req.params.id,function(err){
       if(err)
       {
           console.log(err);
       }else{
           res.redirect("/blog");
       }
   }); 
});
app.get("*",function(req,res){
   res.send("Sorry web page not found."); 
});

app.listen(3131,function(){
    console.log("Server has started");
});