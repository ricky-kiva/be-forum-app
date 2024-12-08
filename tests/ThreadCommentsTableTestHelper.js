const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async findThreadCommentsById(id) {
    const q = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(q);

    return result.rows;
  },
  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comments');
  },
};

module.exports = ThreadCommentsTableTestHelper;
