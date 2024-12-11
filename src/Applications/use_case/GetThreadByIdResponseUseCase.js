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

    return {
      thread: {
        id: threadEntity.id,
        title: threadEntity.title,
        body: threadEntity.body,
        date: threadEntity.date,
        owner: username,
        comments: threadCommentEntities,
      },
    };
  }
}

module.exports = GetThreadByIdResponseUseCase;
