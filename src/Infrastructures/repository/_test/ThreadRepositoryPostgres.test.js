const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadPayload = require('../../../Domains/threads/entities/ThreadPayload');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist created thread', async () => {
      const threadPayload = new ThreadPayload({
        title: 'Example title',
        body: 'Example thread body',
      });

      const registerUser = {
        id: 'user-123',
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia',
      };

      await UsersTableTestHelper.addUser(registerUser);

      const threadId = '123';
      const fakeIdGenerator = () => threadId;

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const date = 'fixed-date';

      const threadEntity = await threadRepositoryPostgres.addThread({
        threadPayload,
        credentialId: registerUser.id,
        date,
      });

      expect(threadEntity).toStrictEqual(new ThreadEntity({
        id: `thread-${threadId}`,
        title: threadPayload.title,
        body: threadPayload.body,
        owner: registerUser.id,
        date,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should acquire a correct single Thread', async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';

      const fakeIdGenerator = () => threadId;

      const registerUser = {
        id: userId,
        username: 'komodo',
        password: 'secret',
        fullname: 'Komodo Indonesia',
      };

      const thread = {
        id: threadId,
        title: 'Thread Title',
        body: 'Thread body',
        owner: userId,
        date: 'fixed-date',
      };

      await UsersTableTestHelper.addUser(registerUser);
      await ThreadsTableTestHelper.addThread(thread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const threadEntity = await threadRepositoryPostgres.getThreadById(threadId);

      expect(threadEntity).toStrictEqual(new ThreadEntity(thread));
    });
  });
});
