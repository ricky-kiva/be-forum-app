const ThreadCommentRepository = require('../../Domains/thread_comments/ThreadCommentRepository');
const ThreadCommentEntity = require('../../Domains/thread_comments/entities/ThreadCommentEntity');

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
}

module.exports = ThreadCommentRepositoryPostgres;
