const ThreadCommentEntity = require('../ThreadCommentEntity');

describe('a ThreadCommentEntity entities', () => {
  it('throws an error when payload properties is incomplete', () => {
    const payload = {
      id: 'comment-123',
      content: 'Comment sample',
    };

    expect(() => new ThreadCommentEntity(payload)).toThrow('THREAD_COMMENT_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throws an error when payload did not meet specification', () => {
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123',
      threadId: 'thread-123',
    };

    expect(() => new ThreadCommentEntity(payload)).toThrow('THREAD_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
