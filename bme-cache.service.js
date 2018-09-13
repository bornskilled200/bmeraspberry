const sqlite = require('sqlite');

class BmeCache {

  constructor() {
    this.db$ = sqlite.open('./bme.db', { cached: true })
      .then(async db => {
        await db.run(`CREATE TABLE IF NOT EXISTS conditions (
          time        INTEGER NOT NULL,
          uptime      INTEGER NOT NULL,
          temperature REAL    NOT NULL,
          humidity    REAL    NOT NULL,
          air         REAL    NOT NULL,
          stable      INTEGER NOT NULL
        );`);

        await db.run('CREATE INDEX IF NOT EXISTS Idx1 ON conditions(time);');

        return db;
      });

    this.statement = this.db$.then(db => {
      return db.prepare('INSERT INTO conditions(time, uptime, temperature, humidity, air, stable) values(?, ?, ?, ?, ?, ?)');
    });
  }

  async write(array) {
    const statement = await this.statement;
    await statement.run(array);

    if (this.cache) {
      this.cache.unshift({
        time: array[0],
        uptime: array[1],
        temperature: array[2],
        humidity: array[3],
        air: array[4],
        stable: array[5],
      });
      if (this.cache.length > 500) {
        this.cache.pop();
      }
    }
  }

  async read(length) {
    const db = await this.db$;
    if (length === 500 || !length) {
      if (!this.cache) {
        this.cache = await db.all(`SELECT * FROM conditions ORDER BY time DESC limit 500`);
      }
      return this.cache;
    }

    return db.all(`SELECT * FROM conditions ORDER BY time DESC limit ${length}`);
  }
}

module.exports = new BmeCache();
