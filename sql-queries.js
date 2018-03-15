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
  catch (error){
    console.log("\x1b[31mSQL Failure:\n\x1b[37m%s\x1b[0m",error);//catch SQL errors and print to console in colour
    return null; //return null as an SQL error was encountered trying to select
  }
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

async function addUser(googleIdToken) {
  const Query = await mysqlInsert('INSERT INTO User (googleToken) VALUES (?) ;', googleIdToken)
  if (Query){ //If Query was successfull (if is was not then error has already been printed to console)
    console.log('\x1b[33mAdded New User:\x1b[0m %s', googleIdToken);
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

async function addScheduledDate(unitID,dateTitle,dateDesc,dateTime){
  const Query = await mysqlInsert(
    'INSERT INTO ScheduledDate (unitID,title,description,time) VALUES (?,?,?,?)',
    [unitID,dateTitle,dateDesc,dateTime]
  );
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('\x1b[33mA User Added Added a New Scheduled Date (%s,%s)\x1b[0m', dateTitle,dateTime);
    return true; //return true so that client can know Date was added successfully
  }
  else {return false;} //return false so client can know Date wasn't added
}

async function addStudyHours(unitID,studyHrs,studyHrsDay){
  console.log(unitID);
  const Query = await mysqlSelect('UPDATE Unit SET hours = hours + ? WHERE name = ?', [studyHrs, unitID]);
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('\x1b[33mA User Added a New Study Hours (%s,%s)\x1b[0m', studyHrs,studyHrsDay);
    return true; //return true so that client can know Study Hours were added successfully
  }
  else {return false;} //return false so client can know Study Hours weren't added
}

async function addGrade(unitID,gradeTitle,gradeScore,gradeTime){
  const Query = await mysqlInsert(
    'INSERT INTO Grade (unitID,title,score,time) VALUES (?,?,?,?)',
    [unitID,studyHrs,studyHrsDay]
  );
  if (Query){ //If Query was successfull (if not then error has already been printed to console)
    console.log('\x1b[33mA User Added a New Grade (%s,%s)\x1b[0m', gradeTitle,gradeScore);
    return true; //return true so that client can know Grade was added successfully
  }
  else {return false;} //return false so client can know Grade wasn't added
}

async function getUnits(googleIdToken) { // returns array of all Unit Names for that User
  return await mysqlSelect('SELECT ID,name,colour,hours FROM Unit WHERE userID = (SELECT ID FROM User WHERE googleToken = ?);', googleIdToken);
}

async function getUnit(unitID){ // returns array of all details for that unit
  return await mysqlSelect('SELECT colour,credits,name FROM Unit WHERE ID = ?;', unitID);
}

async function getScheduledDates(unitID) { // returns array of all Scheduled Dates in that Unit
  return await mysqlSelect('SELECT ID,title,description,time FROM ScheduledDate WHERE unitID = ?;', unitID);
}

async function getStudyHours(unitID) { // returns total overall study hours recorded for that Unit
  return await mysqlSelect('SELECT SUM(hours) FROM StudyHours WHERE unitID = ?;', unitID);
}

async function getStudyHourDetails(unitID) { // returns array of all details of study hours on that Unit
  return await mysqlSelect('SELECT hours,date FROM StudyHours WHERE unitID = ?;', unitID);
}

async function getGrades(unitID){ // returns array of all Grades recorded on that unit
  return await mysqlSelect('SELECT title,score,time FROM Grade WHERE unitID = ?;', unitID);
}

async function getGraphData(graphType,googleIdToken,dateFrom,unitID) { // returns array of data to be used for populating graphs
  if (graphType.toLowerCase()=="bar") {
      const data = await mysqlSelect(
          'SELECT name,colour,SUM(hours) as hours FROM Unit INNER JOIN StudyHours on StudyHours.unitID = Unit.ID WHERE date > DATE_SUB(?, INTERVAL 1 DAY) AND userID = (SELECT ID FROM User WHERE googleToken = ?) GROUP BY name;',
          [dateFrom,googleIdToken]);
      return data;
  }
  else if (graphType.toLowerCase()=="graph") {
      const data = await mysqlSelect(
          'SELECT hours,date FROM StudyHours WHERE date > DATE_SUB(?, INTERVAL 1 DAY) AND unitID = ? GROUP BY date ASC;',
          [dateFrom,unitID]);
      return data;
  }
  else {
      throw Error("No such graph type as %s",graphType);
  }
}

//async function editUnit(various){}

//async function editScheduledDate(various){}

//async function editStudyHours(various){}

//async function editGrade(various){}

async function removeUnit(unitID,googleIdToken){ // remove the unit with that ID
  return await mysqlInsert('DELETE From Unit WHERE ID = ? AND userID = (SELECT ID FROM User WHERE googleToken = ?);', [unitID,googleIdToken]);
}
//async function removeScheduledDate(various){}

//async function removeStudyHours(various){}

//async function removeGrade(various){}

//async function removeUser(various){}


module.exports = {
  checkUser: checkUser,
  addUser: addUser,
  addUnit: addUnit,
  addScheduledDate: addScheduledDate,
  addStudyHours: addStudyHours,
  addGrade: addGrade,

  getUnits: getUnits,
  getUnit: getUnit,
  getScheduledDates: getScheduledDates,
  getStudyHours: getStudyHours,
  getStudyHourDetails: getStudyHourDetails,
  getGrades: getGrades,
  getGraphData: getGraphData,

  removeUnit: removeUnit,
}
