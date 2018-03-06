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

app.get('/api/hello', (req, res) => {
  res.send('Hello ' + (req.user.displayName || 'user without a name') + '!');
  console.log('successful authenticated request by ' + req.user.emails[0].value);
});

app.post('/api/add', async (req, res) => {
  const userId = req.user.id;
  const unitName = req.query.unitname;
  console.log(userId);
  console.log(unitName);
  await studylog.addUnit(unitName, userId);
});
