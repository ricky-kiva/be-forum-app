const ThreadPayload = require('../../Domains/threads/entities/ThreadPayload');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credentialId) {
    const threadPayload = new ThreadPayload(useCasePayload);

    return this._threadRepository.addThread(threadPayload, credentialId);
  }
}

module.exports = AddThreadUseCase;
