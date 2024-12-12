const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentEntity = require('../../Domains/thread_comments/entities/ThreadCommentEntity');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment({
    threadCommentPayload, credentialId, threadId, date,
  }) {
    const { content } = threadCommentPayload;
    const id = `comment-${this._idGenerator()}`;

    const q = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, DEFAULT, $5) RETURNING id, content, owner, thread, date',
      values: [id, content, credentialId, threadId, date],
    };

    const result = await this._pool.query(q);

    const { thread: dbThreadId, ...rest } = result.rows[0];

    return new ThreadCommentEntity({
      ...rest,
      thread: dbThreadId,
    });
  }

  async getThreadCommentsByThreadId(threadId) {
    const q = {
      text: 'SELECT * FROM thread_comments WHERE thread = $1',
      values: [threadId],
    };

    const result = await this._pool.query(q);

    return result.rows.map((comment) => {
      const { is_delete: isDelete, content, ...rest } = comment;

      return new ThreadCommentEntity({
        ...rest,
        is_delete: isDelete,
        content: isDelete
          ? '**komentar telah dihapus**'
          : content,
      });
    });
  }

  async softDeleteThreadComment(id) {
    const q = {
      text: 'UPDATE thread_comments SET is_delete = $1 WHERE id = $2 RETURNING is_delete',
      values: [true, id],
    };

    const result = await this._pool.query(q);

    if (result.rows.length === 0) {
      throw new NotFoundError('thread comment tidak ditemukan');
    }
  }

  async getThreadCommentOwnerById(id) {
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
