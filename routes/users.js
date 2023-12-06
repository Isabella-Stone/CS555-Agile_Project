import { users } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();
import { } from "../data/business.js";
import { createUser, editUserInfo, deductPoints } from "../data/editUsers.js";
import { getAllUsers, getUserById, getUserByUsername, getUserByEmail, usernameAlreadyExists, emailAlreadyExists } from "../data/getUsers.js";
import { getAllSubmissionsByUserId } from "../data/submissions.js";
import { get } from "../data/attractions.js";
import { checkAge, checkEmail, checkId, checkName, checkPassword, checkUsername } from "../helpers.js";

router.route("/signup")
  .get(async (req, res) => {
    return res.render("signUpUser");
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
      let interests = [];
      if (Object.keys(userInfo).includes("interestsInput1")) {
        interests.push("City-wide Events");
      }
      if (Object.keys(userInfo).includes("interestsInput2")) {
        interests.push("Business/Restaurant Events");
      }
      if (Object.keys(userInfo).includes("interestsInput3")) {
        interests.push("Art Events");
      }
      if (Object.keys(userInfo).includes("interestsInput4")) {
        interests.push("Cultural Events");
      }
      if (Object.keys(userInfo).includes("interestsInput5")) {
        interests.push("Volunteering Events");
      }
      const newUser = await createUser(userInfo.firstName, userInfo.lastName, 
      userInfo.emailAddress, userInfo.password, userInfo.username, userInfo.ageInput, interests);
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
      return res.status(400).render("editProfile", {error: true, message: e, user: user});
    }
    try {
      let interests = [];
      if (Object.keys(userInfo).includes("interestsInput1")) {
        interests.push("City-wide Events");
      }
      if (Object.keys(userInfo).includes("interestsInput2")) {
        interests.push("Business/Restaurant Events");
      }
      if (Object.keys(userInfo).includes("interestsInput3")) {
        interests.push("Art Events");
      }
      if (Object.keys(userInfo).includes("interestsInput4")) {
        interests.push("Cultural Events");
      }
      if (Object.keys(userInfo).includes("interestsInput5")) {
        interests.push("Volunteering Events");
      }
      const updated = await editUserInfo(user._id, userInfo.firstName, userInfo.lastName, 
        userInfo.emailAddress, userInfo.password, userInfo.username, userInfo.ageInput, interests);
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
      return res.status(400).render("editProfile", {error: true, message: e, user: user});
    }
  });

  router.route("/editProfile/:id")
  .get(async (req, res) => {
    let user;
    try {
      let userId = checkId(req.params.id);
      user = await getUserById(userId);
      return res.render("editProfile", {user: user});
    }
    catch (e)
    {
      return res.status(400).render("editProfile", {error: true, message: e, user: user});
    }
  });

  router.route("/redeemRewards/:username")
  .get(async (req, res) => {
    let username = req.params.username;
    username = checkUsername(username);
    let user;
    try {
      user = await getUserByUsername(username);
      return res.render("redeemRewards", {user: user});
    } catch (e) {
      //Might have to change what page is renders to
      return res.status(400).render("upcomingAttractions", {error: true, message: e})
    }
    
  });

  router.route("/updatePoints/:username")
  .post(async (req, res) => {
  })
  .put(async (req, res) => {
    const username = req.params.username;
    const updatedPoints = req.body.hiddenPointsInput;

    try {
        const redeemed = await deductPoints(username, updatedPoints);
        if(redeemed){
          return res.status(200).render("redeemed");
        }
        else{
          return res.redirect("/user/redeemRewards/" + username);
        }
    } catch (error) {
       return res.redirect("/user/redeemRewards/" + username);
    }
});
  router.route("/submissions/:username")
  .get(async (req, res) => {
    let username = req.params.username;
    username = checkUsername(username);
    let user;
    try {
      user = await getUserByUsername(username);
      let submissionsList = await getAllSubmissionsByUserId(user._id.toString());
      for (let i=0;i<submissionsList.length;i++)
      {
        let attractionId = submissionsList[i].attractionId.toString();
        let attraction = await get(attractionId);
        submissionsList[i]['attractionName'] = attraction.attractionName;
      }

      return res.render("userSubmissions", {user: user, submissionsList: submissionsList});
    } catch (e) {
      //Might have to change what page is renders to
      return res.status(400).render("upcomingAttractions", {error: true, message: e})
    }
    
  })

export default router;