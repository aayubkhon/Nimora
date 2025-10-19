const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
let productController = module.exports;

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);
    console.log(result, "results");
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.getChosenProductData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenProduct,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/****************************
 *   BSSR RELATED METHODS/       *
 ***************************/

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert(req.files, Definer.general_err3);

    const product = new Product();
    let data = req.body;
    data.product_images = req.files.map((ele) => {
      return ele.path;
    });
    const result = await product.addNewProductData(data, req.member);
    const html = `<script>
                  alert('new product added successfully');
                  window.location.replace('/shop/products/collection')
                  </script>`;
    res.end(html);
    assert.ok(result, Definer.product_err1);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct,${err.message}`);
  }
};

productController.updateChoosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChoosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.updateChoosenProductData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChoosenProduct,${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
