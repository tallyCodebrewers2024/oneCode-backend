const jwt = require("jsonwebtoken");

const verifyToken =
    (...roles) =>
    (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(403).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(200).json({ message: "Unauthorized" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(200).json({ message: "Unauthorized" });
            }

            req.user = decoded;

            next();
        });
    };

module.exports = verifyToken;
