const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || './sqlite.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirtitle, { recursive: true });
    }

    return new Promise((acc, rej) => {
      // In-memory based 방식으로 설정 가능
        // db = new sqlite3.Database(':memory:', (err) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                'CREATE TABLE IF NOT EXISTS contents_list (id varchar(36), title varchar(400), mckey varchar(200), cdtm datetime default current_timestamp, udtm datetime)',
                (err, result) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}
// CRUD 예시
async function getContents() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM contents_list', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(content =>
                    Object.assign({}, content),
                ),
            );
        });
    });
}

async function getContent(mckey) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM contents_list WHERE mckey=?', [mckey], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(content =>
                    Object.assign({}, content),
                )[0],
            );
        });
    });
}

async function storeContent(content) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO contents_list (id, title, mckey) VALUES (?, ?, ?)',
            [content.id, content.title, content.mckey],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateContent(mckey, content) {
  return new Promise((acc, rej) => {
      db.run(
          'UPDATE contents_list SET title=?, udtm=? WHERE mckey = ?',
          [content.title, content.udtm, mckey],
          err => {
              if (err) return rej(err);
              acc();
          },
      );
  });
}

async function removeContent(mckey) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM contents_list WHERE mckey = ?', [mckey], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getContents,
    getContent,
    storeContent,
    updateContent,
    removeContent,
};
