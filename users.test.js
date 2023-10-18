import {createUser,checkUser} from "./data/users";

test("successfully 'signs in' the user", async () => {
    const Isabella = await createUser("Isabella", "Stone", "ibellarose1@gmail.com", "MyPassword1!", "ibellarose1", 21);
    const signedIn = await checkUser("ibellarose1@gmail.com", "MyPassword1!");
    expect(signedIn).toStrictEqual({firstName: "Isabella", lastName: "Stone", emailAddress: "ibellarose1@gmail.com", username: "ibellarose1"});
})

test("successfully 'signs in' another user", async () => {
    const Victoria = await createUser("Victoria", "Stone", "vicgrace@aol.com", "Greatpassword8?", "vicgrace24", 18);
    const signedIn = await checkUser("vicgrace@aol.com", "Greatpassword8?");
    expect(signedIn).toStrictEqual({firstName: "Victoria", lastName: "Stone", emailAddress: "vicgrace@aol.com", username: "vicgrace24"});
})

it("should not allow user to sign in with wrong password", async () => {        
    await expect(checkUser("ibellarose1@gmail.com", "wrongpassword!!!")).rejects.toThrow("Either the email address or password is invalid");
});

it("should not allow user to sign in with wrong email", async () => {        
    await expect(checkUser("bademail@aol.com", "Greatpassword8?")).rejects.toThrow("Either the email address or password is invalid");
});
