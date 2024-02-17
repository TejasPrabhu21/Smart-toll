const express = require('express');
const gpsData = require('../models/gpsdata');
const router = express.Router();

router.get('/getdata',(req,res)=>{
    res.render('index', { title: 'IoT project' });
});

console.log('hello');
router.post('/addgpsdata',(req,res)=>{

  // const {latitude, longitude} = req.body;
  // let errors = [];

  // if(latitude || !longitude){
  //   errors.push({msg : "Parameters are missing"});
  // }
  // if(errors.length>0){
  //   res.json({Message : errors})
  // }else{
  //   const newgpsdata = new gpsdata({
  //     latitude,
  //     longitude
  //   });

  //   newgpsdata
  //   .save()
  //   .then(newgpsdata => {
  //     res.json({ Message: "Data Inserted"});
  //   })
  //   .catch(err => console.log(err));
  // }
});
module.exports = router;

