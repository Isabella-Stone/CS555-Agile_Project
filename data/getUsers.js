import { users } from "../config/mongoCollections.js";
import { checkEmail, checkUsername, checkId } from "../helpers.js";
import { ObjectId } from 'mongodb';

//Returns a list of all the users
export const getAllUsers = async () => {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
};
  
//Returns the user object of a user with the given id
export const getUserById = async (id) => {
    if (!id) {
      throw `Error: Id must be inputed`;
    }
    id = checkId(id);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw 'Error: User not found';
    }
    user._id = user._id.toString();
    return user;
};
  
//Returns the entire user object that contains the given username
export const getUserByUsername = async (username) => {
    if (!username) {
      throw `Error: username must be inputed`;
    }
    username = checkUsername(username);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) {
      throw 'Error: User not found';
    } 
    user._id = user._id.toString();
    return user;
};
  
//Returns the entire user object that contains the given email
export const getUserByEmail = async (email) => {
    if (!email) {
      throw `Error: email must be inputed`;
    }
    email = checkEmail(email);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ emailAddress: email });
    if (!user) {
      throw 'Error: User not found';
    } 
    user._id = user._id.toString();
    return user;
};

//If the username does not already exist, returns false, if it does exist, returns true
export const usernameAlreadyExists = async (username) => {
    if (!username) {
      throw `Error: username must be inputed`;
    }
    username = checkUsername(username);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) {
      return false;
    } else {
      return true;
    }
};

//If the email does not already exist, returns false, if it does exist, returns true
export const emailAlreadyExists = async (email) => {
    if (!email) {
      throw `Error: email must be inputed`;
    }
    email = checkEmail(email);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ emailAddress: email });
    if (!user) {
      return false;
    } else {
      return true;
    }
};