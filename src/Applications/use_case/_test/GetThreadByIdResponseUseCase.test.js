const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdResponseUseCase = require('../GetThreadByIdResponseUseCase');

describe('GetThreadByIdResponseUseCase', () => {
  it('should oscestrate get Thread by id action correctly', async () => {
    const threadId = 'thread-123';

    const mockThreadEntity = new ThreadEntity({
      id: threadId,
      title: 'Thread title',
      body: 'Thread body',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    const getThreadByIdResponseUseCase = new GetThreadByIdResponseUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadEntity = await getThreadByIdResponseUseCase.execute(threadId);

    expect(threadEntity).toStrictEqual(mockThreadEntity);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(threadId);
  });
});
