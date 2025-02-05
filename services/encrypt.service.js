const bcrypt = require("bcrypt");
const { error } = require("./response.service");

const encryptService = {
  async hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (err) {
      error(`Error hashing password: ${err.message}`);
    }
  },

  async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      error(`Error comparing password: ${err.message}`);
    }
  },
};

module.exports = encryptService;
