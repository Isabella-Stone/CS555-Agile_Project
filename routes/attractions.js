import { attractions } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/attractions.js";
import { } from "../data/users.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
        
    } catch (e) {

    }
    return res.render("upcomingAttractions", {auth: false});
  })
  .post(async (req, res) => {
    try {
        
    } catch (e) {

    }
    return res.render("attractions", {auth: false});
  });
  router
  .route("/:id")
  .get(async (req, res) => {
    try {
        
    } catch (e) {

    }
    return res.render("attraction", {auth: false});
  });

export default router;