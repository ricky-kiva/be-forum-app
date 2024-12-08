const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentEntity = require('../../Domains/thread_comments/entities/ThreadCommentEntity');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(threadCommentPayload, credentialId, threadId) {
    const { content } = threadCommentPayload;
    const id = `comment-${this._idGenerator()}`;

    const q = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, owner, thread',
      values: [id, content, credentialId, threadId],
    };

    const result = await this._pool.query(q);

    const { thread, ...rest } = result.rows[0];

    return new ThreadCommentEntity({
      ...rest,
      thread,
    });
  }

  async softDeleteThreadComment(id) {
    const q = {
      text: 'UPDATE thread_comments SET is_delete = $1 WHERE id = $2 RETURNING is_delete',
      values: [true, id],
    };

    const result = await this._pool.query(q);

    if (result.rows.length === 0 || !result.rows[0].is_delete) {
      throw new Error('proses delete thread comment gagal');
    }
  }

  async getThreadCommentOwner(id) {
    const q = {
      text: 'SELECT owner FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(q);

    if (!result.rows.length > 0) {
      throw new NotFoundError('thread comment tidak ditemukan');
    }

    return result.rows[0].owner;
  }
}

module.exports = ThreadCommentRepositoryPostgres;
