class ThreadCommentPayload {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content } = payload;

    this.content = content;
  }

  // eslint-disable-next-line class-methods-use-this
  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('THREAD_COMMENT_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('THREAD_COMMENT_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadCommentPayload;
