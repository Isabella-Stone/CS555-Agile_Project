import {createUser,checkUser} from "./data/users";

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
    const signedIn = await checkUser("ibellarose1@gmail.com", "MyPassword1!");
    expect(signedIn).toStrictEqual({firstName: "Isabella", lastName: "Stone", emailAddress: "ibellarose1@gmail.com", username: "ibellarose1"});
})

it("should not allow user to sign in with wrong password", async () => {        
    await expect(checkUser("ibellarose1@gmail.com", "wrongpassword!!!")).rejects.toThrow("Either the email address or password is invalid");
});

it("should not allow user to sign in with wrong email", async () => {        
    await expect(checkUser("bademail@aol.com", "Greatpassword8?")).rejects.toThrow("Either the email address or password is invalid");
});
