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
      thread: 'thread-123',
      isDelete: false,
      date: 'fixed-date',
    };

    expect(() => new ThreadCommentEntity(payload)).toThrow('THREAD_COMMENT_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread Comment Entity object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'Thread comment content',
      owner: 'user-123',
      thread: 'thread-123',
      isDelete: false,
      date: 'fixed-date',
    };

    const threadCommentEntity = new ThreadCommentEntity(payload);

    expect(threadCommentEntity.id).toEqual(payload.id);
    expect(threadCommentEntity.content).toEqual(payload.content);
    expect(threadCommentEntity.owner).toEqual(payload.owner);
    expect(threadCommentEntity.thread).toEqual(payload.thread);
    expect(threadCommentEntity.isDelete).toEqual(payload.isDelete);
    expect(threadCommentEntity.date).toEqual(payload.date);
  });
});
