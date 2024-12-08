const ThreadEntity = require('../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(threadPayload, credentialId) {
    const { title, body } = threadPayload;
    const id = `thread-${this._idGenerator()}`;

    const q = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, owner',
      values: [id, title, body, credentialId],
    };

    const result = await this._pool.query(q);

    return new ThreadEntity({ ...result.rows[0] });
  }

  async verifyThreadExists(id) {
    const q = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(q);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
