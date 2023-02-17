const express = require("express");
const User = require("../models/user_model");
const jwt = require("jsonwebtoken");
// GET Requests--------------------------------------------------------------
const index = (req, res) => {
  res.render("index");
};

const content_get = (req, res) => {
  res.render("content");
};

const sighUp_get = (req, res) => {
  res.render("./handel_users/sighUp");
};

const login_get = (req, res) => {
  res.render("./handel_users/login");
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
// End Get Requests--------------------------------------------------------------
// ******************************************************************************
// Start Post Requests-----------------------------------------------------------
const sighUp_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = handelError(err);

    res.status(400).json({ error });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const error = handelError(err);
    res.status(400).json({ error });
  }
};
// End Post Requests-----------------------------------------------------------
// ******************************************************************************
//general functions------------------------------------------------------------
//handel error
const handelError = (err) => {
  let error = { email: "", password: "" };
  if (err.message === "incorrect Email") {
    error.email = "That email is not registerd";
  }
  if (err.message === "incorrect Password") {
    error.password = "That password is not correct";
  }
  if (err.code === 11000) {
    error.email = "this email is already exist";
    return error;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};
// jwt func
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "saad secret test", {
    expiresIn: maxAge,
  });
};

module.exports = {
  index,
  content_get,
  sighUp_get,
  login_get,
  sighUp_post,
  login_post,
  logout_get,
};
