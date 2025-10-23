const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const ShopController = require("./controllers/ShopController");
const orderController = require("./controllers/orderController");
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
router.get(
  "/shops/:id",
  memberController.retrieveAuthmember,
  ShopController.getChosenShop
);
// Order related routers
router.post(
  "/orders/create",
  memberController.retrieveAuthmember,
  orderController.createOrder
);

router.get(
  "/orders",
  memberController.retrieveAuthmember,
  orderController.getMyOrders
);

router.post(
  "/orders/edit",
  memberController.retrieveAuthmember,
  orderController.editChosenOrder
);

module.exports = router;
