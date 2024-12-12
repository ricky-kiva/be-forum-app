const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteThreadCommentUseCase {
  constructor({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(credentialId, threadId, threadCommentId) {
    await this._threadRepository.verifyThreadExists(threadId);

    const threadCommentOwner = await this._threadCommentRepository
      .getThreadCommentOwnerById(threadCommentId);

    if (threadCommentOwner !== credentialId) {
      throw new AuthorizationError('thread comment bukan milik pengguna yang sedang login');
    }

    return this._threadCommentRepository.softDeleteThreadComment(threadCommentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
