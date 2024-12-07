const routes = (h) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: h.postThread,
    options: { auth: 'forum_app_jwt' },
  },
]);

module.exports = routes;
