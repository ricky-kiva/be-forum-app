const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThread = this.postThread.bind(this);
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
}

module.exports = ThreadsHandler;
