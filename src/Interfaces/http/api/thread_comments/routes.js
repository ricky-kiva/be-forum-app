const routes = (h) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: h.postThreadComment,
    options: { auth: 'forum_app_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: h.softDeleteThreadComment,
    options: { auth: 'forum_app_jwt' },
  },
]);

module.exports = routes;
