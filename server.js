const express = require("express")
const Albums = require("./models/albums.js")
const data =require("./models/data.js")
const app = express();
const port  = 3000
const methodOverride = require("method-override")

require('dotenv').config();
//mount middleware
app.use(express.urlencoded({ extended: true }))      
app.use(methodOverride("_method"))
app.use((req, res, next) => {
    console.log("run all routes");
    console.log(req.body)
    next()
})
app.set('view engine', 'ejs');
app.use(express.static('public'))

// Listener
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;

// Dependencies
const mongoose = require('mongoose');

// Database Connection
mongoose.connect(DATABASE_URI)

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

//seed route
app.get('/albums/seed', (req,res) => {
    Albums.deleteMany({}, (err) => {
        Albums.create(data, (err) =>  {
            res.redirect('/albums')
        })
    })
})

//induces

//index
app.get("/albums/", (req,res) =>{
    Albums.find({}, (err, albums) =>{
        res.render("index", {albums})
    })
})

app.get("/", (req,res) =>{
    res.redirect('/albums')
    
})
//new
app.get("/albums/new", (req,res) => {
    res.render("new.ejs")
})

//delete
app.delete("/albums/:id", (req, res) => {
    Albums.findByIdAndDelete(req.params.id, (err) => {
        res.redirect("/albums")
    })
    
})
//update
app.put("/albums/:id", (req,res) => {
    Albums.findByIdAndUpdate(
        req.params.id, req.body, {new:true}, (err,albums) => {
            if(err){
                res.send(err)
            } else {
                res.redirect(`/albums/${req.params.id}`)
            }
        }
    )

});
//create/new
app.post('/albums', (req, res) => {
    req.body.completed = req.body.completed === 'on'; // true or false
  Albums.create(req.body, (err, albums) => {
    console.log(albums)
        res.redirect('/albums');
    });
});
//edit
app.get('/albums/:id/edit', (req,res)=>{
   Albums.findById(req.params.id, (err, albums)=> {
        res.render('edit', {albums})
    })
   
        
    
});
//show
app.get('/albums/:id', (req, res) => {
    Albums.findById(req.params.id, (err, albums)=> {
        res.render('show.ejs', {
            albums: albums
        });
    });
});
//listener
app.listen(PORT, () => {
    console.log(`Express is listening on port:${PORT}`);
});
