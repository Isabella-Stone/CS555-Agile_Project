import { Router } from "express";
import { checkUser } from "../data/users.js";
const router = Router();
import xss from 'xss';

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("login", {auth: false, error: false, message: ""});
  })
  .post(async (req, res) => {
    let emailAddress = xss(req.body.emailAdressInput);
    let password = xss(req.body.passwordInput);
    try {
        let user = await checkUser(emailAddress, password);
        req.session.user = user;
        return res.status(400).render("homepage", {auth: true});
    } 
    catch (e) {
      return res.status(400).render("login", {auth: false, error: true, message: e});
    }
  });

router
  .route("/logout")
  .get(async (req, res) => {
    req.session.destroy();
    return res.render("logout", {auth: false});
  });

export default router;