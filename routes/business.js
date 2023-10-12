import { businesses } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { } from "../data/users.js";

router
  .route("/login")
  .post(async (req, res) => {
    try {
        
    } catch (e) {
      return res.status(400).render("login", { message: e, error: true, auth: false });
    }
    return res.render("login", {auth: false});
  });

router.route("/signup")
  .get(async (req, res) => {
    return res.json({todo: "TODO"});
    // return res.render("signup", { auth: false});
  })
  .post(async (req, res) => {
    try {
      
    }
    catch (e) {

    }
    return res.json({todo: "TODO"});
  });

router.route("/logout").get(async (req, res) => {
  return res.render("logout", { auth: false });
});

router.route("/:id")
  .get(async (req, res) => {
    return res.render("businessProfile", { auth: false});
  });

export default router;