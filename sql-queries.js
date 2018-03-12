'use strict'

const mysql = require('mysql2/promise');
const config = require('./config.json');

var mysqlConn = null;
async function mysqlConnection() //Handles MySQL Database connections
{
  if (mysqlConn) //If a connection already exists
  {
    return mysqlConn; //Return the existing connection
  }
  else { //Else if no connection exists
    mysqlConn = newMysqlConnection(); //Make a new connection
    return mysqlConn; //Return the new connection
  }
}

async function newMysqlConnection() { //Creates a MySQL Database connection
  const newMysqlConn = await mysql.createConnection(config.mysql); //Create MySQL connection using the settings from the config
  return newMysqlConn; //Return the new connection
}

async function mysqlSelect(queryStr,queryVars){ //Runs MySQL Select Queries and returns results
  try {
  const sqlConnection = await mysqlConnection(); //get the connection
  const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
  let [results, fields] = await sqlConnection.execute(newQuery) //run query
  return results; //return results
  }
  catch (error){console.log("\x1b[31mSQL Failure:\n\x1b[37m%s\x1b[0m",error);} //catch SQL errors and print to console in colour
}

async function mysqlInsert(queryStr,queryVars){ //Runs MySQL Insert Queries and returns whether the query was successful
  try {
  const sqlConnection = await mysqlConnection(); //get the connection
  const newQuery = sqlConnection.format(queryStr,queryVars); //format the query to avoid SQL Injection
  await sqlConnection.query(newQuery) //run query
  return true; //return true as any errors would drop to the catch statement below
  }
  catch (error){
    console.log("\x1b[31mSQL Failure:\n\x1b[37m%s\x1b[0m",error); //catch SQL errors and print to console in colour
    return false; //return false as there was an SQL error
  }
}

async function checkUser(googleIdToken) { //Checks if a user is in the DB and if not adds them
  const Query = await mysqlSelect('SELECT ID FROM User WHERE googleToken = ?;',googleIdToken);
  if (Query){ //If the result is NOT undefined(no SQL errors) then continue
    if (Query==""){
      addUser(googleIdToken);
    }
    else {console.log('\x1b[33mUser (%s) Already exists.\x1b[0m',googleIdToken);}
  }

}

async function listUnits(userid) {
  const userQuery = await mysqlSelect('SELECT ID FROM User WHERE googleToken = ?;', userid); //gets correct user for use on Unit table
  console.log(userQuery[0].ID);
  const unitQuery = await mysqlSelect('SELECT name FROM Unit WHERE userID = ?;', userQuery[0].ID); // returns array of unit names
  return unitQuery;
}

async function addUser(userid) {
  const Query = await mysqlInsert('INSERT INTO User (googleToken) VALUES (?) ;', userid)
  if (Query){ //If Query was successfull (if is was not then error has already been printed to console)
    console.log('\x1b[33mAdded New User:\x1b[0m %s', userid);
  }
}

async function addUnit(unitName,unitColour,googleIdToken) {
  unitColour = '#' + unitColour;
  const Query = await mysqlInsert(
    'INSERT INTO Unit (userID,colour,name) VALUES ((SELECT ID FROM User WHERE googleToken = ?),?,?)',
    [googleIdToken,unitColour,unitName]
  );
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('\x1b[33mUser: %s Added a New Unit (%s,%s)\x1b[0m', googleIdToken,unitName, unitColour);
    return true; //return true so that client can know Unit was added successfully
  }
  else {return false;} //return false so client can know Unit wasn't added
}

//async function addScheduledDate(various){}

//async function addStudyHours(various){}

//async function addGrade(various){}

//async function editUnit(various){}

//async function editScheduledDate(various){}

//async function editStudyHours(various){}

//async function editGrade(various){}

//async function removeUnit(various){}

//async function removeScheduledDate(various){}

//async function removeStudyHours(various){}

//async function removeGrade(various){}

//async function removeUser(various){}


module.exports = {
  addUnit: addUnit,
  addUser: addUser,
  checkUser: checkUser,
  listUnits: listUnits
}
