const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentPayload = require('../../../Domains/thread_comments/entities/ThreadCommentPayload');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

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
    it('should persist thread comment', async () => {
      const threadCommentPayload = new ThreadCommentPayload({
        content: 'Example thread comment',
      });

      const idNumber = '123';
      const fakeIdGenerator = () => idNumber;

      const userId = 'user-123';
      const threadId = 'thread-123';

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

      await UsersTableTestHelper.addUser(user);
      await ThreadsTableTestHelper.addThread(thread);

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadCommentRepositoryPostgres
        .addThreadComment(threadCommentPayload, userId, threadId);

      const threadComments = await ThreadCommentsTableTestHelper
        .findThreadCommentsById(`comment-${idNumber}`);

      expect(threadComments).toHaveLength(1);
    });
  });

  describe('softDeleteThreadComment function', () => {
    it('should change is_delete value of corresponding thread comment', async () => {
      const idNumber = '123';
      const fakeIdGenerator = () => idNumber;

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

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadCommentRepositoryPostgres
        .softDeleteThreadComment(`comment-${idNumber}`);

      const deletedThreadComment = await ThreadCommentsTableTestHelper
        .findThreadCommentsById(threadCommentId);

      const { is_delete: isDelete } = deletedThreadComment[0];

      expect(isDelete).toStrictEqual(true);
    });
  });
});
