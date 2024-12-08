const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository interface', () => {
  it('throws error when invoking abstract behavior', async () => {
    const threadCommentRepository = new ThreadCommentRepository();

    await expect(threadCommentRepository.addThreadComment({}))
      .rejects.toThrow('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadCommentRepository.deleteThreadComment(''))
      .rejects.toThrow('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
