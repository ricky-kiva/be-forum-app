const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadCommentsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadComment = this.postThreadComment.bind(this);
    this.softDeleteThreadComment = this.softDeleteThreadComment.bind(this);
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

  async softDeleteThreadComment(req, h) {
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);

    const { id: credentialId } = req.auth.credentials;
    const { threadId, commentId: threadCommentId } = req.params;

    await deleteThreadCommentUseCase.execute(credentialId, threadId, threadCommentId);

    const res = h.response({
      status: 'success',
    });

    res.code(200);

    return res;
  }
}

module.exports = ThreadCommentsHandler;
