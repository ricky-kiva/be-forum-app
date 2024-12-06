const ThreadPayload = require('../ThreadPayload');

describe('a ThreadPayload entities', () => {
  it('throws an error on incomplete properties', () => {
    const payload = { title: 'abc' };

    expect(() => new ThreadPayload(payload)).toThrow('THREAD_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('throws an error when payload did not meet specification', () => {
    const payload = { title: true, body: 'abc' };

    expect(() => new ThreadPayload(payload)).toThrow('THREAD_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('throws an error when title > 255 characters', () => {
    let title = '';
    for (let i = 0; i < 300; i += 1) {
      title += 'a';
    }

    const payload = { title, body: 'asd' };

    expect(() => new ThreadPayload(payload)).toThrow('THREAD_PAYLOAD.TITLE_LIMIT_CHAR');
  });
});
