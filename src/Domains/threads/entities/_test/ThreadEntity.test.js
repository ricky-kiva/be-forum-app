const ThreadEntity = require('../ThreadEntity');

describe('a ThreadEntity entities', () => {
  it('throws an error when given incomplete properties', () => {
    const payload = {
      id: 'abc',
      title: 'abc',
      body: 'abc',
    };

    expect(() => new ThreadEntity(payload)).toThrow('THREAD_ENTITY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throws an error when payload did not meet specification', () => {
    const payload = {
      id: 'abc',
      title: 123,
      body: 'abc',
      owner: 'abc',
      date: 'abc',
    };

    expect(() => new ThreadEntity(payload)).toThrow('THREAD_ENTITY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread Entity object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      owner: 'user-123',
      date: 'fixed-date',
    };

    const threadEntity = new ThreadEntity(payload);

    expect(threadEntity.id).toEqual(payload.id);
    expect(threadEntity.title).toEqual(payload.title);
    expect(threadEntity.body).toEqual(payload.body);
    expect(threadEntity.owner).toEqual(payload.owner);
    expect(threadEntity.date).toEqual(payload.date);
  });
});
