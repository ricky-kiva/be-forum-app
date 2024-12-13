class GetThreadByIdResponseUseCase {
  constructor({ threadRepository, threadCommentRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._userRepository = userRepository;
  }

  async execute(id) {
    const threadEntity = await this._threadRepository.getThreadById(id);
    const username = await this._userRepository.getUsernameById(threadEntity.owner);

    const propMappedThreadComments = await this._mapThreadCommentsProp(id);

    const assignThreadCommentsUsername = propMappedThreadComments.map(async (comment) => {
      const { owner, ...rest } = comment;
      const commentator = await this._userRepository.getUsernameById(owner);

      return {
        ...rest,
        username: commentator,
      };
    });

    const comments = await Promise.all(assignThreadCommentsUsername);

    return {
      thread: {
        id: threadEntity.id,
        title: threadEntity.title,
        body: threadEntity.body,
        date: threadEntity.date,
        username,
        comments,
      },
    };
  }

  async _mapThreadCommentsProp(threadId) {
    const threadCommentEntities = await this._threadCommentRepository
      .getThreadCommentsByThreadId(threadId);

    return threadCommentEntities.map((comment) => ({
      id: comment.id,
      content: comment.isDelete
        ? '**komentar telah dihapus**'
        : comment.content,
      owner: comment.owner,
      date: comment.date,
    }));
  }
}

module.exports = GetThreadByIdResponseUseCase;
