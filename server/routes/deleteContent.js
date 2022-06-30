const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeItem(req.body.media_content_key);
    res.sendStatus(200);
};
