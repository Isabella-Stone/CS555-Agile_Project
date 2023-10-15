import { users } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { } from "../data/users.js";

router.route("/signup")
  .get(async (req, res) => {
    //return res.render("signup", { auth: false});
    return res.json({todo: "TODO"});
  })
  .post(async (req, res) => {
    try {
      
    }
    catch (e) {

    }
    return res.json({todo: "TODO"});
    //return res.render("signup", {auth: false});
  });

router.route("/logout").get(async (req, res) => {
  return res.render("logout", { auth: false });
});

router.route("/:id")
  .get(async (req, res) => {
    return res.render("userProfile", { auth: false});
  });

export default router;