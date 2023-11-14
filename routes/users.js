import { users } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { createUser, editUserInfo } from "../data/editUsers.js";
import { getAllUsers, getUserById, getUserByUsername, getUserByEmail, usernameAlreadyExists, emailAlreadyExists } from "../data/getUsers.js";
import { checkAge, checkEmail, checkId, checkName, checkPassword, checkUsername } from "../helpers.js";

router.route("/signup")
  .get(async (req, res) => {
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
      return res.status(400).render("signUpUser", {error: true, message: e});
    }
    try {
      const newUser = await createUser(userInfo.firstName, userInfo.lastName, 
      userInfo.emailAddress, userInfo.password, userInfo.username, userInfo.ageInput);
      return res.redirect("/auth/login");
    } catch (e) {
      return res.status(400).render("signUpUser", {error: true, message: e});
    }
  });

  router.route("/:username")
  .get(async (req, res) => {
    try {
      let username = checkUsername(req.params.username);
      const user = await getUserByUsername(username);
      return res.render("userProfile", {user: user});
    }
    catch (e)
    {
      return res.status(400).render("userProfile", {error: true, message: e});
    }
  })
  .post(async (req, res) => {
    //add check to make sure authenticated user has same id as param
    try
    {

    }
    catch (e)
    {
      return res.status(400).render("businessProfile", {error: true, message: e});
    }
  })
  .put(async (req, res) => {
    console.log("PUT")
    let userInfo = req.body;
    let user;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      user = await getUserByUsername(req.params.username);
      if (userInfo.firstName)
      {
        userInfo.firstName = checkName(userInfo.firstName);
      }
      if (userInfo.lastName)
      {
        userInfo.lastName = checkName(userInfo.lastName);
      }
      if (userInfo.emailAddress)
      {
        userInfo.emailAddress = checkEmail(userInfo.emailAddress);
      }
      if (userInfo.password)
      {
        userInfo.password = checkPassword(userInfo.password);
      }
      if (userInfo.password !== userInfo.confirmPassword) {
        throw `Error: Passwords do not match`;
      }
      if (userInfo.username)
      {
        userInfo.username = checkUsername(userInfo.username);
      }
      if (userInfo.ageInput)
      {
        userInfo.ageInput = checkAge(parseInt(userInfo.ageInput));
      }
    }
    catch (e) {
      console.log(e);
      return res.status(400).render("editProfile", {auth: false, error: true, message: e});
    }
    try {
      const updated = await editUserInfo(user._id, userInfo.firstName, userInfo.lastName, 
        userInfo.emailAddress, userInfo.password, userInfo.username, userInfo.ageInput);
      let url;
      if (userInfo.username)
      {
        url = "/user/" + userInfo.username;
        req.session.user.username = userInfo.username;
      }
      else
      {
        url = "/user/" + user.username;
        req.session.user.username = user.username;
      }
      return res.redirect(url);
    } catch (e) {
      console.log(e);
      return res.status(400).render("editProfile", {auth: false, error: true, message: e});
    }
  });

  router.route("/editProfile/:id")
  .get(async (req, res) => {
    try {
      let userId = checkId(req.params.id);
      let user = await getUserById(userId);
      return res.render("editProfile", {auth: false, user: user});
    }
    catch (e)
    {
      return res.status(400).render("editProfile", {auth: true, error: true, message: e});
    }
  });

  router.route("/redeemRewards/:username")
  .get(async (req, res) => {
    let username = req.params.username;
    username = checkUsername(username);
    let user;
    try {
      user = await getUserByUsername(username);
      return res.render("redeemRewards", {auth: true, user: user});
    } catch (e) {
      //Might have to change what page is renders to
      return res.status(400).render("upcomingAttractions", {error: true, message: e})
    }
    
  })



export default router;