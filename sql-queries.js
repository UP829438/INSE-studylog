'use strict'

const mysql = require('mysql2/promise');
const config = require('./config.json');

async function addUser(userid) {
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO User (googleCode) VALUES (?) ;', [userid])
  await sql.query(insertQuery);
}


async function addUnit(unitname, userid) {
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO Unit SET ? ;', {unitname, userid});
  await sql.query(insertQuery);
}

async function getAllUnits(userid){
  const sql = await init();
  const outputQuery = sql.format('SELECT * FROM `Unit` WHERE `unitname` = ? ;', {userid});
  return [rows, fields] = await sql.execute(outputQuery);
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
  addUser: addUser,
  getAllUnits: getAllUnits
}
