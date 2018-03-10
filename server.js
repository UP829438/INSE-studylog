'use static';

const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const studylog = require('./sql-queries.js');
const GoogleAuth = require('simple-google-openid');


// you can put your client ID here
app.use(GoogleAuth('746020260242-u21lib7b97qo83m3j6joi0gi81re3t7d.apps.googleusercontent.com'));

// this will serve the HTML file shown below
app.use('/', express.static('src'));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server up listening on port ${PORT}!`);
});

app.get('/api/hello', async (req, res) => {
  res.send('Hello ' + (req.user.displayName || 'user without a name'));
  console.log('\x1b[36mSuccessful Authentication request by %s(%s)\x1b[0m',req.user.id,req.user.emails[0].value);
  //Check if existing user and add to database if not
  await studylog.checkUser(req.user.id);
});

app.post('/api/addunit', async (req, res) => {
  const userId = req.user.id;
  const unitName = req.query.unitname;
  //console.log(userId);
  //console.log(unitName);
  await studylog.addUnit(unitName, userId);
});