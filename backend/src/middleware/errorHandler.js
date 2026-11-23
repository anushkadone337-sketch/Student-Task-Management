function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors).map((item) => item.message).join(" ")
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid task ID." });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server."
  });
}

module.exports = errorHandler;
