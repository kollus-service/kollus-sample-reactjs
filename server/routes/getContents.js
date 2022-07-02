const db = require('../persistence');

module.exports = async (req, res, next) => {
    const contents = await db.getContents();
    res.send(contents);
};
