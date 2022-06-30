const db = require('../persistence');
const uuid = require('uuid');

module.exports = async (req, res) => {
    const item = {
        id: uuid(),
        title: req.body.filename,
        mckey: req.body.media_content_key,
    };

    await db.storeItem(item);
    res.send(item);
};
