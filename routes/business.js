import { businesses } from "../config/mongoCollections.js";
import { createBusiness } from "../data/business.js"
import { checkName, checkEmail, checkPassword, checkAge, checkUsername } from "../helpers.js";
import { Router } from "express";
const router = Router();


router.route("/signup")
  .get(async (req, res) => {
    return res.render("signUpBusiness", {auth: false});
  })
  .post(async (req, res) => {
    let businessInfo = req.body;
    if (!businessInfo || Object.keys(businessInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
      businessInfo.firstName = checkName(businessInfo.firstName, "first name");
      businessInfo.lastName = checkName(businessInfo.lastName, "last name");
      businessInfo.name = checkName(businessInfo.name, "business name");
      businessInfo.emailAddress = checkEmail(businessInfo.emailAddress);
      businessInfo.password = checkPassword(businessInfo.password);
      if (businessInfo.password !== businessInfo.confirmPassword) {
        throw `Error: Passwords do not match`;
      }
      businessInfo.username = checkUsername(businessInfo.username);
      businessInfo.ageInput = checkAge(parseInt(businessInfo.ageInput));

      const businessCollection = await businesses();
      let business = await businessCollection.findOne({username: businessInfo.username})
      if (business) {
        throw `Username already exists`;
      }
    
      business = await businessCollection.findOne({emailAddress: businessInfo.emailAddress})
      if (business) {
        throw `Email already exists`;
      }
    }
    catch (e) {
      return res.status(400).render("signUpBusiness", {auth: false, error: true, message: e});
    }
    try {
      const newBusiness = await createBusiness(businessInfo.firstName, businessInfo.lastName, businessInfo.name,
      businessInfo.emailAddress, businessInfo.password, businessInfo.username, businessInfo.ageInput);
      return res.redirect("/auth/login");
    } catch (e) {
      return res.status(400).render("signUpBusiness", {auth: false, error: true, message: e});
    }
  });

router.route("/:id")
  .get(async (req, res) => {
    return res.render("businessProfile", { auth: false});
  });

export default router;