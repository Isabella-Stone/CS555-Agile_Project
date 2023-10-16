import { businesses } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { } from "../data/users.js";

router.route("/signup")
  .get(async (req, res) => {
    return res.render("signUpBusiness", {auth: false});
  })
  .post(async (req, res) => {
    try {
    }
    catch (e) {

    }
    return res.json({todo: "TODO"});
  });

router.route("/:id")
  .get(async (req, res) => {
    return res.render("businessProfile", { auth: false});
  });

export default router;