const db = require('..');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res, next) => {
    const content = {
        id: uuidv4(),
        title: req.body.filename,
        mckey: req.body.media_content_key,
    };

    await db.storeContent(content);
    res.send(content);
};
