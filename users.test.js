import {createUser,checkUser,getUserById} from "./data/users";
import {} from "./helpers";

test('Gets a preexisting user', async () => {
    const user = await createUser("Patrick", "Hill", "pattyhill@gmail.com", "Abc123!!", "pattyxhill", 48);
    const holder = await checkUser("pattyhill@gmail.com", "Abc123!!")

    expect(holder).toStrictEqual({firstName: "Patrick", lastName: "Hill", emailAddress: "pattyhill@gmail.com", username: "pattyxhill"})
})

test('Gets a preexisting user', async () => {
    const user = await createUser("Megan", "Sanford", "msanford@stevens.edu", "Abc123!!", "megxsan", 21);
    const holder = await checkUser("msanford@stevens.edu", "Abc123!!")

    expect(holder).toStrictEqual({firstName: "Megan", lastName: "Sanford", emailAddress: "msanford@stevens.edu", username: "megxsan"})
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
    console.log(Isabella);
    const signedIn = await checkUser("ibellarose1@gmail.com", "MyPassword1!");
    expect(signedIn).toStrictEqual({firstName: "Isabella", lastName: "Stone", emailAddress: "ibellarose1@gmail.com", username: "ibellarose1"});
})

it("should not allow user to sign in with wrong password", async () => {        
    await expect(checkUser("ibellarose1@gmail.com", "wrongpassword!!!")).rejects.toThrow("Either the email address or password is invalid");
});

it("should not allow user to sign in with wrong email", async () => {        
    await expect(checkUser("bademail@aol.com", "Greatpassword8?")).rejects.toThrow("Either the email address or password is invalid");
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