const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadComment = this.postThreadComment.bind(this);
  }

  async postThreadComment(req, h) {
    const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);

    const { id: credentialId } = req.auth.credentials;
    const { threadId } = req.params;

    const threadCommentEntity = await addThreadCommentUseCase
      .execute(req.payload, credentialId, threadId);

    const res = h.response({
      status: 'success',
      data: {
        addedComment: {
          id: threadCommentEntity.id,
          content: threadCommentEntity.content,
          owner: threadCommentEntity.owner,
        },
      },
    });

    res.code(201);

    return res;
  }
}

module.exports = ThreadCommentsHandler;
