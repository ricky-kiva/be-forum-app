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

  it('should create Thread Comment Payload object correctly', () => {
    const payload = { content: 'Thread comment content' };

    const threadCommentPayload = new ThreadCommentPayload(payload);

    expect(threadCommentPayload.content).toEqual(payload.content);
  });
});
