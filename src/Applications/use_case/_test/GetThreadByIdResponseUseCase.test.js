const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdResponseUseCase = require('../GetThreadByIdResponseUseCase');
const ThreadCommentEntity = require('../../../Domains/thread_comments/entities/ThreadCommentEntity');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('GetThreadByIdResponseUseCase', () => {
  it('should oscestrate get Thread by id action correctly', async () => {
    const threadId = 'thread-123';
    const username = 'user123';
    const date = 'fixed-date';
    const credentialId = 'user-123';
    const isDelete = false;

    const mockThreadEntity = new ThreadEntity({
      id: threadId,
      title: 'Thread title',
      body: 'Thread body',
      owner: credentialId,
      date,
    });

    const mockThreadCommentEntities = [
      new ThreadCommentEntity({
        id: 'comment-123',
        content: 'Thread body 123',
        owner: credentialId,
        thread: threadId,
        isDelete,
        date,
      }),
      new ThreadCommentEntity({
        id: 'comment-124',
        content: 'Thread body 124',
        owner: 'user-124',
        thread: threadId,
        isDelete,
        date,
      }),
    ];

    const expectedComments = [
      {
        id: 'comment-123',
        content: 'Thread body 123',
        thread: threadId,
        date,
        username,
      },
      {
        id: 'comment-124',
        content: 'Thread body 124',
        thread: threadId,
        date,
        username,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve(username));

    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadCommentEntities));

    const getThreadByIdResponseUseCase = new GetThreadByIdResponseUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      userRepository: mockUserRepository,
    });

    const threadEntity = await getThreadByIdResponseUseCase.execute(threadId);

    expect(threadEntity).toStrictEqual({
      thread: {
        id: mockThreadEntity.id,
        title: mockThreadEntity.title,
        body: mockThreadEntity.body,
        date: mockThreadEntity.date,
        username,
        comments: expectedComments,
      },
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockUserRepository.getUsernameById).toHaveBeenCalledWith(credentialId);
    expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toHaveBeenCalledWith(threadId);
  });
});
