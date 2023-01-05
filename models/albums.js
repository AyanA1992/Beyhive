const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
       
    },
    img: {
        type: String 
    },
    
      Review: {
         type:String,
     
   },
      songlist: [{
         type: String,
      }]

});

module.exports = mongoose.model('Albums', albumsSchema);