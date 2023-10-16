import { users, businesses } from "../config/mongoCollections.js";
import { checkName, checkEmail, checkPassword, checkString } from "../helpers.js";

//createUser(...) - plz store emails in lowercase in db

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
  
//getAllUsers()

//getUserByID(id)

//getUserByUsername(username)

//editUserInfo(...)

//deleteUser() - need this?