class ThreadEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, owner, date,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
    this.date = date;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({
    id, title, body, owner, date,
  }) {
    if (!id || !title || !body || !owner || !date) {
      throw new Error('THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof owner !== 'string'
      || typeof date !== 'string') {
      throw new Error('THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadEntity;
