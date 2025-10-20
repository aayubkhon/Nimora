const express = require("express");
const router_bssr = express.Router();
const ShopController = require("./controllers/ShopController");
const productController = require("./controllers/productController");
const uploader_product = require("./utils/upload-multer")("products");
const uploader_members = require("./utils/upload-multer")("members");

// const uploader_member = require("./utils/upload-multer")("members");
/****************************
 *         BSSR EJS        *
 ***************************/

router_bssr.get("/", ShopController.home);

router_bssr
  .get("/signup", ShopController.getSignupMyShop)
  .post(
    "/signup",
    uploader_members.single("shop_img"),
    ShopController.signupProcess
  );

router_bssr
  .get("/login", ShopController.getLoginMyShop)
  .post("/login", ShopController.loginProcess);

router_bssr.get("/logout", ShopController.logout);

router_bssr.get("/check_me", ShopController.checkSessions);

router_bssr.get("/products/collection", ShopController.getMyShopData);
router_bssr.post(
  "/products/create",
  ShopController.validateAuthShop,
  uploader_product.array("product_images", 5),
  productController.addNewProduct
);
router_bssr.post(
  "/products/edit/:id",
  ShopController.validateAuthShop,
  productController.updateChoosenProduct
);
router_bssr.get(
  "/all-shop",
  ShopController.validateAdmin,
  ShopController.getAllShop
);

router_bssr.get(
  "/all-shop",
  ShopController.validateAdmin,
  ShopController.getAllShop
);

router_bssr.post(
  "/all-shop/edit",
  ShopController.validateAdmin,
  ShopController.updateShopByAdmin
);

module.exports = router_bssr;
