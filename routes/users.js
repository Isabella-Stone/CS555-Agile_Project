import { users } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { createUser } from "../data/users.js";
import { checkAge, checkEmail, checkName, checkPassword, checkUsername } from "../helpers.js";

router.route("/signup")
  .get(async (req, res) => {
    //return res.render("signup", { auth: false});
    return res.render("signUpUser", {auth: false});
  })
  .post(async (req, res) => {
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      userInfo.firstName = checkName(userInfo.firstName);
      userInfo.lastName = checkName(userInfo.lastName);
      userInfo.emailAddress = checkEmail(userInfo.emailAddress);
      userInfo.password = checkPassword(userInfo.password);
      if (userInfo.password !== userInfo.confirmPassword) {
        throw `Error: Passwords do not match`;
      }
      userInfo.username = checkUsername(userInfo.username);
      userInfo.ageInput = checkAge(parseInt(userInfo.ageInput));
    }
    catch (e) {
      return res.status(400).json({error: `${e}`});
    }
    try {
      const newUser = await createUser(userInfo.firstName, userInfo.lastName, 
      userInfo.emailAddress, userInfo.password, userInfo.username, userInfo.ageInput);
      return res.status(200).json(newUser);
    } catch (e) {
      return res.status(400).json({error: `${e}`});
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    return res.render("userProfile", { auth: false});
  });

export default router;