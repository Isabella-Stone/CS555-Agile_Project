import { businesses } from "../config/mongoCollections.js";
import { createBusiness, getBusinessById, editBusinessInfo } from "../data/business.js"
import { checkName, checkEmail, checkPassword, checkAge, checkUsername, checkId, checkBusinessName } from "../helpers.js";
import { Router } from "express";
const router = Router();


router.route("/signup")
  .get(async (req, res) => {
    return res.render("signUpBusiness");
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
      businessInfo.name = checkBusinessName(businessInfo.name, "business name");
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
      return res.status(400).render("signUpBusiness", {error: true, message: e});
    }
    try {
      const newBusiness = await createBusiness(businessInfo.firstName, businessInfo.lastName, businessInfo.name,
      businessInfo.emailAddress, businessInfo.password, businessInfo.username, businessInfo.ageInput);
      return res.redirect("/auth/login");
    } catch (e) {
      return res.status(400).render("signUpBusiness", {error: true, message: e});
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
      const business = await getBusinessById(id);
      return res.render("businessProfile", {business: business});
    }
    catch (e)
    {
      console.log(e);
      return res.status(400).render("businessProfile", {error: true, message: e});
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
    let businessInfo = req.body;
    let business;
    if (!businessInfo || Object.keys(businessInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      business = await getBusinessById(req.params.id);
      if (businessInfo.firstName)
      {
        businessInfo.firstName = checkName(businessInfo.firstName);
      }
      if (businessInfo.lastName)
      {
        businessInfo.lastName = checkName(businessInfo.lastName);
      }
      if (businessInfo.name)
      {
        businessInfo.name = checkBusinessName(businessInfo.name);
      }
      if (businessInfo.emailAddress)
      {
        businessInfo.emailAddress = checkEmail(businessInfo.emailAddress);
      }
      if (businessInfo.password)
      {
        businessInfo.password = checkPassword(businessInfo.password);
      }

      if (businessInfo.password !== businessInfo.confirmPassword) {
        throw `Error: Passwords do not match`;
      }

      if (businessInfo.username)
      {
        businessInfo.username = checkUsername(businessInfo.username);
      }
      if (businessInfo.ageInput)
      {
        businessInfo.ageInput = checkAge(parseInt(businessInfo.ageInput));
      }
    }
    catch (e) {
      console.log(e);
      return res.status(400).render("editBusiness", {error: true, message: e});
    }
    try {
      const updated = await editBusinessInfo(business._id, businessInfo.firstName, businessInfo.lastName, businessInfo.name,
        businessInfo.emailAddress, businessInfo.password, businessInfo.username, businessInfo.ageInput);
      let url = "/business/" + business._id;
      return res.redirect(url);
    } catch (e) {
      console.log(e);
      return res.status(400).render("editBusiness", {error: true, message: e});
    }
  })

  router.route("/editProfile/:id")
  .get(async (req, res) => {
    try {
      let id = checkId(req.params.id);
      let business = await getBusinessById(id);
      return res.render("editBusiness", {business: business});
    }
    catch (e)
    {
      return res.status(400).render("editBusiness", {error: true, message: e});
    }
  });

export default router;