class GetThreadByIdResponseUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(id) {
    return this._threadRepository.getThreadById(id);
  }
}

module.exports = GetThreadByIdResponseUseCase;
