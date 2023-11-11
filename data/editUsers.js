import { users, businesses } from "../config/mongoCollections.js";
import { checkString, checkName, checkEmail, checkPassword, checkAge, checkUsername, checkId } from "../helpers.js";
import { getAllUsers, getUserById, getUserByUsername, getUserByEmail, usernameAlreadyExists, emailAlreadyExists } from "./getUsers.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
const saltRounds = 8;

//Creates a user with the given values and sets points to 0
export const createUser = async (firstName, lastName, emailAddress, password, username, age) => {
  if (!firstName || !lastName || !emailAddress || !password || !username || !age) {
    throw 'All input fields must be provided (createUser)';
  }

  firstName = checkName(firstName);
  lastName = checkName(lastName);
  emailAddress = checkEmail(emailAddress);
  password = checkPassword(password);
  username = checkUsername(username);
  let userExists = await usernameAlreadyExists(username);
  if (userExists) {
    throw `Username already exists (createUser)`;
  }
  let emailExists = await emailAlreadyExists(emailAddress);
  if (emailExists) {
    throw `emailAddress already exists (createUser)`;
  }
  age = checkAge(age);

  const hashed = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hashed,
    username: username,
    age: age,
    points: 0
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
export const editUserInfo = async (id, firstName, lastName, emailAddress, password, username, age) => {
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
  let emailExists = false;
  
  if (oldUser.username !== username && username) {
    console.log("usernameAlreadyExists");
    usernameExists = await usernameAlreadyExists(username);
    if (usernameExists) {
      throw `Username already exists (updateUser)`
    }
  }

  if (oldUser.emailAddress !== emailAddress && emailAddress) {
    emailExists = await emailAlreadyExists(emailAddress);
    if (emailExists) {
      throw `Email already exists (updateUser)`
    }
  }

  const userUpdate = {
    firstName: firstName ? firstName : oldUser.firstName,
    lastName: lastName ? lastName : oldUser.lastName,
    emailAddress: emailAddress ? emailAddress : oldUser.emailAddress,
    password: hashed1 ? hashed1 : oldUser.password,
    username: username ? username : oldUser.username,
    age: age ? age : oldUser.age,
    points: oldUser.points
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