const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const ShopController = require("./controllers/ShopController");

/****************************
 *         REST API/       *
 ***************************/

// Member related routers

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthmember,
  memberController.getChosenMember
);

// Prodct related routers
router.post(
  "/products",
  memberController.retrieveAuthmember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retrieveAuthmember,
  productController.getChosenProduct
);
// Shop related routers
router.get(
  "/shops",
  memberController.retrieveAuthmember,
  ShopController.getShops
);

module.exports = router;
