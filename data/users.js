import { users, businesses } from "../config/mongoCollections.js";
import { checkName, checkEmail, checkPassword, checkString, checkAge, checkUsername, checkId } from "../helpers.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
const saltRounds = 8;

//Creates a user with the given values and sets points to 0
export const createUser = async (firstName, lastName, emailAddress, password, username, age) => {
  if (!firstName || !lastName || !emailAddress || !password || username || !age) {
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

//*assuming we store emails lowercase
export const checkUser = async (emailAddress, password) => {
    if (!emailAddress || !password) {
      throw 'All input fields must be provided';
    }
  
    emailAddress = checkEmail(emailAddress);
    password = checkPassword(password);
  
    const userCollection = await users();
    const businessCollection = await businesses();

    const user = await userCollection.findOne({emailAddress: emailAddress});
    const business = await businessCollection.findOne({emailAddress: emailAddress});

    if (user === null && business == null) {
      throw `Either the email address or password is invalid`;
    }
    else {
      let same = await bcrypt.compare(password, user.password);
      if (same) {
        if (user == null) {
          //is business
          let name = user.name;
          let emailAddress = user.emailAddress
          let username = user.username;
          return {name, lastName, emailAddress, username};
        }
        else {
          //is user
          let firstName = user.firstName;
          let lastName = user.lastName;
          let emailAddress = user.emailAddress
          let username = user.username;
          return {firstName, lastName, emailAddress, username};
        }
      }
      else {
        throw `Either the email address or password is invalid`;
      }
    }
  };
  

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

//Edits user info based on given information 
export const editUserInfo = async (id, firstName, lastName, emailAddress, password, username, age) => {
  if (!id || !firstName || !lastName || !emailAddress || !password || username || !age) {
    throw 'All input fields must be provided (createUser)';
  }
  id = checkId(id);
  firstName = checkName(firstName);
  lastName = checkName(lastName);
  emailAddress = checkEmail(emailAddress);
  password = checkPassword(password);
  username = checkUsername(username);
  age = checkAge(age);

  let oldUser = await getUserById(id);
  let usernameUser = await getUserByUsername(username);
  let emailUser = await getUserByEmail(emailAddress);
  if (oldUser.id !== usernameUser.id) {
    throw `Username already exists (updateUser)`;
  }
  if (oldUser.id !== emailUser.id) {
    throw `Email Address already exists (updateUser)`;
  }

  const hashed = await bcrypt.hash(password, saltRounds);

  const userUpdate = {
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hashed,
    username: username,
    age: age,
    points: oldUser.points
  };

  const userCollection = await users();
  const updateInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: userUpdate },
    { returnDocument: 'after' }
  );
  if (updateInfo.modifiedCount === 0) {
    throw `At least one field must be different to successfully update user`;
  }
  if (updateInfo.lastErrorObject.n === 0) {
    throw 'Error: Update failed';
  }

  return updateInfo.value;
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