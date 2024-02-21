const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { error } = require("console");
const methodOverride = require('method-override');
 


app.use(express.urlencoded({extended:true}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads'); // Adjust destination path
    },
    filename: function (req, file, cb) {
       
        cb(null, `${file.originalname}`);

    }
});

const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));

let posts = [
    {
        id: uuidv4(),
        username: "anmolratna",
        content: "I am from Bihar",
        Fname: "college2.jpg",
        image: "/uploads/example1.jpg" // Corrected image path
    },
  
];


app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});

app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/posts", upload.single('image'), (req,res)=>{
    let { username, content } = req.body;
    let id = uuidv4();
    let image = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg'; // Adjust the image path
    if (username , content) {
        posts.push({ id, username, content, image});
        res.redirect("/posts");
    } else {
        res.render("error.ejs");
    }
    console.log(image);
});

app.get("/posts/:id",(req,res)=>{
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if(post) {
        res.render("show.ejs", { post });
    } else {
        res.render("error.ejs");
    }
});

app.patch("/posts/:id",(req,res)=>{
    let id = req.params.id;
    let newcontent=req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content=newcontent;
    res.redirect("/posts");
    
});
    
app.get("/posts/:id/edit",(req,res)=>{
    let id = req.params.id;
    let post = posts.find((p) => id === p.id);
    if(post){
        res.render("edit.ejs",{id,post});


    }
});

app.delete("/posts/:id",(req,res)=>{
    let id = req.params.id;
    posts = posts.filter((p) => id != p.id);
    res.redirect("/posts");

})
app.get("*",(req,res)=>{
    res.render("error.ejs");
})

app.listen(port,()=>{
    console.log("Listening to port : 8080");
});
