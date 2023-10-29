import { businesses } from "../config/mongoCollections.js";
import { checkName, checkEmail, checkPassword, checkAge, checkUsername, checkId, checkString, checkBusinessName } from "../helpers.js";
import { ObjectId } from 'mongodb';
import bcrypt, { hash } from 'bcrypt';
const saltRounds = 8;

export const createBusiness = async (firstName, lastName, name, emailAddress, password, username, age) => {
    if (!firstName || !lastName || !name || !emailAddress || !password || !username || !age) {
      throw 'All input fields must be provided (createBusiness)';
    }
  
    firstName = checkName(firstName, "first name");
    lastName = checkName(lastName, "last name");
    name = checkBusinessName(name, "business name");
    emailAddress = checkEmail(emailAddress);
    password = checkPassword(password);
    username = checkString(username);
  
    const businessCollection = await businesses();
    let business = await businessCollection.findOne({username: username})
    if (business) {
      throw `Username already exists (createBusiness)`;
    }
  
    business = await businessCollection.findOne({name: name})
    if (business) {
      throw `Name already exists (createBusiness)`;
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

  export const editBusinessInfo = async (id, firstName, lastName, name, emailAddress, password, username, age) => {
    
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
      name = checkBusinessName(name, "business name");
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

    let oldBusiness = await getBusinessById(id)

    const businessUpdate = {
      firstName: firstName ? firstName : oldBusiness.firstName,
      lastName: lastName ? lastName : oldBusiness.lastName,
      name: name ? name : oldBusiness.name,
      emailAddress: emailAddress ? emailAddress : oldBusiness.emailAddress,
      password: hashed1 ? hashed1 : oldBusiness.password,
      username: username ? username : oldBusiness.username,
      age: age ? age : oldBusiness.age
    };
  
     const updateInfo = await businessCollection.findOneAndUpdate(
       { _id: new ObjectId(id) },
       { $set: businessUpdate }
     );
  
    if (updateInfo.modifiedCount === 0) {
      throw `At least one field must be different to successfully update user`;
    }
  
    let newInfo = await getBusinessById(id);
    return newInfo;
  };

// approvePoints(attractionId, photoId)