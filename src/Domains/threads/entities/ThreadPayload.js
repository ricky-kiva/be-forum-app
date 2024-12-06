class ThreadPayload {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('THREAD_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('THREAD_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 255) {
      throw new Error('THREAD_PAYLOAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = ThreadPayload;
