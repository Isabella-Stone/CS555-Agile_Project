import { getUserData, editUserData, businessData, attractionData, submissionData } from './data/index.js';
import { createUser, editUserInfo, checkUser } from "./data/editUsers.js";
import { getAllUsers, getUserById, getUserByUsername, getUserByEmail, usernameAlreadyExists, emailAlreadyExists } from "./data/getUsers.js"
import {createAttraction,get} from "./data/attractions";
import {} from "./helpers";
import { ObjectId } from "mongodb";

test('Gets all preexisting users', async () => {
    const user1 = await createUser("Areeb", "Chaudhry", "areeb@gmail.com", "Qwertyuiop@123", "kash123", 21);
    const user2 = await createUser("Mariam", "Dardir", "mariam@gmail.com", "Happy@123", "mxriam", 21);
    const userList = await getAllUsers();

    expect(userList).toStrictEqual([{_id: new ObjectId(user1._id), firstName: "Areeb", lastName: "Chaudhry", emailAddress: "areeb@gmail.com", username: "kash123", password: user1.password, age: 21, points: 0}, 
    {_id: new ObjectId(user2._id), firstName: "Mariam", lastName: "Dardir", emailAddress: "mariam@gmail.com", username: "mxriam", password: user2.password, age: 21, points: 0}]);
})

test('Gets user by emailAddress', async () => {
    const user3 = await createUser("Areeb", "Chaudhry", "areeber@gmail.com", "Qwertyuiop@123", "kash", 21);
    const userByEmail = await getUserByEmail("areeber@gmail.com");

    expect(userByEmail).toStrictEqual({_id: user3._id, firstName: "Areeb", lastName: "Chaudhry", emailAddress: "areeber@gmail.com", username: "kash", password: user3.password, age: 21, points: 0});
})

test('Trying to get a user by emailAddress that does not exist', async () => {
    let error;
    try {
        const userByEmail2 = await getUserByEmail("aree@gmail.com");
    }
    catch (e) {
        error = e;
    }

    expect(error).toStrictEqual('Error: User not found');
})

test("successfully creates an attraction", async () => {
    let business1 = await businessData.createBusiness
    (
        'Fred', 
        'Bagel', 
        'OBagel', 
        'obagel@gmail.com',
        'Hello123!',
        'obagel_official',
        20
    );
    const att = await createAttraction(business1._id.toString(), "none", "Movie2 Nights", "50", "fun night out", "0", "10/25/2023", "08:00", "12:00", "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png");
    expect(att).toStrictEqual({_id: att._id, businessId: business1._id.toString(), attractionName: "Movie2 Nights", date: "10/25/2023", startTime: "08:00", endTime: "12:00", pointsOffered: 50, bonusPoints: 0, description: "fun night out",  submissions: "none", image: "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"});
})

test("gets attraction by id", async () => {
    let business2 = await businessData.createBusiness
    (
        'Joe', 
        'Giovanni', 
        'Giovannis Italian',
        'giovannis@gmail.com',
        'Hello!123',
        'giovannis_italian',
        30
    );
    const a1 = await createAttraction(business2._id.toString(), "none", "Movie3 Night 2.0", "50", "fun night out", "0", "10/26/2023", "08:00", "12:00", "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png");
    const getAttraction = await get(a1._id.toString());
    expect(getAttraction).toStrictEqual({_id: getAttraction._id, businessId: business2._id.toString(), attractionName: "Movie3 Night 2.0", date: "10/26/2023", startTime: "08:00", endTime: "12:00", pointsOffered: 50, bonusPoints: 0, description: "fun night out",  submissions: "none", image: "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"});
})

test('Gets a preexisting user', async () => {
    const user = await createUser("Patrick", "Hill", "pattyhill@gmail.com", "Abc123!!", "pattyxhill", 48);
    const holder = await checkUser("pattyhill@gmail.com", "Abc123!!")

    expect(holder).toStrictEqual({_id: String(user._id), firstName: "Patrick", lastName: "Hill", emailAddress: "pattyhill@gmail.com", username: "pattyxhill"})
})

test('Gets a preexisting user', async () => {
    const user = await createUser("Megan", "Sanford", "msanford@stevens.edu", "Abc123!!", "megxsan", 21);
    const holder = await checkUser("msanford@stevens.edu", "Abc123!!")

    expect(holder).toStrictEqual({_id: String(user._id), firstName: "Megan", lastName: "Sanford", emailAddress: "msanford@stevens.edu", username: "megxsan"})
})

test('Adding a user with invalid input', async () => {
    let error;
    try{
        const user = await createUser("", "Smith", "smith@gmail.com", "Password12!", "megxsan", 21);

    }catch(e){
        error = e
    }

    expect(error).toStrictEqual("All input fields must be provided (createUser)")
})

test("successfully 'signs in' the user", async () => {
    const Isabella = await createUser("Isabella", "Stone", "ibellarose1@gmail.com", "MyPassword1!", "ibellarose1", 21);
    const signedIn = await checkUser("ibellarose1@gmail.com", "MyPassword1!");
    expect(signedIn).toStrictEqual({_id: String(Isabella._id), firstName: "Isabella", lastName: "Stone", emailAddress: "ibellarose1@gmail.com", username: "ibellarose1"});
})

test("should not allow user to sign in with wrong password", async () => {    
    let error;
    try {
        let a = await checkUser("ibellarose1@gmail.com", "wrongpassword!!!");
    } catch (e) {
        error = e;
    }
    expect(error).toStrictEqual("Either the email address or password is invalid");
});

test("should not allow user to sign in with wrong email", async () => {
    let error;
    try {
        let b = await checkUser("bademail@aol.com", "Greatpassword8?");
    } catch (e) {
        error = e;
    }
    expect(error).toStrictEqual("Either the email address or password is invalid");
});

test("successfully creates a user", async () => {
    const Ryan = await createUser("Ryan", "Giovanniello", "rgiovan1@gmail.com", "Stinky4L1fe?", "rgiova2702", 29);
    expect(Ryan).toStrictEqual({_id: Ryan._id, firstName: "Ryan", lastName: "Giovanniello", emailAddress: "rgiovan1@gmail.com", username: "rgiova2702", password: Ryan.password, age: 29, points: 0});
})

test("gets user by id", async () => {
    const Bryan = await createUser("Bryan", "Smith", "smithb@outlook.com", "Comedy?2", "bsmith", 18);
    const getUser = await getUserById(Bryan._id);
    expect(getUser).toStrictEqual({_id: Bryan._id, firstName: "Bryan", lastName: "Smith", emailAddress: "smithb@outlook.com", username: "bsmith", password: Bryan.password, age: 18, points: 0});
})

test("Edits user information", async () => {
    const Areeb = await createUser("Areeb", "Chaudhry", "areeb1@gmail.com", "Qwertyuiop@123", "kash1234", 21)
    const newAreeb = await editUserInfo(Areeb._id, "Areeb", "Chaudhry", "areeberz@gmail.com", "Qwertyuiop@123", "kashmeeber", 21);
    expect(newAreeb).toStrictEqual({_id: newAreeb._id, firstName: "Areeb", lastName: "Chaudhry", emailAddress: "areeberz@gmail.com", username: "kashmeeber", password: newAreeb.password, age: 21, points: 0});
})

test("Should not allow user to change email into one that already exists", async () => {
    let errorz;
    try {
        const blah = await createUser("Areeb", "Chaudhry", "blah@gmail.com", "Qwertyuiop@123", "blah123", 21)
        const newAreeb = await editUserInfo(blah._id, "Areeb", "Chaudhry", "areeberz@gmail.com", "Qwertyuiop@123", "blah123", 21);
    } catch (e) {
        errorz = e;
    }
    expect(errorz).toStrictEqual("Email already exists (updateUser)");
})

test("Should not allow user to change username into one that already exists", async () => {
    let error1;
    try {
        const blah2 = await createUser("Areeb", "Chaudhry", "blah2@gmail.com", "Qwertyuiop@123", "blah1234", 21)
        const newAreeb = await editUserInfo(blah2._id, "Areeb", "Chaudhry", "blah2@gmail.com", "Qwertyuiop@123", "blah123", 21);
    } catch (e) {
        error1 = e;
    }
    expect(error1).toStrictEqual("Username already exists (updateUser)");
})