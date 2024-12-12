const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentPayload = require('../../../Domains/thread_comments/entities/ThreadCommentPayload');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadCommentEntity = require('../../../Domains/thread_comments/entities/ThreadCommentEntity');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThreadComment function', () => {
    it('should persist Thread Comment', async () => {
      const threadCommentPayload = new ThreadCommentPayload({
        content: 'Example thread comment',
      });

      const idNumber = '123';
      const fakeIdGenerator = () => idNumber;

      const credentialId = 'user-123';
      const threadId = 'thread-123';
      const date = 'fixed-date';

      const user = {
        id: credentialId,
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia',
      };

      const thread = {
        id: threadId,
        title: 'Thread Example',
        body: 'Thread body example',
        owner: credentialId,
        date,
      };

      await UsersTableTestHelper.addUser(user);
      await ThreadsTableTestHelper.addThread(thread);

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadCommentRepositoryPostgres
        .addThreadComment({
          threadCommentPayload, credentialId, threadId, date,
        });

      const threadComments = await ThreadCommentsTableTestHelper
        .findThreadCommentsById(`comment-${idNumber}`);

      expect(threadComments).toHaveLength(1);
    });

    it('should acquire a correct single Thread Comment', async () => {
      const threadCommentPayload = new ThreadCommentPayload({
        content: 'Example thread comment',
      });

      const idNumber = '123';
      const fakeIdGenerator = () => idNumber;

      const credentialId = 'user-123';
      const threadId = 'thread-123';
      const date = 'fixed-date';

      const user = {
        id: credentialId,
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia',
      };

      const thread = {
        id: threadId,
        title: 'Thread Example',
        body: 'Thread body example',
        owner: credentialId,
        date,
      };

      await UsersTableTestHelper.addUser(user);
      await ThreadsTableTestHelper.addThread(thread);

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const threadCommentEntity = await threadCommentRepositoryPostgres
        .addThreadComment({
          threadCommentPayload, credentialId, threadId, date,
        });

      expect(threadCommentEntity).toStrictEqual(new ThreadCommentEntity({
        id: `comment-${idNumber}`,
        content: threadCommentPayload.content,
        owner: user.id,
        thread: thread.id,
        date,
      }));
    });
  });

  describe('getThreadCommentsByThreadId function', () => {
    it('should return a correct value of Thread Comments', async () => {
      const idNumbers = ['123', '124'];
      const threadId = 'thread-123';
      const date = 'fixed-date';

      const usernameTemplate = (id) => `User ${id}`;
      const passwordTemplate = (id) => `abc${id}`;
      const fullnameTemplate = (id) => `The Legend: User ${id}`;
      const contentTemplate = (id) => `This comment no. ${id}`;

      const addThreadComments = idNumbers.map(async (idNumber, i) => {
        const userId = `user-${idNumber}`;
        const threadCommentId = `comment-${idNumber}`;

        const user = {
          id: userId,
          username: usernameTemplate(idNumber),
          password: passwordTemplate(idNumber),
          fullname: fullnameTemplate(idNumber),
        };

        await UsersTableTestHelper.addUser(user);

        if (i === 0) {
          const thread = {
            id: threadId,
            title: 'Thread example',
            body: 'Thread body example',
            owner: userId,
            date,
          };

          await ThreadsTableTestHelper.addThread(thread);
        }

        const threadComment = {
          id: threadCommentId,
          content: contentTemplate(idNumber),
          owner: userId,
          thread: threadId,
          date,
        };

        await ThreadCommentsTableTestHelper.addThreadComment(threadComment);
      });

      await Promise.all(addThreadComments);

      const runTest = idNumbers.map(async (idNumber, i) => {
        const fakeIdGenerator = () => idNumber;

        const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
          pool,
          fakeIdGenerator,
        );

        if (i === (idNumbers.length - 1)) {
          const threadCommentEntities = await threadCommentRepositoryPostgres
            .getThreadCommentsByThreadId(threadId);

          expect(threadCommentEntities).toHaveLength(idNumbers.length);

          threadCommentEntities.forEach((entity, j) => {
            expect(entity).toStrictEqual(new ThreadCommentEntity({
              id: `comment-${idNumbers[j]}`,
              content: contentTemplate(idNumbers[j]),
              owner: `user-${idNumbers[j]}`,
              thread: threadId,
              date,
            }));
          });
        }
      });

      await Promise.all(runTest);
    });
  });

  describe('softDeleteThreadComment function', () => {
    it('should change is_delete value of corresponding thread comment', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const threadCommentId = 'comment-123';

      const user = {
        id: userId,
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia',
      };

      const thread = {
        id: threadId,
        title: 'Thread Example',
        body: 'Thread body example',
        owner: userId,
      };

      const threadComment = {
        id: threadCommentId,
        content: 'Some thread comment',
        owner: userId,
        thread: threadId,
      };

      await UsersTableTestHelper.addUser(user);
      await ThreadsTableTestHelper.addThread(thread);
      await ThreadCommentsTableTestHelper.addThreadComment(threadComment);

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      await threadCommentRepositoryPostgres
        .softDeleteThreadComment(threadCommentId);

      const deletedThreadComment = await ThreadCommentsTableTestHelper
        .findThreadCommentsById(threadCommentId);

      const { is_delete: isDelete } = deletedThreadComment[0];

      expect(isDelete).toStrictEqual(true);
    });

    it('should throw NotFoundError when there is no such Thread Comment', async () => {
      const unavailableId = 'comment-321';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      expect(threadCommentRepositoryPostgres.softDeleteThreadComment(unavailableId))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadCommentOwnerById', () => {
    it('should return a correct comment owner', async () => {
      const commentId = 'comment-123';
      const threadId = 'thread-123';
      const credentialId = 'user-123';

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({ id: credentialId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: credentialId });
      await ThreadCommentsTableTestHelper
        .addThreadComment({ id: commentId, owner: credentialId, thread: threadId });

      const owner = await threadCommentRepositoryPostgres.getThreadCommentOwnerById(commentId);

      expect(owner).toEqual(credentialId);
    });
  });
});
