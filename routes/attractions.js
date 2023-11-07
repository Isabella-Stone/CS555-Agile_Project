import { attractions } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { createAttraction, getAllAttractions, editAttraction, deleteAttraction, get, getAttractionByBusinessName, getByName, getBusinessNameByAttractionName} from "../data/attractions.js";
import {checkId} from "../helpers.js";
import multer from "multer";
import {v2 as cloudinary} from 'cloudinary';
import { getBusinessByUsername } from "../data/business.js";

//code for the images
let cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
let api_key = process.env.CLOUDINARY_API_KEY;
let api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key, 
  api_secret: api_secret, 
  secure: true
})

let upload = multer({
  storage: multer.diskStorage({})
})

router
  .route("/")
  .get(async (req, res) => {
    try {
      let attractionList = await getAllAttractions();
      return res.render("upcomingAttractions", {attractions: attractionList, auth: true, user: req.session.user});
    } 
    catch (e) {
      return res.sendStatus(500);
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
    let image;
    if(req.file && req.file.path){
      image = req.file.path;
    }
    console.log(req.body);
    console.log(req)
    try {
      let business = await getBusinessByUsername(req.session.user.username);
      const newAttraction = await createAttraction(
        business._id.toString(),
        "none",
        attractionInfo.attractionName,
        attractionInfo.pointsOffered,
        attractionInfo.description,
        attractionInfo.bonusPoints,
        attractionInfo.date,
        attractionInfo.startTime,
        attractionInfo.endTime,
        attractionInfo.image
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
  .put(async (req, res) => {
    console.log("put");
    let busname = req.params.busname;
    let attInfo = req.body;
    if (!attInfo || Object.keys(attInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      const old = await getByName(busname);
      const updated = await editAttraction(
        old.businessId, 
        old._id.toString(), 
        attInfo.submissions, 
        attInfo.attractionName, 
        attInfo.pointsOffered, 
        attInfo.description, 
        attInfo.bonusPoints, 
        attInfo.date, 
        attInfo.startTime, 
        attInfo.endTime);
        console.log(updated);
        let url = "/attractions/" + updated._id;
        
      return res.redirect(url);
    } catch (e) {
      return res.status(400).render("editAttractions", {auth: false, error: true, message: e});
    }
  });

  router
  .route("/:id")
  .get(async (req, res) => {
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
      return res.render('viewAttraction', {attraction: attraction, auth: false });
    } catch (e) {
      return res.status(404).json({error: `${e}`});
    }
  })
  
export default router;