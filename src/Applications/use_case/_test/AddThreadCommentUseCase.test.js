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
    const date = 'fixed-date';

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const threadCommentId = 'comment-123';
    const isDelete = false;

    const mockThreadCommentEntity = new ThreadCommentEntity({
      id: threadCommentId,
      content: useCasePayload.content,
      owner: credentialId,
      thread: threadId,
      isDelete,
      date,
    });

    const mockThreadCommentPayload = new ThreadCommentPayload(useCasePayload);

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

    expect(threadCommentEntity).toStrictEqual(new ThreadCommentEntity({
      id: threadCommentId,
      content: useCasePayload.content,
      owner: credentialId,
      thread: threadId,
      isDelete,
      date,
    }));

    expect(mockThreadCommentRepository.addThreadComment)
      .toHaveBeenCalledWith({
        threadCommentPayload: mockThreadCommentPayload,
        credentialId,
        threadId,
        date,
      });
  });
});
