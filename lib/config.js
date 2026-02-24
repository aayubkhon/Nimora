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

exports.like_view_group_list = ["product", "member", "community", "review"];
exports.board_id_enums_list = ["all blogs", "news", "humor", "recommendation"];
exports.board_article_status_enums_list = ["ACTIVE", "deleted"];
/****************************************
 *     MOONGODB RELATED COMMANDS        *
 ****************************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};

exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
  let lookup_obj = {
    $lookup: {
      from: "follows",
      let: {
        lc_follow_id: follow_id,
        lc_subscriber_id: mb_id,
        nw_my_following: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$lc_follow_id"] },
                { $eq: ["$subscriber_id", "$$lc_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$nw_my_following",
          },
        },
      ],
      as: "me_followed",
    },
  };
  return lookup_obj;
};
exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_liken_item_id: "$_id",
        lc_mb_id: mb_id,
        nw_my_favorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_ref_id", "$$lc_liken_item_id"] },
                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$nw_my_favorite",
          },
        },
      ],
      as: "me_liked",
    },
  };
};
