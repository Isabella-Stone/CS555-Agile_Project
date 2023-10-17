import { attractions } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { createAttraction, getAllAttractions, editAttraction, deleteAttraction, get} from "../data/attractions.js";
import { } from "../data/users.js";
import {checkId} from "../helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      let attractionList = await getAllAttractions();
      return res.render("attractions", {attractions:attractionList, auth: false});
    } catch (e) {
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