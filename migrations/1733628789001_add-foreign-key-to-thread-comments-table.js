/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'thread_comments',
    'fk_thread_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'thread_comments',
    'fk_thread_comments.thread_threads.id',
    'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comments', 'fk_thread_comments.owner_users.id');
  pgm.dropConstraint('thread_comments', 'fk_thread_comments.thread_threads.id');
};
