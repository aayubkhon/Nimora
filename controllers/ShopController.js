const assert = require("assert");
const Member = require("../models/Member");
const Product = require("../models/Product");
const Definer = require("../lib/mistake");
const Shop = require("../models/Shop");

let ShopController = module.exports;

ShopController.getShops = async (req, res) => {
  try {
    console.log("GET: cont/getShops");
    const data = req.query;
    const shop = new Shop();
    const result = await shop.getShopsData(req.member,data);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getShops,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/****************************
 *   BSSR RELATED METHODS/       *
 ***************************/

ShopController.home = (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.getMyShopData = async (req, res) => {
  try {
    console.log("GET: cont/getMyShopData");
    // TODO get my shop products
    const product = new Product();
    const data = await product.getAllProductsDataShop(res.locals.member);

    res.render("shop-collections", { shop_data: data });
  } catch (err) {
    console.log(`ERROR, cont/getMyShopData,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.getSignupMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyShop");
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyShop,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signupProcess");
    assert(req.file, Definer.general_err3);
    let new_member = req.body;
    new_member.mb_type = "SHOP";
    new_member.mb_image = req.file.path;
    const member = new Member();
    const result = await member.signupData(new_member);
    assert(result, Definer.general_err1);

    req.session.member = result;
    res.redirect("/shop/products/collection");
  } catch (err) {
    console.log(`ERROR, cont/signupProcess,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.getLoginMyShop = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyShop");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyShop,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/loginProcess");
    const data = req.body;
    const member = new Member();
    result = await member.loginData(data);

    req.session.member = result;
    req.session.save(function () {
      result.mb_type === "ADMIN"
        ? res.redirect("/shop/all-shop")
        : res.redirect("/shop/products/collection");
    });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.logout = (req, res) => {
  try {
    console.log("GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/shop");
    });
  } catch (err) {
    console.log(`ERROR, cont/logout,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.validateAuthShop = (req, res, next) => {
  if (req.session?.member?.mb_type === "SHOP") {
    req.member = req.session.member;
    next();
  } else {
    res.json({
      state: "fail",
      message: "only  authenticated members with shop type",
    });
  }
};

ShopController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};

ShopController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
          alert('Admin page: Permission denied!');
          window.location.replace('/shop');
          </script>`;
    res.end(html);
  }
};

ShopController.getAllShop = async (req, res) => {
  try {
    console.log("GET: cont/getAllShop");
    const shop = new Shop();
    const shop_data = await shop.getAllShopsData();
    res.render("all-shop", { shop_data: shop_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllShop,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

ShopController.updateShopByAdmin = async (req, res) => {
  try {
    console.log("POST: cont/updateShopByAdmin");
    const shop = new Shop();
    const result = await shop.updateShopByAdminData(req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateShopByAdmin,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
