const ThreadCommentPayload = require('../../Domains/thread_comments/entities/ThreadCommentPayload');

class AddThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({
    useCasePayload, credentialId, threadId, date,
  }) {
    await this._threadRepository.verifyThreadExists(threadId);

    const threadCommentPayload = new ThreadCommentPayload(useCasePayload);

    return this._threadCommentRepository
      .addThreadComment({
        threadCommentPayload, credentialId, threadId, date,
      });
  }
}

module.exports = AddThreadCommentUseCase;
