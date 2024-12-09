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

    const threadEntity = await addThreadUseCase.execute(req.payload, credentialId);

    const res = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: threadEntity.id,
          title: threadEntity.title,
          owner: threadEntity.owner,
        },
      },
    });

    res.code(201);

    return res;
  }

  async getThreadById(req, h) {
    const getThreadByIdResponseUseCase = this._container
      .getInstance(GetThreadByIdResponseUseCase.name);

    const { threadId } = req.params;

    const threadEntity = await getThreadByIdResponseUseCase.execute(threadId);

    // TODO: add date to response
    // TODO: add comments to response
    // TODO: convert user id to username in response

    return h.response({
      status: 'success',
      data: {
        thread: {
          id: threadEntity.id,
          title: threadEntity.title,
          body: threadEntity.body,
        },
      },
    });
  }
}

module.exports = ThreadsHandler;
