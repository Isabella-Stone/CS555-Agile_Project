import { Router } from "express";
import { checkUser } from "../data/users.js";
const router = Router();
import { } from "../data/users.js";
import xss from 'xss';

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("login", {error: false, message: ""});
  })
  .post(async (req, res) => {
    let emailAddress = xss(req.body.emailAdressInput);
    let password = xss(req.body.passwordInput);
    try {
        let user = await checkUser(emailAddress, password);
        req.session.user = user;
    } 
    catch (e) {
      return res.status(400).render("login", { error: true, message: e });
    }
  });


export default router;