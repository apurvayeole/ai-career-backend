import User from "../models/user.js";
import bcrypt from "bcrypt";

async function getSignupPage(req, res) {
  return res.render("signup");
}

async function getLoginPage(req, res) {
  return res.render("login");
}

async function handleUserSignup(req, res) {
  try {
    const { name, email, password, city, education, skills, experienceLevel } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        error: "Email already registered",
      });
    }

    // Validate required fields
    if (!name || !email || !password || !education || !experienceLevel) {
      return res.render("signup", {
        error: "All required fields must be filled",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with all fields
    await User.create({
      name,
      email,
      password: hashedPassword,
      city: city || "",
      education,
      skills: skills ? (Array.isArray(skills) ? skills : [skills]) : [],
      experienceLevel,
    });

    return res.redirect("/user/login");
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      error: "Error creating account",
    });
  }
}

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        error: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid Email or Password",
      });
    }

    // Set session/token logic here
    res.cookie("userId", user._id.toString());
    return res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    return res.render("login", {
      error: "Error logging in",
    });
  }
}

export { getSignupPage, getLoginPage, handleUserSignup, handleUserLogin };