import { Router } from "express";
import { checkUser } from "../data/editUsers.js";
import { getAllAttractions } from "../data/attractions.js";
const router = Router();
import xss from 'xss';

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("login", {error: false, message: ""});
  })
  .post(async (req, res) => {
    let emailAddress = xss(req.body.emailAddressInput);
    let password = xss(req.body.passwordInput);
    try {
        let user = await checkUser(emailAddress, password);
        req.session.user = user;
        req.session.user.is_business = user.name ? true : false
        let attractionList = await getAllAttractions();
        // return res.redirect(req.session.redirect ? req.session.redirect : '/attractions');
        return res.redirect('/attractions');
    } 
    catch (e) {
      return res.status(400).render("login", {error: true, message: e});
    }
  });

router
  .route("/logout")
  .get(async (req, res) => {
    req.session.destroy(() => {
      return res.redirect("/auth/login");
    });
   
  });

export default router;