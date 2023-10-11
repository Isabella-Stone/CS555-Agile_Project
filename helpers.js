export const checkString = (str, stringName) => {
    if (typeof str !== 'string' || str.trim().length === 0) {
        throw `${stringName} must be a valid string`;
    }
    return str.trim();
}

export const checkName = (name, stringName) => {
    name = checkString(name, "Name");
    if (!/^[a-zA-Z]+/.test(name)) {
        throw `Error: ${stringName} cannot contain any spaces or numbers`
    }
    if (name.length < 2 || name.length > 25) {
        throw `Error: ${stringName} cannot be less than 2 or greater than 25 characters`;
    }
    return name;
}

export const checkEmail = (email) => {
    email = checkString(email, "Email");
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        throw `Error: Invalid email format`;
    }
    return email.toLowerCase();
}

export const checkPassword = (password) => {
    password = checkString(password, "Password");

    if (password.split(" ").length > 1) {
        throw `Error: Password cannot contain spaces`;
    }
    if (password.length < 8) {
        throw `Error: Password length must be at least 8`;
    }
    if (!/[A-Z]/.test(password)) {
        throw `Error: Password must contain at least one uppercase character`;
    }
    if (!/\d/.test(password)) {
        throw `Error: Password must contain at least one number`;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw `Error: Password must contain at least one special character`;
    }
    return password;
}