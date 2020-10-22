import { send } from "@sendgrid/mail";
import axios from "axios";


// Admin Sign Up
export async function signUpAdmin(admin) {
  try {
    const {email, password, recaptchaValue} = admin;
    console.log(admin)

    let request = await axios.post("http://localhost:5000/api/sign-up", {
      email,
      password,
      recaptchaValue
    });
    console.log(request)
    if (request.data.success) {
      return { success: true };
    }
    return { success: false };
  } catch (ex) {
    console.error(new Error("Request has failed with an error " + ex));
    return { success: false };
  }
}

// Admin Login
export async function Login(user) {
  try {
    const {email, password, recaptchaValue} = user;

    let request = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
      recaptchaValue
    });
    if (request.data.success) {
      // Store Token
      localStorage.setItem("adminToken", request.data.token);
      return { success: true };
    }
    return { success: false };
  } catch (ex) {
    console.error(new Error("Request has failed with an error " + ex));
    return { success: false };
  }
}
// Load Data 
export async function loadExcelData () {
  const authStr = `Bearer ${localStorage.getItem("adminToken")}`;
 const data = await axios.get("http://localhost:5000/api/load-excel", { headers: { Authorization: authStr } })
}
// Admin Settings
export async function changeSettings(user) {
  // Recaptcha Check
  // Change Email
  // Change Password
}

// Create User Entry
export async function createEntry(entryString) {
  try {
    // name, phoneNum, cashApp, numOfSpots
    let contents = entryString.split(/[ ,]+/).filter(Boolean);
    console.log(contents);
    // Name
    const name =
      contents.length >= 4 ? `${contents[0]} ${contents[1]}` : contents[0];
    console.log(name);
    // PhoneNum
    const phoneNum = contents.length >= 4 ? contents[2] : contents[1];
    // Cash App
    const cashApp = contents.length >= 4 ? contents[3] : contents[2];
    // Num of Spots
    const numOfSpots =
      contents.length >= 4 ? Number(contents[4]) : Number(contents[3]);

    // Send Request to the Server
    let request = await axios.post("http://localhost:5000/api/", {
      name,
      phoneNum,
      cashApp,
      numOfSpots,
    });
    if (request.data.success) {
      return { success: true };
    }
    return { success: false };
  } catch (ex) {
    console.error(new Error("Request has failed with an error " + ex));
    return { success: false };
  }
}

// Send New Verify Code
export async function sendVerifyCode() {
  const authStr = `Bearer ${localStorage.getItem("adminToken")}`;

  try {
    const sendCode = await axios.get("http://localhost:5000/api/verify-new", { headers: { Authorization: authStr } });
    if (sendCode.data.success) {
      return {success: true, message: "Verified code sent"}
    }
  } catch (ex) {
    return {success: false, message: "Sending verification code failed"}
  }
}

// Send New Forgot Code
export async function sendForgotCode(email) {
  try {
    const sendCode = await axios.post("http://localhost:5000/api/forgot-new", {
        email
    });
    if (sendCode.data.success) {
      return {success: true, message: "If there is an email associated with the account, the code will be sent via email."}
    }
  } catch (ex) {
    return {success: false, message: "Sending forgot code failed"}
  }
}

// Send New Forgot Code
export async function verifyCode({code, password, recaptchaValue}) {
  console.log(code)
  try {
    const sendCode = await axios.post("http://localhost:5000/api/verify", {
        verifyCode: code,
        password: !password ? null : password,
        recaptchaValue
    });
   
    if (sendCode.data.success) {
      return {success: true, message: "code has successfully worked!"}
    }
  } catch (ex) {
    return {success: false, message: "Sending forgot code failed"}
  }
}

export async function updateAdmin({ email, password, recaptchaValue}) {
  try {
    // Update the user admin
    const authStr = `Bearer ${localStorage.getItem("adminToken")}`;
    if (password == null && email == null) {
      return {error: true, message: "Email and password is empty!"}
    }
    const updateAdmin = await axios({
        method: 'PATCH',
        url:"http://localhost:5000/api/update-admin",
        headers: { 
          'Authorization': authStr
        },
          data: {
            editWhich: email == "" ? "password" : "email",
            email,
            password,
            recaptchaValue
          }
    
    });
    console.log(updateAdmin);
    if (updateAdmin.data.success) {
      return {success: true, message: "Admin successfully updated!"}
    }
    throw new Error("Unexpected error has occurred!")
  } catch (ex) {
    console.log(ex.message)
    return {success: false, message: "Sending forgot code failed"};
  }
}