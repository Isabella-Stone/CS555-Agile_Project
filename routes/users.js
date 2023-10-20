import { users } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { createUser, getUserById } from "../data/users.js";
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
      return res.status(400).render("signUpUser", {auth: false, error: true, message: e});
    }
    try {
      const newUser = await createUser(userInfo.firstName, userInfo.lastName, 
      userInfo.emailAddress, userInfo.password, userInfo.username, userInfo.ageInput);
      return res.redirect("/auth/login");
    } catch (e) {
      return res.status(400).render("signUpUser", {auth: false, error: true, message: e});
    }
  });

  router.route("/:id")
  .get(async (req, res) => {
    try {
      let id;
      if (req.params.id.charAt(0) == ':')
      {
        id = req.params.id.slice(1);
      }
      else
      {
        id = req.params.id;
      }
      const user = await getUserById(id);
      console.log(user);
      return res.render("userProfile", {auth: false, user: user});
    }
    catch (e)
    {
      console.log(e);
      return res.status(400).render("userProfile", {auth: true, error: true, message: e});
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
  });

export default router;