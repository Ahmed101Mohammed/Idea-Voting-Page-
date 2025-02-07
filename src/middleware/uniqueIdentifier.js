module.exports = (req, res, next) => {
    const uniqueIdentifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.uniqueIdentifier = uniqueIdentifier;
    next();
};
