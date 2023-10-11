//admin data functions
import { users } from "../config/mongoCollections.js";
import { checkName, checkEmail, checkPassword, checkString } from "../helpers.js";

//*assuming we store emails lowercase
export const checkUser = async (emailAddress, password) => {
    if (!emailAddress || !password) {
      throw 'All input fields must be provided';
    }
  
    emailAddress = checkEmail(emailAddress);
    password = checkPassword(password);
  
    const userCollection = await users();
    const user = await userCollection.findOne({emailAddress: emailAddress});
    if (user === null) {
      throw `Either the email address or password is invalid`;
    }
    else {
      let same = await bcrypt.compare(password, user.password);
      if (same) {
        let firstName = user.firstName;
        let lastName = user.lastName;
        let emailAddress = user.emailAddress
        return {firstName, lastName, emailAddress, role};
      }
      else {
        throw `Either the email address or password is invalid`;
      }
    }
  };