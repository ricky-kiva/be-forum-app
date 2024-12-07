const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads');
  },
};

module.exports = ThreadTableTestHelper;
