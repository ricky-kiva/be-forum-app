const ThreadCommentPayload = require('../../Domains/thread_comments/entities/ThreadCommentPayload');

class AddThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({
    useCasePayload, credentialId, threadId,
  }) {
    await this._threadRepository.verifyThreadExists(threadId);

    const threadCommentPayload = new ThreadCommentPayload(useCasePayload);
    const date = new Date().toISOString();

    const threadCommentEntity = await this._threadCommentRepository
      .addThreadComment({
        threadCommentPayload,
        credentialId,
        threadId,
        date,
      });

    return {
      id: threadCommentEntity.id,
      content: threadCommentEntity.content,
      owner: threadCommentEntity.owner,
    };
  }
}

module.exports = AddThreadCommentUseCase;
