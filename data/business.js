import { businesses } from "../config/mongoCollections.js";
import { checkName, checkEmail, checkPassword, checkAge, checkUsername, checkId, checkString } from "../helpers.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
const saltRounds = 8;

export const createBusiness = async (firstName, lastName, name, emailAddress, password, username, age) => {
    if (!firstName || !lastName || !name || !emailAddress || !password || !username || !age) {
      throw 'All input fields must be provided (createBusiness)';
    }
  
    firstName = checkName(firstName, "first name");
    lastName = checkName(lastName, "last name");
    name = checkName(name, "business name");
    emailAddress = checkEmail(emailAddress);
    password = checkPassword(password);
    username = checkString(username);
  
    const businessCollection = await businesses();
    let business = await businessCollection.findOne({username: username})
    if (business) {
      throw `Username already exists (createBusiness)`;
    }
  
    business = await businessCollection.findOne({emailAddress: emailAddress})
    if (business) {
      throw `Email already exists (createBusiness)`;
    }
    age = checkAge(age);
  
    const hashed = await bcrypt.hash(password, saltRounds);
    let newBusiness = {
      name: name,
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: hashed,
      username: username,
      age: age,
      numPosted: 0,
      lastDatePosted: "0"
    };
  
    const newInsertInformation = await businessCollection.insertOne(newBusiness);
    if (!newInsertInformation.insertedId) {
      throw 'Insert failed!';
    }
    return await getBusinessById(newInsertInformation.insertedId.toString());
  }

  export const getBusinessById = async (id) => {
    if (!id) {
      throw `Error: Id must be inputed`;
    }
    id = checkId(id);
  
    const businessCollection = await businesses();
    const business = await businessCollection.findOne({ _id: new ObjectId(id) });
    if (!business) {
      throw 'Error: Business not found';
    }
    business._id = business._id.toString();
    return business;
  };

  export const getBusinessByUsername = async (busName) => {
    if (!busName) {
      throw `Error: username must be inputed`;
    }
    busName = checkString(busName);
  
    const businessCollection = await businesses();
    const business = await businessCollection.findOne({ username: busName });
    if (!business) {
      throw 'Error: Business not found';
    }
    return business;
  };
  export const editBusinessInfo = async (firstName, lastName, name, emailAddress, password, username, age) => {
    
    const businessCollection = await businesses();
    
    let hashed1;
    if (firstName)
    {
      firstName = checkName(firstName, "first name");
    }
    if (lastName)
    {
      lastName = checkName(lastName, "last name");
    }
    if (name)
    {
      name = checkName(name, "business name");
      let business = await businessCollection.findOne({name: name})
      if (business)
      {
        throw 'Business name already associated to another business';
      }
    }
    if (emailAddress)
    {
      emailAddress = checkEmail(emailAddress);
    }
    if (password)
    {
      password = checkPassword(password);
      hashed1 = await bcrypt.hash(password, saltRounds);
    }
    if (username)
    {
      username = checkString(username);
      let business = await businessCollection.findOne({username: username})
      if (business)
      {
        throw 'Username already associated to a business';
      }
    }
    if (age)
    {
      age = checkAge(age);
    }
  };

// approvePoints(attractionId, photoId)