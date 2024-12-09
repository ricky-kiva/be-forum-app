const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('throws error when invoking abstract behavior', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({}))
      .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.verifyThreadExists(''))
      .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(threadRepository.getThreadById(''))
      .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
