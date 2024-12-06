const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadPayload = require('../../../Domains/threads/entities/ThreadPayload');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should oscestrate the add Thread action correctly', async () => {
    const useCasePayload = {
      title: 'Cool Dino Facts?',
      body: 'What is your favorite dinosaur and why?',
    };

    const id = 'thread-123';
    const credentialId = 'user-123';

    const mockThreadEntity = new ThreadEntity({
      id,
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: credentialId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadEntity = await addThreadUseCase.execute(useCasePayload, credentialId);

    expect(threadEntity).toStrictEqual(mockThreadEntity);

    expect(mockThreadRepository.addThread)
      .toHaveBeenCalledWith(new ThreadPayload(useCasePayload), credentialId);
  });
});
