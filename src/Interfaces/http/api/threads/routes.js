const routes = (h) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: h.postThread,
    options: { auth: 'forum_app_jwt' },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: h.getThreadById,
  },
]);

module.exports = routes;
