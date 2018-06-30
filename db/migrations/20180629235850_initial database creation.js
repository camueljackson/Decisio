
exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.createTable('polls', function(table){
      table.increments();
      table.string('poll_url');
      table.string('poll_description');
      table.string('poll_name');
      table.string('creator_email');
    }),
    knex.schema.createTable('poll_options', function(table){
      table.increments();
      table.string('entry_name');
      table.integer('votes');
      table.integer('poll_id').unsigned();
      table.foreign('poll_id').references('polls.id');
    })
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
    knex.schema.dropTable('polls'),
    knex.schema.dropTable('poll_option')
  ])
};
