const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdResponseUseCase = require('../GetThreadByIdResponseUseCase');
const ThreadCommentEntity = require('../../../Domains/thread_comments/entities/ThreadCommentEntity');

describe('GetThreadByIdResponseUseCase', () => {
  it('should oscestrate get Thread by id action correctly', async () => {
    const threadId = 'thread-123';

    const date = 'fixed-date';

    const mockThreadEntity = new ThreadEntity({
      id: threadId,
      title: 'Thread title',
      body: 'Thread body',
      owner: 'user-123',
      date,
    });

    const mockThreadCommentEntities = [
      new ThreadCommentEntity({
        id: 'comment-123',
        content: 'Thread body 123',
        owner: 'user-123',
        thread: threadId,
        date,
      }),
      new ThreadCommentEntity({
        id: 'comment-124',
        content: 'Thread body 124',
        owner: 'user-124',
        thread: threadId,
        date,
      }),
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadCommentEntities));

    const getThreadByIdResponseUseCase = new GetThreadByIdResponseUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    const threadEntity = await getThreadByIdResponseUseCase.execute(threadId);

    expect(threadEntity).toStrictEqual({
      thread: {
        id: mockThreadEntity.id,
        title: mockThreadEntity.title,
        body: mockThreadEntity.body,
        date: mockThreadEntity.date,
        comments: mockThreadCommentEntities,
      },
    });

    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(threadId);

    expect(mockThreadCommentRepository.getThreadCommentsByThreadId)
      .toHaveBeenCalledWith(threadId);
  });
});
