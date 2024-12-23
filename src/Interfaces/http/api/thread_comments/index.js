const ThreadCommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'thread_comments',
  version: '1.0.0',
  register: async (server, { container }) => {
    const threadCommentsHandler = new ThreadCommentsHandler(container);

    server.route(routes(threadCommentsHandler));
  },
};
