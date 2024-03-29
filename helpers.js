import { ObjectId } from "mongodb";

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
    if (name.split(" ").length > 1) {
        throw `Error: ${stringName} cannot contain spaces`;
    }
    if (name.length < 2 || name.length > 25) {
        throw `Error: ${stringName} cannot be less than 2 or greater than 25 characters`;
    }
    return name;
}

export const checkBusinessName = (name, stringName) => {
    name = checkString(name, "Name");
    if (!/^[a-zA-Z]+/.test(name)) {
        throw `Error: ${stringName} cannot only contain letters`
    }
    if (name.length < 2 || name.length > 25) {
        throw `Error: ${stringName} cannot be less than 2 or greater than 25 characters`;
    }
    return name;
}

export const checkEmail = (email) => {
    email = checkString(email, "Email");
    if (email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === false) {
        throw "Error: You must provide a valid email";
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

export const checkAge = (age) => {
    if (typeof age !== 'number') {
        throw  `Age must be a valid number`;
    }
    if (age < 13) {
        throw `Must be 13 years of age or older to sign-up`;
    }
    if (age > 120) {
        throw `Must be between 13-120 years of age to sign-up`;
    }
    return age;
}

export const checkUsername = (username) => {
    username = checkString(username, "Username");
    if (username.length < 2 || username.length > 25) {
        throw `Error: ${username} cannot be less than 2 or greater than 25 characters`;
    }
    if (username.split(" ").length > 1) {
        throw `Error: Username cannot contain spaces`;
    }
    if (!/[a-zA-Z]/.test(username)) {
        throw `Error: Username must contain at least one letter`;
    }
    return username.toLowerCase();
}

export const checkId = (id) => {
    id = checkString(id, "Id");
    if (!ObjectId.isValid(id)) {
        throw 'Error: Invalid Object Id';
    }
    return id;
}

export const checkTime = (startTime, endTime) =>
  {
    let regexNum = /^[0-9]*$/;
    let st = startTime.split(':');
    let et = endTime.split(':');
    if (
        st.length != 2 ||
        st[0].length != 2 ||
        st[1].length != 2 ||
        !regexNum.test(st[0]) ||
        !regexNum.test(st[1])
    ) {
        throw 'Error: Must provide start time in HH:MM format';
    }
    if (
        et.length != 2 ||
        et[0].length != 2 ||
        et[1].length != 2 ||
        !regexNum.test(et[0]) ||
        !regexNum.test(et[1])
    ) {
        throw 'Error: Must provide end time in HH:MM format';
    }
    if (st[0] * 1 < 0 || st[0] * 1 > 23) {
        throw 'Error: Must provide start time in HH:MM format';
    }
      if (st[1] * 1 < 0 || st[1] * 1 > 59) {
        throw 'Error: Must provide start time in HH:MM format';
      }
      if (et[0] * 1 < 0 || et[0] * 1 > 23) {
        throw 'Error: Must provide end time in HH:MM format';
      }
      if (et[1] * 1 < 0 || et[1] * 1 > 59) {
        throw 'Error: Must provide end time in HH:MM format';
      }
      const startTimeInMinutes = st[0] * 60 + st[1] * 1;
      const endTimeInMinutes = et[0] * 60 + et[1] * 1;
    
      if (startTimeInMinutes >= endTimeInMinutes) {
        throw 'Error: Start time must be before end time';
      }

      let times = {startTime: startTime, endTime: endTime}
      return times;
  }

  export const checkDate = (date) =>
  {
    let splitDate = date.split('/');
    if (splitDate.length !== 3) {
        throw 'Error: Date must be in MM/DD/YYYY format';
      }
      let regexNum = /^[0-9]*$/;
      if (
        splitDate[0].length !== 2 ||
        splitDate[1].length !== 2 ||
        splitDate[2].length !== 4 ||
        !regexNum.test(splitDate[0]) ||
        !regexNum.test(splitDate[1]) ||
        !regexNum.test(splitDate[2])
      ) {
        throw 'Error: Date must be in MM/DD/YYYY format';
      }
      if (splitDate[0] * 1 < 1 || splitDate[0] * 1 > 12) {
        throw 'Error: Date must be in MM/DD/YYYY format';
      }
      if (splitDate[1] * 1 < 1 || splitDate[1] * 1 > 31) {
        throw 'Error: Date must be in MM/DD/YYYY format';
      }
      return date;
  }
  export const checkStatus = (name) => {
    name = checkString(name, "Status");
    const validStatuses = ["approved", "declined", "pending"];
    if (!validStatuses.includes(name)) {
        throw `Error: Invalid Status.`;
    }
    return name;
  }
  export const checkRating = (rating) => {
    if (typeof rating !== 'number') {
        throw `Rating must be a valid number`;
    }
    if (rating < 1) {
        throw `Rating must be over 1`;
    }
    if (rating > 5) {
        throw `Rating must be less than 5`;
    }
    return rating;
}