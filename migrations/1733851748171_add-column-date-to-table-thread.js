/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('threads', {
    date: {
      type: 'VARCHAR(24)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('threads', 'date');
};
