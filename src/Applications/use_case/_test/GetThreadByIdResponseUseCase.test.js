const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdResponseUseCase = require('../GetThreadByIdResponseUseCase');
const ThreadCommentEntity = require('../../../Domains/thread_comments/entities/ThreadCommentEntity');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('GetThreadByIdResponseUseCase', () => {
  it('should oscestrate get Thread by id action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    const idNumber1 = (123).toString();
    const idNumber2 = (idNumber1 + 1).toString();

    const threadId = `thread-${idNumber1}`;
    const title = 'Thread title';
    const body = 'Thread body';
    const credentialId = `user-${idNumber1}`;
    const date = 'fixed-date';

    const mockThreadEntity = new ThreadEntity({
      id: threadId,
      title,
      body,
      owner: credentialId,
      date,
    });

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    const userIdToUsername = {
      [`user-${idNumber1}`]: `user${idNumber1}`,
      [`user-${idNumber2}`]: `user${idNumber2}`,
    };

    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation((id) => Promise.resolve(userIdToUsername[id]));

    const isDelete = false;

    const commentPayloads = [
      {
        id: `comment-${idNumber1}`,
        content: `Thread body ${idNumber1}`,
        owner: credentialId,
        date,
      }, {
        id: `comment-${idNumber2}`,
        content: `Thread body ${idNumber2}`,
        owner: `user-${idNumber2}`,
        date,
      },
    ];

    const mockThreadCommentEntities = [
      new ThreadCommentEntity({
        ...commentPayloads[0],
        thread: threadId,
        isDelete,
      }),
      new ThreadCommentEntity({
        ...commentPayloads[1],
        thread: threadId,
        isDelete,
      }),
    ];

    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadCommentEntities));

    const getThreadByIdResponseUseCase = new GetThreadByIdResponseUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      userRepository: mockUserRepository,
    });

    const threadResult = await getThreadByIdResponseUseCase.execute(threadId);

    expect(threadResult).toStrictEqual({
      thread: {
        id: threadId,
        title,
        body,
        date,
        username: userIdToUsername[credentialId],
        comments: commentPayloads.map(({ owner, ...rest }) => ({
          ...rest,
          username: userIdToUsername[owner],
        })),
      },
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockUserRepository.getUsernameById).toHaveBeenCalledWith(credentialId);
    expect(mockThreadCommentRepository.getThreadCommentsByThreadId).toHaveBeenCalledWith(threadId);
  });
});
