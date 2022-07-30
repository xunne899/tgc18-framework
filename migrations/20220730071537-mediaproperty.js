'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return  db.createTable('mediaproperty',{
      id: { type: 'int', unsigned: true, primaryKey:true, autoIncrement:true},
      name: { type: 'string', length:100},
      description:'text',
      URL : 'text'
  })
};

exports.down = function(db) {
 return db.dropTable('mediaproperty')
};

exports._meta = {
  "version": 1
};
