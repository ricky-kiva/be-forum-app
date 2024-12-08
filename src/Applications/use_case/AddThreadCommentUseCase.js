const ThreadCommentPayload = require('../../Domains/thread_comments/entities/ThreadCommentPayload');

class AddThreadCommentUseCase {
  constructor({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload, credentialId, threadId) {
    const threadCommentPayload = new ThreadCommentPayload(useCasePayload);

    return this._threadCommentRepository
      .addThreadComment(threadCommentPayload, credentialId, threadId);
  }
}

module.exports = AddThreadCommentUseCase;
