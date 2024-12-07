const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comments');
  },
};

module.exports = ThreadCommentsTableTestHelper;
