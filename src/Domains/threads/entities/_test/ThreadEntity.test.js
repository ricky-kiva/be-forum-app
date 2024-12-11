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
});
