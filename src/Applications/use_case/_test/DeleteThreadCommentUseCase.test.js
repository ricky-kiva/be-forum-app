const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadUseCase', () => {
  it('should oscestrate the soft delete Thread action property', async () => {
    const credentialId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comment-123';

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadCommentRepository.getThreadCommentOwnerById = jest.fn()
      .mockImplementation(() => Promise.resolve(credentialId));

    mockThreadCommentRepository.softDeleteThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteThreadCommentUseCase.execute(credentialId, threadId, threadCommentId);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getThreadCommentOwnerById).toBeCalledWith(threadCommentId);
    expect(mockThreadCommentRepository.softDeleteThreadComment).toBeCalledWith(threadCommentId);
  });
});
