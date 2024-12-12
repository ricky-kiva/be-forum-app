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
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.COMMENT_DO_NOT_BELONG_TO_LOGGED_USER');
    }

    return this._threadCommentRepository.softDeleteThreadComment(threadCommentId);
  }
}

module.exports = DeleteThreadCommentUseCase;
