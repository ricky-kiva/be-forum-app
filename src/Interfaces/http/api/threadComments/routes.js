const routes = (h) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: h.postThreadComment,
    options: { auth: 'forum_app_jwt' },
  },
]);

module.exports = routes;
