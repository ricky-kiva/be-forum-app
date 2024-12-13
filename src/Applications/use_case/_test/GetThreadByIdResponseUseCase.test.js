const ThreadCommentRepository = require('../../../Domains/thread_comments/ThreadCommentRepository');
const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdResponseUseCase = require('../GetThreadByIdResponseUseCase');
const ThreadCommentEntity = require('../../../Domains/thread_comments/entities/ThreadCommentEntity');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('GetThreadByIdResponseUseCase', () => {
  describe('execute', () => {
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

      const getThreadByIdResponseUseCase = new GetThreadByIdResponseUseCase({
        threadRepository: mockThreadRepository,
        threadCommentRepository: mockThreadCommentRepository,
        userRepository: mockUserRepository,
      });

      getThreadByIdResponseUseCase._mapThreadCommentsProp = jest.fn()
        .mockImplementation(() => Promise.resolve(commentPayloads));

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
      expect(getThreadByIdResponseUseCase._mapThreadCommentsProp).toHaveBeenCalledWith(threadId);
    });
  });

  describe('_mapThreadCommentsProp', () => {
    it('should map Thread Comment Content prop. according to isDelete prop.', async () => {
      const mockThreadRepository = new ThreadRepository();
      const mockUserRepository = new UserRepository();
      const mockThreadCommentRepository = new ThreadCommentRepository();

      const idNumber = 123;
      const idNumbers = [idNumber.toString, (idNumber + 1).toString];

      const threadId = `thread-${idNumbers[0]}`;
      const credentialId = `user-${idNumbers[0]}`;
      const date = 'fixed-date';

      const commentPayloads = [
        {
          id: `comment-${idNumbers[0]}`,
          content: `Thread body ${idNumbers[0]}`,
          owner: credentialId,
          date,
        }, {
          id: `comment-${idNumbers[1]}`,
          content: `Thread body ${idNumbers[1]}`,
          owner: credentialId,
          date,
        },
      ];

      const isDeletes = [true, false];

      const mockThreadCommentEntities = [
        new ThreadCommentEntity({
          ...commentPayloads[0],
          thread: threadId,
          isDelete: isDeletes[0],
        }),
        new ThreadCommentEntity({
          ...commentPayloads[1],
          thread: threadId,
          isDelete: isDeletes[1],
        }),
      ];

      mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve(mockThreadCommentEntities));

      const getThreadByIdResponseUseCase = new GetThreadByIdResponseUseCase({
        threadRepository: mockThreadRepository,
        threadCommentRepository: mockThreadCommentRepository,
        userRepository: mockUserRepository,
      });

      const propFilteredThreadComments = await getThreadByIdResponseUseCase
        ._mapThreadCommentsProp(threadId);

      propFilteredThreadComments.forEach((comment, i) => {
        expect(comment).toStrictEqual({
          id: commentPayloads[i].id,
          content: isDeletes[i]
            ? '**komentar telah dihapus**'
            : commentPayloads[i].content,
          owner: commentPayloads[i].owner,
          date: commentPayloads[i].date,
        });
      });

      expect(mockThreadCommentRepository.getThreadCommentsByThreadId)
        .toHaveBeenCalledWith(threadId);
    });
  });
});
