// Handles requests to routes that don't exist (must be registered AFTER all real routes)
const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Route not found - ${req.originalUrl}`));
};

// Centralized error handler (must be registered LAST, after notFound and all routes)
const errorHandler = (err, req, res, next) => {
    // Mongoose bad ObjectId (e.g. GET/PUT/DELETE /tasks/not-a-valid-id)
    if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(404).json({ message: "Resource not found" });
    }

    // Mongoose validation errors (e.g. missing required field)
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({ message: messages.join(", ") });
    }

    // Duplicate key error (e.g. registering with an email that already exists)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        return res.status(400).json({ message: `${field} already exists` });
    }

    // Multer file-size / upload errors
    if (err.name === "MulterError") {
        return res.status(400).json({ message: err.message });
    }

    // Fallback: use whatever status was already set, or default to 500
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || "Server error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

module.exports = { notFound, errorHandler };
