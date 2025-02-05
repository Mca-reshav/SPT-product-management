const pageNotFound = (req, res, next) => {
    res.json({
      success: false,
      message: "Page Not Found",
    });
  };
  
  module.exports = pageNotFound;
  