const assert = require("assert");
const Member = require("../models/Member");
let memberController = module.exports;
const jwt = require("jsonwebtoken");
const Definer = require("../lib/mistake");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    const member = new Member();
    new_member = await member.signupData(data);
    res.json({ state: "success", data: new_member });
  } catch (err) {
    console.log(`ERROR, cont/signup,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    const member = new Member();
    result = await member.loginData(data);
    console.log("result:", result);

    const token = memberController.createToken(result);
    console.log("token::", token);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/login,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("logout page");
};

memberController.createToken = (result) => {
  try {
    const upload_data = {
      _id: result.id,
      mb_nick: result.mb_nick,
      mb_type: result.mb_type,
    };
    const token = jwt.sign(upload_data, process.env.SECRET_TOKEN, {
      expiresIn: "7d",
    });
    assert.ok(token, Definer.auth_err4);
    return token;
  } catch (err) {
    throw err;
  }
};
