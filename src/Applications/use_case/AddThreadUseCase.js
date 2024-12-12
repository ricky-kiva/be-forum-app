const ThreadPayload = require('../../Domains/threads/entities/ThreadPayload');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ useCasePayload, credentialId }) {
    const threadPayload = new ThreadPayload(useCasePayload);
    const date = new Date().toISOString();

    const threadEntity = await this._threadRepository
      .addThread({ threadPayload, credentialId, date });

    return {
      id: threadEntity.id,
      title: threadEntity.title,
      owner: threadEntity.owner,
    };
  }
}

module.exports = AddThreadUseCase;
