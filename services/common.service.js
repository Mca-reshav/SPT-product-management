const moment = require("moment");
const { error } = require("./response.service");
const crypto = require("crypto");

const current = moment().format('HHmmss');

module.exports = {
  validateDate: (date) => {
    if (!date) return false;
    return moment(date).isValid();
  },
  generateID: (contactNo) => {
    try {
      const randomStart = crypto.randomBytes(4).toString("hex").slice(0, 2);
      const randomEnd = crypto.randomBytes(4).toString("hex").slice(0, 2);
      return `${randomStart.toUpperCase()}${String(contactNo).slice(-4)}${current}${randomEnd.toUpperCase()}`;
    } catch (err) {
      error(err);
    }
  },
  generateProdID: () => {
    try {
      const randomStart = crypto.randomBytes(4).toString("hex").slice(0, 4);
      const randomEnd = crypto.randomBytes(4).toString("hex").slice(0, 4);
      return `P${randomStart.toUpperCase()}P${current}P${randomEnd.toUpperCase()}`;
    } catch (err) {
      error(err);
    }
  }
};