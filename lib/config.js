const mongoose = require("mongoose");

(exports.member_type_enums = ["USER", "ADMIN", "SHOP"]),
  (exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"]);
exports.member_ordernary_enums = ["Y", "N"];
exports.product_collection_enums = [
  "Bracelet",
  "Earing",
  "Necklace",
  "Ring",
  "Diamond",
  "Etc",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "CANCELLED"];
exports.product_size_enums = ["S", "M", "L"];

exports.like_view_group_list = ["product", "member", "community"];
exports.board_id_enums_list = ["all blogs", "news", "humor", "recommendation"];
exports.board_article_status_enums_list = ["active", "deleted"];
/****************************************
 *     MOONGODB RELATED COMMANDS        *
 ****************************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
