const BoArticleModel = require("../schema/bo_article.model");
const ReviewModel = require("../schema/review.model");
const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");

const {
  shapeIntoMongooseObjectId,
  board_id_enums_list,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const assert = require("assert");
const Member = require("./Member");

class Community {
  constructor() {
    this.boArticleModel = BoArticleModel;
    this.reviewModel = ReviewModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
  }
  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);
      const new_article = await this.saveArticleData(data);
      return new_article;
    } catch (err) {
      throw err;
    }
  }

  async saveArticleData(data) {
    try {
      const new_data = {
        ...data,
        bo_id: data.bo_id.toLowerCase(),
      };
      const article = new this.boArticleModel(new_data);
      return await article.save();
    } catch (mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async getMemberArticlesData(member, mb_id, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const page = inquiry["page"] ? inquiry["page"] * 1 : 1;
      const limit = inquiry["limit"] ? inquiry["limit"] * 1 : 5;
      const result = await this.boArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, art_status: "ACTIVE" } },
          { $sort: { createAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.article_err2);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getArticlesData(member, inquiry) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      let matches =
        inquiry.bo_id === "all"
          ? { bo_id: { $in: board_id_enums_list }, art_status: "ACTIVE" }
          : { bo_id: inquiry.bo_id, art_status: "ACTIVE" };
      inquiry.limit *= 1;
      inquiry.page *= 1;
      const sort = inquiry.order
        ? { [`${inquiry.order}`]: -1 }
        : { createdAt: -1 };
      const result = await this.boArticleModel
        .aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquiry.page - 1) * inquiry.limit },
          { $limit: inquiry.limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenArticleData(member, art_id) {
    try {
      art_id = shapeIntoMongooseObjectId(art_id);
      // TODO increase art_views when usen has not seen before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, art_id, "community");
      }
      const result = await this.boArticleModel.findById({ _id: art_id }).exec();
      assert.ok(result, Definer.article_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async createReviewData(member, data) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id);
      const item_id = shapeIntoMongooseObjectId(data.review_target_id);
      const review = new this.reviewModel({
        mb_id: mb_id,
        review_target_id: item_id,
        review_group: data.review_group,
        review_text: data.review_text,
        review_stars: data.review_stars,
      });
      assert.ok(review, Definer.general_err1);
      switch (data.review_group) {
        case "member":
          await this.memberModel
            .findOneAndUpdate(
              {
                _id: item_id,
                mb_status: "ACTIVE",
              },
              { $inc: { mb_comments: 1 } },
              { returnDocument: "after" },
            )
            .exec();
          break;
        case "product":
          await this.productModel
            .findOneAndUpdate(
              {
                _id: item_id,
                product_status: "PROCESS",
              },
              { $inc: { product_comments: 1 } },
              { returnDocument: "after" },
            )
            .exec();
        default:
          break;
      }
      const result = await review.save();
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getReviewsData(member, id) {
    try {
      const product_id = shapeIntoMongooseObjectId(id);
      const aggrigation = [];
      aggrigation.push(
        { $match: { review_target_id: product_id } },
        {
          $lookup: {
            from: "members",
            localField: "mb_id",
            foreignField: "_id",
            as: "member_data",
          },
        },
        { $unwind: "$member_data" },
      );
      if (member?._id) {
        const mb_id = shapeIntoMongooseObjectId(member._id);
        aggrigation.push(lookup_auth_member_liked(mb_id));
      }
      const result = await this.reviewModel.aggregate(aggrigation);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Community;
