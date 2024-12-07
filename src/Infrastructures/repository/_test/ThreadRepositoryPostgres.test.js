const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadPayload = require('../../../Domains/threads/entities/ThreadPayload');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadEntity = require('../../../Domains/threads/entities/ThreadEntity');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
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

      const threadEntity = await threadRepositoryPostgres.addThread(threadPayload, registerUser.id);

      expect(threadEntity).toStrictEqual(new ThreadEntity({
        id: `thread-${threadId}`,
        title: threadPayload.title,
        body: threadPayload.body,
        owner: registerUser.id,
      }));
    });
  });
});
