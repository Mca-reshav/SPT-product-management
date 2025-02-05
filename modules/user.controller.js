const msg = require("../utils/messages.utils");
const { error, log, tokenLog } = require("../services/response.service");
const commonFn = require("../services/common.service");
const { create, findOne } = require("../services/mongo.service");
const encryptService = require("../services/encrypt.service");
const { generateJwt } = require("../services/jwt.service");

const userController = {
  async register(req, res) {
    try {
      const { contactNo, emailId, password } = req.body;
      const isExist = await findOne({
        model: "UserSPT",
        query: { 
          $or: [{emailId: emailId}, {contactNo: contactNo}]
         },
        attributes: ["userId"],
      });
      if (isExist?.userId) return res.json(log(false, msg.user.ALREADY_EXIST));

      const genUserId = commonFn.generateID(contactNo);
      const encPassword = await encryptService.hashPassword(password);
      delete req.body.password;
      const saveData = await create({
        model: "UserSPT",
        data: { userId: genUserId, password: encPassword, ...req.body },
      });
      if (saveData)
        return res.status(201).json(log(true, msg.user.REGISTER_DONE));
      return res.json(log(false, msg.user.FAILED));
    } catch (err) {
      error(err);
      res.status(500).json(log(false, msg.auth.INTERNAL_ERROR));
    }
  },

  async login(req, res) {
    try {
      const { emailId, password } = req.body;
      const checkExist = await findOne({
        model: "UserSPT",
        query: { emailId: emailId },
        attributes: ["userId", "password"],
      });

      if (!checkExist?.userId) return res.json(log(false, msg.user.NOT_REG));

      const matchPassword = await encryptService.comparePassword(
        password,
        checkExist?.password
      );
      if (!matchPassword) return res.json(log(false, msg.user.WRONG_PASSWORD));

      const genToken = await generateJwt({ userId: checkExist.userId });
      tokenLog(genToken.token);
      res.json(log(true, msg.user.LOGGED_IN, genToken.token));
    } catch (err) {
      error(err);
    }
  },

  async profile(req, res) {
    try {
      const checkExist = await findOne({
        model: "UserSPT",
        query: { userId: req.user.userId },
        attributes: ["name", "contactNo", "emailId", "createdAt"],
      });
      if (!checkExist?._id) return res.json(log(false, msg.user.NOT_REG));
      delete checkExist._id
      return res.json(log(true, msg.user.SUCCESS, checkExist));
    } catch (err) {
      error(err)
    }
  }
};

module.exports = userController;
