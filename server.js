'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const studylog = require('./sql-queries.js');
const GoogleAuth = require('simple-google-openid');


// GoogleAuth client ID
app.use(GoogleAuth('746020260242-u21lib7b97qo83m3j6joi0gi81re3t7d.apps.googleusercontent.com'));

// Use express to serve files (webserver)
app.use('/', express.static('src'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started, Listening on port ${PORT}`);
});

//API functions

app.post('/api/addgrade', addGrade);
app.get('/api/hello', userAuth);
app.get('/api/getunits', getUnits);
app.post('/api/addunit', addUnit);
app.post('/api/addscheduleddate', addScheduleDate);
app.post('/api/submithours', submitHours);
app.get('/api/getunit', getUnit);
app.get('/api/getScheduledDates', getScheduledDates);
app.get('/api/getstudyhours', getStudyHours);
app.get('/api/getstudyhoursdetails', getStudyHourDetails);
app.get('/api/getgrades', getGrades);
app.get('/api/getgraphdata', getGraphData);
app.delete('/api/removeunit', removeUnit);

//Server Functions

async function userAuth(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    res.send('Hello ' + (req.user.displayName || 'user without a name'));
    console.log('\x1b[36mSuccessful Authentication request by %s(%s)\x1b[0m',req.user.id,req.user.emails[0].value);
    //Check if existing user and add to database if not
    await studylog.checkUser(req.user.id);
  }
  catch (error) {
    console.log("\x1b[31mAPI (Hello) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getUnits(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const userId = req.user.id;
    const units = await studylog.getUnits(userId);
    res.send(units);
  }
  catch (error) {
    console.log("\x1b[31mAPI (ListUnits) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
    }
}

async function addUnit(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const userId = req.user.id; //GoogleAuth ID
    const unitName = req.query.unitname; //Name of new unit
    const unitColour = req.query.unitcolour; // colour to be associated
    const addStatus = await studylog.addUnit(unitName, unitColour, userId); //Add the Unit to the database
    res.send(addStatus); //return to the client whether the Unit was added or not
  }
  catch (error) {
    console.log("\x1b[31mAPI (AddUnit) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function addScheduleDate(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid; //Id of Unit
    const dateTitle = req.query.title; // title of the event
    const dateDesc = req.query.desc; // description of the event
    const dateTime = req.query.dateTime; // DATETIME of the event
    const addStatus = await studylog.addScheduledDate(unitID,dateTitle,dateDesc,dateTime); //Add the Scheduled Date to the database
    res.send(addStatus); //return to the client whether the Scheduled Date was added or not
  }
  catch (error) {
    console.log("\x1b[31mAPI (AddScheduledDate) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function submitHours(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.name; //Id of Unit
    const studyHrs = req.query.unithours; // number of hours studied
    const studyHrsDay = req.query.unitday; // day on which hours studied on
    const addStatus = await studylog.addStudyHours(unitID,studyHrs,studyHrsDay); //Add the Studied Hours to the database
    res.send(addStatus); //return to the client whether the Studied Hours was added or not
  }
  catch (error) {
    console.log("\x1b[31mAPI (AddStudyHours) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function addGrade(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid; //Id of Unit
    const gradeTitle = req.query.title; // Name of the grade eg. Submission 1
    const gradeScore = req.query.score; // score 0-100
    const gradeTime = req.query.dateTime; // time when grade was gained
    const addStatus = await studylog.addGrade(unitID,gradeTitle,gradeScore,gradeTime); //Add the Grade to the database
    res.send(addStatus); //return to the client whether the Grade was added or not
  }
  catch (error) {
    console.log("\x1b[31mAPI (AddGrade) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getUnit(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid;
    const unit = await studylog.getUnit(unitID);
    res.send(unit);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetUnit) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getScheduledDates(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid;
    const dates = await studylog.getScheduledDates(unitID);
    res.send(dates);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetScheduledDates) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getStudyHours(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid;
    const hoursTotal = await studylog.getStudyHours(unitID);
    res.send(hoursTotal);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetStudyHours) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getStudyHourDetails(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid;
    const studyHours = await studylog.getStudyHourDetails(unitID);
    res.send(studyHours);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetStudyHourDetails) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getGrades(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid;
    const grades = await studylog.getGrades(unitID);
    res.send(grades);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetGrades) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}

async function getGraphData(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid; //Id of the unit to get the study hours for
    const dateFrom = req.query.date; //Study hours will be returned from days after this Date
    const graphData = await studylog.getGraphData("graph",null,dateFrom,unitID);
    res.send(graphData);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetGraphData) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
};
app.get('/ap/getbarchartdata', getBarChartData)
async function getBarChartData(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const userId = req.user.id; //GoogleAuth ID
    const dateFrom = req.query.date; //Study hour will be returned from days after this Date
    const grades = await studylog.getGraphData("bar",userId,dateFrom,null);
    res.send(grades);
  }
  catch (error) {
    console.log("\x1b[31mAPI (GetBarchartData) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
};

async function removeUnit(req, res) {
  try { //If user has no id (not signed in) error will be thrown
    const unitID = req.query.unitid; //Id of Unit
    const removeStatus = await studylog.removeUnit(unitID);
    res.send(removeStatus); //return to the client whether sql successful or not
  }
  catch (error) {
    console.log("\x1b[31mAPI (RemoveUnit) Error: \x1b[37m%s\x1b[0m",error);
    res.send("Server Error: Please log in again");
  }
}
