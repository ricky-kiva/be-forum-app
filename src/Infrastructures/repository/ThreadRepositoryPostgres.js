const ThreadEntity = require('../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

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
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4)',
      values: [id, title, body, credentialId],
    };

    const result = await this._pool.query(q);

    return new ThreadEntity({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
