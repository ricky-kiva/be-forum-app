const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should oscestrate the soft delete Thread action property', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    const credentialId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comment-123';

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

  it('shoud return Application Error if Thread Comment do not belong to logged user', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    const credentialId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'comment-123';

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

    const otherUser = 'user-321';

    expect(deleteThreadCommentUseCase.execute(otherUser, threadId, threadCommentId))
      .rejects.toThrowError('DELETE_THREAD_COMMENT_USE_CASE.COMMENT_DO_NOT_BELONG_TO_LOGGED_USER');
  });
});
