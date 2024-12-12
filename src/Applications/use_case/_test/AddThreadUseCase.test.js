const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadPayload = require('../../../Domains/threads/entities/ThreadPayload');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should oscestrate the add Thread action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();

    const credentialId = 'user-123';
    const useCasePayload = {
      title: 'Cool Dino Facts?',
      body: 'What is your favorite dinosaur and why?',
    };

    const mockThreadPayload = new ThreadPayload(useCasePayload);

    const date = 'fixed-date';

    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockImplementation(() => date);

    const id = 'thread-123';

    const mockThreadEntity = new ThreadEntity({
      id,
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: credentialId,
      date,
    });

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadResult = await addThreadUseCase.execute({ useCasePayload, credentialId });

    expect(threadResult).toStrictEqual({
      id,
      title: useCasePayload.title,
      owner: credentialId,
    });

    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      threadPayload: mockThreadPayload,
      credentialId,
      date,
    });

    jest.restoreAllMocks();
  });
});
