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
      this.cache.unshift(array);
      if (this.cache.length > 500) {
        this.cache.pop();
      }
    }
  }

  async read(length) {
    if ((length === 500 || !length) && this.cache) {
      return this.cache;
    }

    const db = await this.db$;
    this.cache = await db.all('SELECT * FROM conditions ORDER BY time DESC limit 500');

    return this.cache;
  }
}

module.exports = new BmeCache();
