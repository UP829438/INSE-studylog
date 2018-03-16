const sqlFunct = require('./sql-queries.js'); //import the file with the SQL functions as used on the server


//MUST BE RUN WITH AN EMPTY DATABASE TO WORK CORRECTLY
console.log("\nTest Cases for mySQL Functions\n");
//setTimeout(runTests(), 2000);


//Define test data



  //Valid hours are int 1-24
  var valid_hour = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]; 
  var invalid_hour = [0,-1,-5,-24,-25,25,30,100,'zero','five','ten','twenty',1.5,10.75,23.95,24.5];
  let noValidHourTestItems = valid_hour.length;
  let noInvalidHourTestItems = invalid_hour.length;


async function runTests() {
  //Run the test for checking and adding new users
  let userTests = await checkUserTest();
  //Run the tests for adding Units
  let unitTests = await addUnitTest();
  console.log("\n\x1b[37m---Testing Finished---\nTest Results:");
  console.log("checkUser() - Valid Inputs: "+userTests[0]+"% Successful");
  console.log("checkUser() - Invalid Inputs: "+userTests[1]+"% Successful");
  console.log("addunit() - Part 1 (Colours) - Valid Inputs: "+unitTests[0]+"% Successful");
  console.log("addunit() - Part 1 (Colours) - Invalid Inputs: "+unitTests[1]+"% Successful");
  console.log("addunit() - Part 2 (Names) - Valid Inputs: "+unitTests[2]+"% Successful");
  console.log("addunit() - Part 2 (Names) - Invalid Inputs: "+unitTests[3]+"% Successful");
}

async function checkUserTest() { //For testing the SQL checkUser Function
  //Define test data
  //Valid tokens are 21 char length
  var valid_googleToken = ['000000000000000000000','100000000000000000000','500000000000000000000','999999999999999999999']; 
  var invalid_googleToken = [0,500,-500,'million','100,000,000,000,000','averylongstringthatistoolong'];

  //count total test data items and number of passes
  let noValidTestItems = valid_googleToken.length;
  let noInvalidTestItems = invalid_googleToken.length;
  let noTest = 1; //counts the test number, starts at one
  let noTestsPassed = 0; //count tests that passed
  
  console.log("\x1b[33m----------------------------------------------");
  console.log("RUNNING test for Function: checkUser()");
  console.log("----------------------------------------------\x1b[0m");

  //Run tests using valid data
  console.log("\x1b[32m--VALID Inputs--\x1b[0m");
  for (let element of valid_googleToken) {
    process.stdout.write("\x1b[37m"+noTest+". Testing Value: "+element+"\x1b[35m Function Output: \x1b[0m");
    let passed = await sqlFunct.checkUser(element);
    if (passed) { //If true returned then test result as expected
      noTestsPassed+=1;
      console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");
    }
    else {console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");} //Test failed
    noTest+=1; //Iterate test number
  }
  let passPercentVCheckUser= (noTestsPassed == 0 ? "0" : noTestsPassed/noValidTestItems*100);
  console.log("\x1b[36m--VALID Inputs-- RESULTS: Tests Run: %s, Tests Passed: %s, Pass Rate: %s%\x1b[0m",noValidTestItems,noTestsPassed,passPercentVCheckUser);

  noTestsPassed = 0;
  noTest = 1;
  //Run tests using INvalid data
  console.log("\x1b[32m--INVALID Inputs--\x1b[0m");
  for (let element of invalid_googleToken) {
    process.stdout.write("\x1b[37m"+noTest+". Testing Value: "+element+"\x1b[35m Function Output: \x1b[0m");
    let passed = await sqlFunct.checkUser(element);
    if (!passed) { //If false returned then test result as expected
      noTestsPassed+=1;
      console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");
    }
    else {console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");} //Test failed
    noTest+=1; //Iterate test number
  }
  let passPercentIVCheckUser = (noTestsPassed == 0 ? "0" : noTestsPassed/noInvalidTestItems*100);
  console.log("\x1b[36m--INVALID Inputs-- RESULTS: Tests Run: %s, Tests Passed: %s, Pass Rate: %s%\x1b[0m",noInvalidTestItems,noTestsPassed,passPercentIVCheckUser);
  return [passPercentVCheckUser,passPercentIVCheckUser];
}

async function addUnitTest() { //For testing the SQL checkUser Function
  //Define test data

  var id_token = '999999999999999999999'; //Valid Token to use for all tests
  var name = 'INSE'; //Valid Name to use for colour tests
  var colour = '000000'; //Valid Colour to use for name tests

  //Valid colours are 6 char length
  var valid_colour = [123456,234567,345678,456789,567891,678912,789123,891234,912345,999999,'aaaaaa','qwerty','zzzzzz','000000','123456','999999']; 
  var invalid_colour = [0,12,123,1234,12345,000000,'0001','o','on','one','onet','onetw','onetwot','onetwoth','qwertyuiop'];

  //Valid unit names are 1-60 chars
  var valid_unitName = ['A','Z','a','z','INSE - Introduction to Software Engineering','BISS -Business Information Systems Security']; 
  var invalid_unitName = ['','abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz - abcdefghijklmnopqrstuvwxyz'];

  //count total test data items and number of passes
  let noValidColourTestItems = valid_colour.length;
  let noInvalidColourTestItems = invalid_colour.length;
  let noValidNameTestItems = valid_unitName.length;
  let noInvalidNameTestItems = invalid_unitName.length;
  
  let noTest = 1; //counts the test number, starts at one
  let noTestsPassed = 0; //count tests that passed
  
  console.log("\n\x1b[33m----------------------------------------------");
  console.log("RUNNING test for Function: addUnit()");
  console.log("----------------------------------------------\x1b[0m");

  //Run tests for unit colours using valid data
  console.log("\x1b[32m--VALID Inputs-- Part 1: Unit Colours\x1b[0m");
  for (let element of valid_colour) {
    process.stdout.write("\x1b[37m"+noTest+". Testing Value: "+element+"\x1b[35m Function Output: \x1b[0m");
    let passed = await sqlFunct.addUnit(name,element,id_token);
    if (passed) { //If true returned then test result as expected
      noTestsPassed+=1;
      console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");
    }
    else {console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");} //Test failed
    noTest+=1; //Iterate test number
  }
  let passPercentVUnitColour = (noTestsPassed == 0 ? "0" : noTestsPassed/noValidColourTestItems*100); //Percentage Pass Rate
  console.log("\x1b[36m--VALID Inputs-- RESULTS: Tests Run: %s, Tests Passed: %s, Pass Rate: %s%\x1b[0m",noValidColourTestItems,noTestsPassed,passPercentVUnitColour);

  noTestsPassed = 0; //Reset
  noTest = 1; //Reset

  //Run tests for unit colours using INvalid data
  console.log("\x1b[32m--INVALID Inputs-- Part 1: Unit Colours\x1b[0m");
  for (let element of invalid_colour) {
    process.stdout.write("\x1b[37m"+noTest+". Testing Value: "+element+"\x1b[35m Function Output: \x1b[0m");
    let passed = await sqlFunct.addUnit(name,element,id_token);
    if (!passed) { //If false returned then test result as expected
      noTestsPassed+=1;
      console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");
    }
    else {console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");} //Test failed
    noTest+=1; //Iterate test number
  }
  let passPercentIVUnitColour = (noTestsPassed == 0 ? "0" : noTestsPassed/noInvalidColourTestItems*100); //Percentage Pass Rate
  console.log("\x1b[36m--INVALID Inputs-- RESULTS: Tests Run: %s, Tests Passed: %s, Pass Rate: %s%\x1b[0m",noInvalidColourTestItems,noTestsPassed,passPercentIVUnitColour);


  noTestsPassed = 0; //Reset
  noTest = 1; //Reset


  //Run tests for unit names using valid data
  console.log("\x1b[32m--VALID Inputs-- Part 2: Unit Names\x1b[0m");
  for (let element of valid_unitName) {
    process.stdout.write("\x1b[37m"+noTest+". Testing Value: "+element+"\x1b[35m Function Output: \x1b[0m");
    let passed = await sqlFunct.addUnit(element,colour,id_token);
    if (passed) { //If true returned then test result as expected
      noTestsPassed+=1;
      console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");
    }
    else {console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");} //Test failed
    noTest+=1; //Iterate test number
  }
  let passPercentVUnitNames = (noTestsPassed == 0 ? "0" : noTestsPassed/noValidNameTestItems*100); //Percentage Pass Rate
  console.log("\x1b[36m--VALID Inputs-- RESULTS: Tests Run: %s, Tests Passed: %s, Pass Rate: %s%\x1b[0m",noValidNameTestItems,noTestsPassed,passPercentVUnitNames);

  noTestsPassed = 0; //Reset
  noTest = 1; //Reset

  //Run tests for unit names using INvalid data
  console.log("\x1b[32m--INVALID Inputs-- Part 2: Unit Names\x1b[0m");
  for (let element of invalid_unitName) {
    process.stdout.write("\x1b[37m"+noTest+". Testing Value: "+element+"\x1b[35m Function Output: \x1b[0m");
    let passed = await sqlFunct.addUnit(element,colour,id_token);
    if (!passed) { //If false returned then test result as expected
      noTestsPassed+=1;
      console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");
    }
    else {console.log("\x1b[37m"+noTest+". \x1b[32mPassed\x1b[0m");} //Test failed
    noTest+=1; //Iterate test number
  }
  let passPercentIVUnitNames = (noTestsPassed == 0 ? "0" : noTestsPassed/noInvalidNameTestItems*100); //Percentage Pass Rate
  console.log("\x1b[36m--INVALID Inputs-- RESULTS: Tests Run: %s, Tests Passed: %s, Pass Rate: %s%\x1b[0m",noInvalidNameTestItems,noTestsPassed,passPercentIVUnitNames);
  return [passPercentVUnitColour,passPercentIVUnitColour,passPercentVUnitNames,passPercentIVUnitNames];
}

runTests().then(function (){ //On compleating print exit message
  console.log("\n\x1b[37m---End Testing---\x1b[0m")
  process.exit();
});