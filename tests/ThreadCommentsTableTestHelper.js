const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'comment-123',
    content = 'Some thread comment',
    owner = 'user-123',
    thread = 'thread-123',
    isDelete = false,
    date = 'fixed-date',
  }) {
    const q = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, thread, isDelete, date],
    };

    await pool.query(q);
  },
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
