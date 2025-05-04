const auth = require("../helpers/firebaseSetup");
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
  updateProfile,
} = require("firebase/auth");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

// Signup FB User
const signupFBUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed up:", user);
    return user;
  } catch (err) {
    console.error("Error during signup:", err.message);
    throw err;
  }
};

// Signed-up Email
sgMail.setApiKey(process.env.sendGrindAPIKey);
const msg = {
  to: process.env.toEmail,
  from: process.env.fromEmail,
  subject: "Welcome to medTrackr!",
  html: "<body> \
        <b>Thank you for Signing up with MedTrackr</b> \
    </body>",
};

const sendFBMail = async (userEmail) => {
  try {
    const templatePath = path.join(__dirname, "./welcomeEmail.ejs");
    const htmlContent = await ejs.renderFile(templatePath, { userEmail });

    const msg = {
      to: userEmail,
      from: process.env.fromEmail,
      subject: "Welcome to MedTrackr!",
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log("Welcome email sent to:", userEmail);
  } catch (err) {
    console.error("Error sending welcome email:", err.message);
  }
};

// Login FB User
const loginFBUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User logged in:", user);
    return user;
  } catch (err) {
    console.error("Error during login:", err.message);
    throw err;
  }
};

// Update FB User
const updateFBUser = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    await updateProfile(user, updates);
    console.log("Firebase user updated:", updates);
    return user;
  } catch (err) {
    console.error("Error updating Firebase user:", err.message);
    throw err;
  }
};

// Signout FB User
const logoutFBUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out.");
  } catch (err) {
    console.error("Error during logout:", err.message);
  }
};

// Delete FB User
const deleteFBUser = async () => {
  try {
    const result = await deleteUser(auth.currentUser);
    console.log(result, "User deletion result");
    return result;
  } catch (err) {
    console.error(err, "error occured");
  }
};

module.exports = {
  signupFBUser,
  sendFBMail,
  loginFBUser,
  updateFBUser,
  logoutFBUser,
  deleteFBUser,
};
