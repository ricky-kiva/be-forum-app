class GetThreadByIdResponseUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(id) {
    const threadEntity = await this._threadRepository.getThreadById(id);
    const threadCommentEntities = await this._threadCommentRepository
      .getThreadCommentsByThreadId(id);

    return {
      thread: {
        id: threadEntity.id,
        title: threadEntity.title,
        body: threadEntity.body,
        date: threadEntity.date,
        comments: threadCommentEntities,
      },
    };
  }
}

module.exports = GetThreadByIdResponseUseCase;
