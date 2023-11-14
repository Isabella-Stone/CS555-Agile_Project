import { attractions } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { createAttraction, getAllAttractions, editAttraction, deleteAttraction, get, getAttractionByBusinessName, getByName, getBusinessNameByAttractionName, getAttractionsInChronologicalOrder} from "../data/attractions.js";
import {checkId} from "../helpers.js";
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';
import { getBusinessById, getBusinessByUsername } from "../data/business.js";
import dotenv from 'dotenv/config';
import { newSubmission } from "../data/submissions.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET,
  secure: true
})
let upload = multer({ dest: 'uploads/'})

router
  .route("/")
  .get(async (req, res) => {
    try {
      let attractionList = await getAttractionsInChronologicalOrder();
      return res.render("upcomingAttractions", {attractions: attractionList, auth: true, user: req.session.user});
    } 
    catch (e) {
      return res.sendStatus(500);
    }
  })
  .post(async (req, res) => {
    let filterOp = req.body;
    if (!filterOp || Object.keys(filterOp).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }
    if (filterOp.filterOptions === 'date') {
      try {
        let attractionList = await getAttractionsInChronologicalOrder();
        return res.render("upcomingAttractions", {attractions: attractionList, auth: true, user: req.session.user});
      } catch (e) {
        return res.sendStatus(500);
      }
    } else 
    // if (filterOp.filterOptions === 'recommended') 
    {
      try {
        let attractionList = await getAllAttractions();
        return res.render("upcomingAttractions", {attractions: attractionList, auth: true, user: req.session.user});
      } catch (e) {
        return res.sendStatus(500);
      }
    }
  })

router
  .route("/create")
  .get(async (req, res) => {
    console.log("In get");
    try {
      return res.render("createAttraction", {auth: true});
    } 
    catch (e) {
      return res.sendStatus(500);
    }
  })
  .post(upload.single("image"), async (req, res) => {
    let attractionInfo = req.body;
    let image = null;
    if(req.file && req.file.path){
      image = req.file.path;
      let cloudinaryImage = await cloudinary.uploader.upload(image);
      image = cloudinaryImage.secure_url;
    }
    try {
      let tags = [];
      if (Object.keys(attractionInfo).includes("interestsInput1")) {
        tags.push("City-wide Events");
      }
      if (Object.keys(attractionInfo).includes("interestsInput2")) {
        tags.push("Business/Restaurant Events");
      }
      if (Object.keys(attractionInfo).includes("interestsInput3")) {
        tags.push("Art Events");
      }
      if (Object.keys(attractionInfo).includes("interestsInput4")) {
        tags.push("Cultural Events");
      }
      if (Object.keys(attractionInfo).includes("interestsInput5")) {
        tags.push("Volunteering Events");
      }
      let business = await getBusinessByUsername(req.session.user.username);
      const newAttraction = await createAttraction(
        business._id.toString(),
        attractionInfo.attractionName,
        attractionInfo.pointsOffered,
        attractionInfo.description,
        attractionInfo.bonusPoints,
        attractionInfo.date,
        attractionInfo.startTime,
        attractionInfo.endTime,
        image,
        tags
      );
      return res.redirect(`/attractions/${newAttraction._id}`);
    } catch (e) {
      return res.status(500).json(`${e}`)    
    }
    
  });


  router.route("/editAttraction/:busname/:attname")
  .get(async (req, res) => {
    let attname = req.params.attname;
    try {
      const attractions = await getByName(attname);
      return res.status(400).render("editAttractions", {auth: false, attractions: attractions});
    }
    catch (e)
    {
      return res.render("chooseAttraction", {auth: true, error: true, message: e});
    }
  })

  router.route("/editAttraction")
  .post(async (req, res) => {
    //add check to make sure authenticated user has same id as param
    console.log("Here 2")
    try {
      let businessName = await getBusinessNameByAttractionName(req.body.attractionName);
      return res.redirect(`/attractions/editAttraction/${businessName}/${req.body.attractionName}`)
    } catch (e) {
      return res.render("chooseAttraction", {auth: true, error: true, message: e});
    }
    
  });

  router.route("/editAttraction/:busname")
  .get(async (req, res) => {
    let busName = req.params.busname;
    try {
      const attractions = await getAttractionByBusinessName(busName);
      return res.render("chooseAttraction", {auth: false, attractions: attractions});
    }
    catch (e)
    {
      return res.status(400).render("upcomingAttractions", {auth: true, error: true, message: e});
    }
  })
  .post(async (req, res) => {
    //add check to make sure authenticated user has same id as param
    console.log("Post")
    try
    {

    }
    catch (e)
    {
      return res.status(400).render("businessProfile", {auth: false, error: true, message: e});
    }
  })
  .put(upload.single("image"), async (req, res) => {
    let busname = req.params.busname;
    let attInfo = req.body;
    if (!attInfo || Object.keys(attInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    console.log(req.file);
    let image = null;
    if(req.file && req.file.path){
      image = req.file.path;
      let cloudinaryImage = await cloudinary.uploader.upload(image);
      image = cloudinaryImage.secure_url;
    }
    console.log("Image: ")
    console.log(image);
    let old;
    let oldBus;
    try {
      old = await getByName(busname);
      let a = await getBusinessById(old.businessId);
      oldBus = a.name;
      let tags = [];
      if (Object.keys(attInfo).includes("interestsInput1")) {
        tags.push("City-wide Events");
      }
      if (Object.keys(attInfo).includes("interestsInput2")) {
        tags.push("Business/Restaurant Events");
      }
      if (Object.keys(attInfo).includes("interestsInput3")) {
        tags.push("Art Events");
      }
      if (Object.keys(attInfo).includes("interestsInput4")) {
        tags.push("Cultural Events");
      }
      if (Object.keys(attInfo).includes("interestsInput5")) {
        tags.push("Volunteering Events");
      }
      const updated = await editAttraction(
        old.businessId, 
        old._id.toString(), 
        old.submissions, 
        attInfo.attractionName, 
        attInfo.pointsOffered, 
        attInfo.description, 
        attInfo.bonusPoints, 
        attInfo.date, 
        attInfo.startTime, 
        attInfo.endTime,
        "https://res.cloudinary.com/djllvfvts/image/upload/v1699984515/ruchypija6nuegzftr7q.png",
        tags);
        console.log(updated);
        let url = "/attractions/" + updated._id;
        
      return res.redirect(url);
    } catch (e) {
      let busiName = oldBus.replace(/ /g, '%20');
      let attrName = old.attractionName.replace(/ /g, '%20');
      let url2 = `http://localhost:3000/attractions/editAttraction/${busiName}/${attrName}`
      // req.session.error = true;
      // req.session.errorMessage = e;
      // console.log(req.session.errorMessage);
      console.log(url2);
      return res.status(500).json(`${e}`)
    }
  });

  router
  .route("/:id")
  .get(async (req, res) => {
    console.log(req.session)
    let id = req.params.id;
    try {
      id = checkId(id);
    } catch (e) {
      return res.status(400).json({error: `${e}`});
    }
    try {
      let attraction = await get(id);
      if (!attraction) {
        return res.status(404).json({ error: 'Attraction not found' });
      }
      return res.render('viewAttraction', {attraction: attraction, auth: false, isUser: !req.session.user.is_business, id: id});
    } catch (e) {
      return res.status(404).json({error: `${e}`});
    }
  })
  .post(upload.single("image"), async (req, res) => {
    let submissionInfo = req.body;
    let image = null;
    if(req.file && req.file.path){
      image = req.file.path;
      let cloudinaryImage = await cloudinary.uploader.upload(image);
      image = cloudinaryImage.secure_url;
    }
    //get the date in the proper format
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let fullDate = `${month}/${day}/${year}`;
    //get the time in the format hh:mm
    let hour = date.getHours();
    let minute = date.getMinutes();
    if(minute < 10){
      minute = `0${minute}`
    }
    let time = `${hour}:${minute}`

    try{
      //now run the function and then render the proper page
      let submission = await newSubmission(req.params.id, req.session.user._id, image, submissionInfo.reasoning, parseInt(submissionInfo.rating), fullDate, time)
      console.log(submission);
      // return res.render('viewAttraction', {attraction: req.params.id, auth: false, isUser: !req.session.user.is_business, submission: submission});
    } catch (e) {
      return res.status(404).json({error: `${e}`});
    }

  });
  
export default router;