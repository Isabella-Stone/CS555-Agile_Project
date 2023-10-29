import { attractions } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { createAttraction, getAllAttractions, editAttraction, deleteAttraction, get, getAttractionByBusinessName, getByName} from "../data/attractions.js";
import { } from "../data/users.js";
import {checkId} from "../helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      let attractionList = await getAllAttractions();
      return res.render("attractions", {attractions: attractionList, auth: false});
    } 
    catch (e) {
      return res.sendStatus(500);
    }
  })
  .post(async (req, res) => {
    let attractionInfo = req.body;
    try {
      const newAttraction = await createAttraction(
        attractionInfo.businessId,
        attractionInfo.submissions,
        attractionInfo.attractionName,
        attractionInfo.pointsOffered,
        attractionInfo.description,
        attractionInfo.bonusPoints,
        attractionInfo.date,
        attractionInfo.startTime,
        attractionInfo.endTime
      );
      return res.render("attractions", {auth: false});
    } catch (e) {
      return res.status(500).json(`${e}`)    
    }
    
  });


  router.route("/editAttraction")
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
  .post(async (req, res) => {
    //add check to make sure authenticated user has same id as param
    return res.redirect(`/attraction/editAttraction/${req.body.attractionName}`)
  });

  router.route("/editAttraction/:busname")
  .get(async (req, res) => {
    let attname = req.params.busname;
    
    try {
      const attractions = await getByName(attname);
      return res.render("editAttractions", {auth: false, attractions: attractions});
    }
    catch (e)
    {
      return res.status(400).render("chooseAttraction", {auth: true, error: true, message: e});
    }
  })
  .post(async (req, res) => {
    //add check to make sure authenticated user has same id as param
    try
    {

    }
    catch (e)
    {
      return res.status(400).render("businessProfile", {auth: false, error: true, message: e});
    }
  })
  .put(async (req, res) => {
    let attInfo = req.body;
    let attraction;
    if (!attInfo || Object.keys(attInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      const updated = await editAttraction(
        attInfo.businessId, 
        attInfo._id, 
        attInfo.submissions, 
        attInfo.attractionName, 
        attInfo.pointsOffered, 
        attInfo.description, 
        attInfo.bonusPoints, 
        attInfo.date, 
        attInfo.startTime, 
        attInfo.endTime);
        let url = "/attraction/" + attInfo.attractionName;
        
      return res.redirect(url);
    } catch (e) {
      return res.status(400).render("editAttraction", {auth: false, error: true, message: e});
    }
  });

  router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = checkId(req.params.id, 'ID URL Param');
    } catch (e) {
      return res.status(400).json({error: `${e}`});
    }
    try {
      let attraction = await get(req.params.id);
      if (!attraction) {
        return res.status(404).json({ error: 'Attraction not found' });
      }
      return res.render('attraction', {attraction: attraction, auth: false });
    } catch (e) {
      return res.status(404).json({error: `${e}`});
    }
  })
export default router;