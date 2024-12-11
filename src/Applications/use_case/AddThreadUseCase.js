const ThreadPayload = require('../../Domains/threads/entities/ThreadPayload');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ useCasePayload, credentialId, date }) {
    const threadPayload = new ThreadPayload(useCasePayload);

    return this._threadRepository.addThread({ threadPayload, credentialId, date });
  }
}

module.exports = AddThreadUseCase;
