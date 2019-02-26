const sqlite = require('sqlite');

const DEFAULT_LENGTH = 5000;

class BmeCache {

  constructor() {
    this.db$ = sqlite.open('./bme2.db', { cached: true })
      .then(async db => {
        await db.run(`CREATE TABLE IF NOT EXISTS conditions (
          time        INTEGER NOT NULL,
          uptime      INTEGER NOT NULL,
          air         REAL    NOT NULL
        );`);

        await db.run('DROP INDEX IF EXISTS Idx1;');
        await db.run('CREATE INDEX IF NOT EXISTS ix_conditions_time_all ON conditions(time, uptime, air);');

        return db;
      });

    this.statement = this.db$.then(db => {
      return db.prepare('INSERT INTO conditions(time, uptime, air) values(?, ?, ?)');
    });
  }

  async write(array) {
    const statement = await this.statement;
    await statement.run(array);

    if (this.cache) {
      this.cache.unshift({
        time: array[0],
        uptime: array[1],
        air: array[4],
      });
      if (this.cache.length > DEFAULT_LENGTH) {
        this.cache.pop();
      }
    }
  }

  async read(length) {
    const db = await this.db$;
    if (length === DEFAULT_LENGTH || !length) {
      if (!this.cache) {
        this.cache = await db.all(`SELECT * FROM conditions ORDER BY time DESC limit ${DEFAULT_LENGTH}`);
      }
      return this.cache;
    }

    return db.all(`SELECT * FROM conditions ORDER BY time DESC limit ${length}`);
  }
}

module.exports = new BmeCache();
