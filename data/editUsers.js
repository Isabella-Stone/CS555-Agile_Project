import { users, businesses } from "../config/mongoCollections.js";
import { checkString, checkName, checkEmail, checkPassword, checkAge, checkUsername, checkId } from "../helpers.js";
import { getAllUsers, getUserById, getUserByUsername, getUserByEmail, usernameAlreadyExists, emailAlreadyExists } from "./getUsers.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
const saltRounds = 8;

//Creates a user with the given values and sets points to 0
export const createUser = async (firstName, lastName, emailAddress, password, username, age, interests) => {
  if (!firstName || !lastName || !emailAddress || !password || !username || !age || !interests) {
    throw 'All input fields must be provided (createUser)';
  }

  let businessCollection = await businesses();

  firstName = checkName(firstName);
  lastName = checkName(lastName);
  emailAddress = checkEmail(emailAddress);
  password = checkPassword(password);
  username = checkUsername(username);
  let userExists = await usernameAlreadyExists(username);
  let userExists2 = await await businessCollection.findOne({username: username});
  if (userExists || userExists2) {
    throw `Username already exists (createUser)`;
  }
  let emailExists = await emailAlreadyExists(emailAddress);
  let emailExists2 = await businessCollection.findOne({emailAddress: emailAddress});
  if (emailExists || emailExists2) {
    throw `emailAddress already exists (createUser)`;
  }
  age = checkAge(age);
  if (interests.length === 0) {
    throw `Error: No interests chosen`;
  }

  const hashed = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hashed,
    username: username,
    age: age,
    points: 0,
    interests: interests
  };
  const userCollection = await users();
  const newInsertInformation = await userCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) {
    throw 'Insert failed!';
  }
  return await getUserById(newInsertInformation.insertedId.toString());
}


export const checkUser = async (emailAddress, password) => {
  if (!emailAddress || !password) {
    throw "All input fields must be provided";
  }

  emailAddress = checkEmail(emailAddress);
  password = checkString(password, "Password");

  const userCollection = await users();
  const businessCollection = await businesses();

  const user = await userCollection.findOne({emailAddress: emailAddress});
  const business = await businessCollection.findOne({emailAddress: emailAddress});
  let isUser = (user !== null);
  let isBusiness = (business !== null);

  if (!isUser && !isBusiness) {
    throw "Either the email address or password is invalid";
  }
  else {
    let validPassword;
    if (isUser) {
      validPassword = await bcrypt.compare(password, user.password);
    } else {
      validPassword = await bcrypt.compare(password, business.password);
    }
    
    if (validPassword) {
      if (isBusiness) {
        let name = business.name;
        let emailAddress = business.emailAddress
        let username = business.username;
        let _id = String(business._id)
        return {name, emailAddress, username, _id};
      }
      else {
        //is user
        let firstName = user.firstName;
        let lastName = user.lastName;
        let emailAddress = user.emailAddress
        let username = user.username;
        let _id = String(user._id)
        return {firstName, lastName, emailAddress, username, _id};
      }
    }
    else {
      throw "Either the email address or password is invalid";
    }
  }
};


//Edits user info based on given information 
export const editUserInfo = async (id, firstName, lastName, emailAddress, password, username, age, interests) => {
  let hashed1;
  if (id)
  {
    id = checkId(id);
  }
  if (firstName)
  {
    firstName = checkName(firstName);
  }
  if (lastName)
  {
    lastName = checkName(lastName);
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
    username = checkUsername(username);
  }
  if (age)
  {
    age = checkAge(age);
  }

  let oldUser = await getUserById(id);
  let usernameExists = false;
  let usernameExists2 = false;
  let emailExists = false;
  let emailExists2 = false;

  let businessCollection = await businesses();
  
  if (oldUser.username !== username && username) {
    usernameExists = await usernameAlreadyExists(username);
    usernameExists2 = await businessCollection.findOne({username: username});
    if (usernameExists || usernameExists2) {
      throw `Username already exists (updateUser)`
    }
  }

  if (oldUser.emailAddress !== emailAddress && emailAddress) {
    emailExists = await emailAlreadyExists(emailAddress);
    emailExists2 = await businessCollection.findOne({emailAddress: emailAddress});
    if (emailExists || emailExists2) {
      throw `Email already exists (updateUser)`
    }
  }

  if (interests.length === 0) {
    interests = null;
  }

  const userUpdate = {
    firstName: firstName ? firstName : oldUser.firstName,
    lastName: lastName ? lastName : oldUser.lastName,
    emailAddress: emailAddress ? emailAddress : oldUser.emailAddress,
    password: hashed1 ? hashed1 : oldUser.password,
    username: username ? username : oldUser.username,
    age: age ? age : oldUser.age,
    points: oldUser.points,
    interests: interests !== null && interests !== oldUser.interests ? interests : oldUser.interests
  };

  const userCollection = await users();

  const updateInfo = await userCollection.replaceOne({_id: new ObjectId(id)}, userUpdate);

  if (updateInfo.modifiedCount === 0) {
    throw `At least one field must be different to successfully update user`;
  }
  let newInfo;
  if (username)
  {
    newInfo = await getUserByUsername(username);
  }
  else
  {
    newInfo = await getUserByUsername(oldUser.username);
  }

  return newInfo;
};

//Deletes user with the given id
export const deleteUser = async (id) => {
  if (!id) {
    throw `Error: Id must be inputed`;
  }
  id = checkId(id);

  const userCollection = await users();
  const user = await userCollection.findOneAndDelete({ _id: new ObjectId(id) });
  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Error: Could not delete user with id of ${id}`;
  }

  return { ...deletionInfo.value, deleted: true };
};

export const deductPoints = async (username, points) => {
  const userCollection = await users();
  const oldUser = await getUserByUsername(username);
  if(oldUser.points <= 0 || points > oldUser.points){
    return false;
  } else{
    const updateInfo = await userCollection.updateOne(
      { username: username},
      { $set: { points: oldUser.points - points } }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error('Failed to update points');
    }
  return true;
  }
};

export const awardPoints = async (userId, points) => {
  const userCollection = await users();
  const oldUser = await getUserById(userId);
  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(userId)},
    { $set: { points: oldUser.points + points} }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error('Failed to update points');
  }
}