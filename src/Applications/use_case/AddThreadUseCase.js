const ThreadPayload = require('../../Domains/threads/entities/ThreadPayload');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const threadPayload = new ThreadPayload(useCasePayload);
    const date = new Date().toISOString();

    return this._threadRepository.addThread({ threadPayload, credentialId, date });
  }
}

module.exports = AddThreadUseCase;
