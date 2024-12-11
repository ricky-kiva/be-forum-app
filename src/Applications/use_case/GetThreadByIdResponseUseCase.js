class GetThreadByIdResponseUseCase {
  constructor({ threadRepository, threadCommentRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._userRepository = userRepository;
  }

  async execute(id) {
    const threadEntity = await this._threadRepository.getThreadById(id);
    const username = await this._userRepository.getUsernameById(threadEntity.owner);
    const threadCommentEntities = await this._threadCommentRepository
      .getThreadCommentsByThreadId(id);

    const assignThreadCommentsUsername = threadCommentEntities.map(async (comment) => {
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
}

module.exports = GetThreadByIdResponseUseCase;
