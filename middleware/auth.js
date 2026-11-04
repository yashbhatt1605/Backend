
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Bearer token required.",
    });
  }

  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
  ) {
    return res.status(500).json({
      success: false,
      message: "Server authentication is not configured.",
    });
  }

  try {
    const payload = jwt.verify(
      match[1],
      process.env.JWT_SECRET
    );

    if (
      !payload.sub ||
      !["user", "admin"].includes(payload.role)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token claims.",
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
