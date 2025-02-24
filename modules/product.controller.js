const commonService = require("../services/common.service");
const {
  deleteOne,
  create,
  findOne,
  pagination,
  updateOne,
} = require("../services/mongo.service");
const { error, log } = require("../services/response.service");
const { product, user } = require("../utils/messages.utils");
const moment = require("moment");
const cloudinary = require("../config/cloudinary.config");

module.exports = {
  async add(req, res) {
    try {
      const isExist = await findOne({
        model: "ProductSPT",
        query: { name: req.body.name },
        attributes: ["productId"],
      });

      if (isExist?.productId)
        return res.json(log(false, product.ALREADY_EXIST));

      const userId = req.user?.userId;
      const genProdId = commonService.generateProdID();
      const current = moment().format("YYYY-MM-DD HH:mm:ss");
      const saveData = await create({
        model: "ProductSPT",
        data: {
          productId: genProdId,
          ...req.body,
          createdBy: userId || "",
          createdAt: current,
        },
      });
      if (saveData) return res.json(log(true, product.ADDED));
      return res.json(log(false, product.ERROR));
    } catch (err) {
      error(err);
    }
  },
  async show(req, res) {
    const { searchText, page, limit, search, sortField, sortOrder } = req.query;
    const getData = await pagination({
      model: "ProductSPT",
      query: {},
      attributes: [
        "productId",
        "image",
        "name",
        "description",
        "price",
        "createdAt",
        "createdBy",
        "updatedBy",
        "updatedAt",
      ],
      searchFields: ["name", "description"],
      sort: ["createdAt"],
      defaultSort: ["createdAt"],
      searchText: searchText || search || "",
      page: page || 1,
      limit: limit || 10,
      excludeAttribute: ["_id"],
    });

    const creatorObj = { name: [], userId: [] };
    const updateObj = { name: [], userId: [] };
    for (let i = 0; i < getData.data.length; i++) {
      let data = getData.data[i];

      if (data.createdBy) {
        getData.data[i].createdBy = await getUserNameById(
          data.createdBy,
          creatorObj
        );
      }

      if (data.updatedBy) {
        getData.data[i].updatedBy = await getUserNameById(
          data.updatedBy,
          updateObj
        );
      }
    }

    if (getData) return res.json(log(true, user.SUCCESS, getData));
    else return res.json(log(false, product.ERROR));
  },
  async edit(req, res) {
    try {
      const productId = req.params?.productId;
      const isExist = await findOne({
        model: "ProductSPT",
        query: { productId: productId },
        attributes: ["productId"],
      });

      if (!isExist?.productId) return res.json(log(false, product.NOT_EXIST));
      const current = moment().format("YYYY-MM-DD HH:mm:ss");
      const saveData = await updateOne({
        model: "ProductSPT",
        query: { productId: productId },
        data: { ...req.body, updatedAt: current, updatedBy: req.user.userId },
      });

      if (saveData) return res.json(log(true, product.EDITED));
      return res.json(log(false, product.ERROR));
    } catch (err) {
      error(err);
    }
  },
  // async uploadImg(req, res) {
  //   try {
  //     const productId = req.params?.productId,
  //       image = req.body?.image;  
  //     const current = moment().format("YYYY-MM-DD HH:mm:ss");
  //     const checkImg = await findOne({
  //       model: "ProductSPT",
  //       query: { productId: productId},
  //       attributes: ["image"]
  //     });
  //     if (checkImg) {
  //       const insertImg = await updateOne({
  //         model: "ProductSPT",
  //         query: { productId: productId},
  //         data: { image: image, updatedAt: current, updatedBy: req.user.userId }
  //       });
        
  //       if (insertImg) return res.json(log(true, product.IMG_UPLOAD));
  //       return res.json(log(false, product.IMG_ERR));
  //     }
  //     return res.json(log(false, product.ERROR));
  //   } catch (err) {
  //     error(err)
  //   }
  // },
  async uploadImg(req, res) {
    try {
      const productId = req.params?.productId;
      if (!req.file) return res.json({ success: false, message: "No image uploaded!" });
      console.log(req.file.path)
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
  
      const imageUrl = result.secure_url;
      const current = moment().format("YYYY-MM-DD HH:mm:ss");
  
      const checkImg = await findOne({
        model: "ProductSPT",
        query: { productId: productId },
        attributes: ["image"],
      });
  
      if (checkImg) {
        const insertImg = await updateOne({
          model: "ProductSPT",
          query: { productId: productId },
          data: { image: imageUrl, updatedAt: current, updatedBy: req.user.userId },
        });
  
        if (insertImg) return res.json({ success: true, message: "Image updated successfully!", imageUrl });
        return res.json({ success: false, message: "Failed to update image." });
      }
  
      return res.json({ success: false, message: "Product not found!" });
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
  async deleteProduct(req, res) {
    try {
      const productId = req.params.productId;
      const isExist  = await findOne({
        model: "ProductSPT",
        query: { productId: productId},
        attributes: ["name"]
      });

      if (!isExist?.name) return res.json(log(false, product.NOT_EXIST));

      const remove = await deleteOne({
        model: "ProductSPT",
        query: { productId: productId}
      });
      if (remove) return res.json(log(true, 'success'));
      return res.json(log(false, "internal error"))
    } catch (err) {
      error(err)
    }
  }
};

const getUserNameById = async (userId, userObj) => {
  if (userObj.userId.includes(userId)) {
    const getIndex = userObj.userId.indexOf(userId);
    return userObj.name[getIndex];
  } else {
    const getName = await findOne({
      model: "UserSPT",
      query: { userId },
      attributes: ["name"],
    });
    if (getName?.name) {
      userObj.name.push(getName.name);
      userObj.userId.push(userId);
      return getName.name;
    }
    return "--";
  }
};

