class ThreadCommentEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, owner, thread, date,
    } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
    this.thread = thread;
    this.date = date;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({
    id, content, owner, thread, date,
  }) {
    if (!id || !content || !owner || !thread || !date) {
      throw new Error('THREAD_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof content !== 'string'
      || typeof owner !== 'string'
      || typeof thread !== 'string'
      || typeof date !== 'string') {
      throw new Error('THREAD_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadCommentEntity;
