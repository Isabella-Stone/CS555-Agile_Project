import {createUser,checkUser} from "./data/users";

test('Gets a preexisting user', async () => {
    const user = await createUser("Patrick", "Hill", "pattyhill@gmail.com", "Abc123!!", "pattyxhill", 48);
    const holder = await checkUser("pattyhill@gmail.com", "Abc123!!")

    expect(holder).toStrictEqual({firstName: "Patrick", lastName: "Hill", emailAddress: "pattyhill@gmail.com", username: "pattyxhill"})
})

test('Gets a preexisting user', async () => {
    const user = await createUser("Megan", "Sanford", "msanford@gmail.com", "Abc123!!", "megxsan", 21);
    const holder = await checkUser("msanford@gmail.com", "Abc123!!")

    expect(holder).toStrictEqual({firstName: "Megan", lastName: "Sanford", emailAddress: "msanford@gmail.com", username: "megxsan"})
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
