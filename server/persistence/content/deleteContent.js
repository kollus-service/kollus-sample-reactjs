const db = require('..');

module.exports = async (req, res, next) => {
    await db.removeContent(req.body.media_content_key);
    res.sendStatus(200);
};
