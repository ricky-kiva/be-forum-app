const ThreadCommentPayload = require('../ThreadCommentPayload');

describe('a ThreadCommentPayload entities', () => {
  it('throws an error if property is incomplete', () => {
    const payload = {};
    expect(() => new ThreadCommentPayload(payload)).toThrow('THREAD_COMMENT_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throws an error if payload did not meet the specification', () => {
    const payload = { content: 123 };
    expect(() => new ThreadCommentPayload(payload)).toThrow('THREAD_COMMENT_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
