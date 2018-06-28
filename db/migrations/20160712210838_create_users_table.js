exports.up = function(knex, Promise) {
    return Promise.all([
    knex.schema.createTable('users', function(table){
      table.increments();
      table.string('cookie_id');
      table.string('username');
      table.string('email');
      table.string('password');
    }),
    knex.schema.createTable('polls', function(table){
      table.increments();
      table.string('poll_name');
      table.string('poll_description');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
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
    knex.schema.dropTable('users', function(table){}),
    knex.schema.dropTable('polls', function(table){}),
    knex.schema.dropTable('poll_options', function(table){})
  ])
};

