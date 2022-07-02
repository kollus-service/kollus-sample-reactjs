const db = require('../persistence');

module.exports = async (req, res, next) => {
    await db.updateContent(req.body.media_content_key, {
        title: req.body.filename,
        udtm: new Date().toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
    });
    const content = await db.getContent(req.body.media_content_key);
    res.send(content);
};
