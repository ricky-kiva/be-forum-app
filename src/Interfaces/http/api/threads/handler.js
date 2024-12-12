const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdResponseUseCase = require('../../../../Applications/use_case/GetThreadByIdResponseUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThread = this.postThread.bind(this);
    this.getThreadById = this.getThreadById.bind(this);
  }

  async postThread(req, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = req.auth.credentials;

    const addedThread = await addThreadUseCase.execute({
      useCasePayload: req.payload,
      credentialId,
    });

    const res = h.response({
      status: 'success',
      data: { addedThread },
    });

    res.code(201);

    return res;
  }

  async getThreadById(req, h) {
    const getThreadByIdResponseUseCase = this._container
      .getInstance(GetThreadByIdResponseUseCase.name);

    const { threadId } = req.params;

    const thread = await getThreadByIdResponseUseCase.execute(threadId);

    return h.response({
      status: 'success',
      data: thread,
    });
  }
}

module.exports = ThreadsHandler;
