const jwtService = require("../services/jwt.service");
const { log } = require("../services/response.service");
const msg = require("../utils/messages.utils");

async function webAuth(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(403).json(log(false, msg.auth.AUTH_HEADER));
    return;
  }

  try {
    const token = jwtService.extractBearerToken(authHeader) || '';
    const verifyJwtData = await jwtService.verifyJwt(token);

    if (!verifyJwtData.status) {
      res.status(403).json(log(false, msg.auth.NOT_VERIFIED));
      return;
    }

    req.user = verifyJwtData.jwtData;
    next(); 
  } catch (err) {
    res.status(403).json(log(false, msg.auth.INTERNAL_ERROR));
  }
}

module.exports = webAuth;
