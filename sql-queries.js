'use strict'

const mysql = require('mysql2/promise');
const config = require('./config.json');

async function addUser(userid) {
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO User (googleCode) VALUES ("test") ;', {userid}); //This line is broken curerently - fix query
  await sql.query(insertQuery);
}


async function addUnit(unitname, userid) {
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO Unit SET ? ;', {unitname, userid});
  await sql.query(insertQuery);
}

let sqlPromise = null;

async function init() {
  if (sqlPromise) return sqlPromise;

  sqlPromise = newConnection();
  return sqlPromise;
}

async function newConnection() {
  const sql = await mysql.createConnection(config.mysql);

  // handle unexpected errors by just logging them
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });

  return sql;
}

module.exports = {
  addUnit: addUnit,
  addUser: addUser
}
