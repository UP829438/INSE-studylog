'use strict'

const mysql = require('mysql2/promise');
const config = require('./config.json');

async function checkUser(googleIdToken) { //Checks if a user is in the DB and if not adds them
  const sql = await init();
  sql.query(sql.format('SELECT ID FROM User WHERE googleCode = ?;',googleIdToken), function (error, results, fields) {
    if (results==""){
      console.log("Adding User: "+googleIdToken);
      addUser(googleIdToken);
    }
    else {console.log('User (%s) Already exists.',googleIdToken);}
    });
}

async function addUser(userid) {
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO User (googleCode) VALUES (?) ;', [userid])
  await sql.query(insertQuery);
  console.log('\x1b[33mAdded User:\x1b[0m%s', userid);
}


async function addUnit(unitname, userid) {
  const sql = await init();
  const insertQuery = sql.format('insert into Unit (userID,colour,name) values (?,?,?)', [1,"none",unitname]); //needs finishing
  await sql.query(insertQuery);
}

async function outputTest(){
  const sql = await init();
  //testitem = 
  sql.query('SELECT * FROM Unit;', function (error, results, fields) {
    console.log("THIS:::: "+results);
    results.forEach(function(element) {
      console.log(element);
    });
  });
  
  //const outputQuery = sql.format('SELECT * FROM Unit;', "nothing");
  //return [rows, fields] = await sql.execute(outputQuery);
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

  // Log errors
  sql.on('error', (err) => {
    console.error("SQL Studylog: "+err);
    sql.end();
  });

  return sql;
}

module.exports = {
  addUnit: addUnit,
  addUser: addUser,
  outputTest: outputTest,
  checkUser: checkUser
}
