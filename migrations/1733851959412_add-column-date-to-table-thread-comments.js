/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    date: {
      type: 'VARCHAR(24)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', 'date');
};
