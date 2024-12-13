const ThreadCommentEntity = require('../../../Domains/thread_comments/entities/ThreadCommentEntity');
const ThreadCommentPayload = require('../../../Domains/thread_comments/entities/ThreadCommentPayload');
const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  it('should oscestrate the add Thread Comment action correctly', async () => {
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();

    const useCasePayload = {
      content: 'Some comment',
    };

    const credentialId = 'user-123';
    const threadId = 'thread-123';

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const mockThreadCommentPayload = new ThreadCommentPayload(useCasePayload);

    const threadCommentId = 'comment-123';
    const isDelete = false;
    const date = 'fixed-date';

    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockImplementation(() => date);

    const mockThreadCommentEntity = new ThreadCommentEntity({
      id: threadCommentId,
      content: useCasePayload.content,
      owner: credentialId,
      thread: threadId,
      isDelete,
      date,
    });

    mockThreadCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadCommentEntity));

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const threadCommentEntity = await addThreadCommentUseCase.execute({
      useCasePayload,
      credentialId,
      threadId,
      date,
    });

    expect(threadCommentEntity).toStrictEqual({
      id: threadCommentId,
      content: useCasePayload.content,
      owner: credentialId,
    });

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockThreadCommentRepository.addThreadComment).toHaveBeenCalledWith({
      threadCommentPayload: mockThreadCommentPayload,
      credentialId,
      threadId,
      date,
    });

    jest.restoreAllMocks();
  });
});
