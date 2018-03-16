 //                          _         _         _   _       _____                 _   _
 //   __ _  ___   ___   __ _| | ___   / \  _   _| |_| |__   |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 //  / _` |/ _ \ / _ \ / _` | |/ _ \ / _ \| | | | __| '_ \  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // | (_| | (_) | (_) | (_| | |  __// ___ \ |_| | |_| | | | |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 //  \__, |\___/ \___/ \__, |_|\___/_/   \_\__,_|\__|_| |_| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //  |___/             |___/
 //

//GLOBAL VARIABLES
let unit;

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let graphChoice = 0;
let currentWeek = "one";
let weekName = ""
let userData = {
  userID: "",
  units: []}
const weekData = {
    weekName: "one",
    weeks: [
      {
        name: "weekDate1",
        colour: "#4286f4",
        hours: 8
      },
      {
        name: "weekDate2",
        colour: "#dc37f2",
        hours: 20
      },
      {
        name: "weekDate3",
        colour: "#d61326",
        hours: 19
      },
      {
        name: "weekDate4",
        colour: "#7286f4",
        hours: 10
      }
    ]
}

let currentData = userData;

/**
 * When a user signs in this function is called to activate parts of the website
 * that can be accessed by the user.
 *
 * @param {Object} googleUser
 * An object of the signed in user and their google details
 */
function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  console.log('Logged in as:' + profile.getName());
  document.getElementById("add").disabled = false;
  document.getElementById("edit").disabled = false;
  document.getElementById("log").disabled = false;
  document.getElementById("delete").disabled = false;
  callServer();
  buttonToggle();
  toggleCanvas();
  getUnits();
}

/**
 * On sign out this function disables all of the functions that are permitted to
 * signed out users. Also shows the "Session Over" screen iin the DOM
 */
function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  let signOut = document.getElementById('signout');
  auth2.signOut().then(function () {
    window.main.innerHTML =
    '<div id="sessionover"><h1> Session over. </h1></div>'
    signOut.classList.toggle('none');
  });
  document.getElementById("add").disabled = true;
  document.getElementById("edit").disabled = true;
  document.getElementById("log").disabled = true;
  document.getElementById("delete").disabled = true;
}

/**
 * Calls the serer logging whether a new user is signing in or if the userID is
 * already eith error catching for maintenance of the server and functions.
 */
async function callServer() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  const response = await fetch('/api/hello', fetchOptions).then(function(response) {
    if (!response.ok) { // This will run if the server api didn't respond or had a problem like 404 etc.
      throw Error(response.statusText);
    }
  })
  .catch(function(error) {
    console.log('Fetch problem: \n', error);
  });
}

function goBack() {
  window.history.back();
}

 //  ____   ___  _        __                  _   _
 // / ___| / _ \| |      / _|_   _ _ __   ___| |_(_) ___  _ __  ___
 // \___ \| | | | |     | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 //  ___) | |_| | |___  |  _| |_| | | | | (__| |_| | (_) | | | \__ \
 // |____/ \__\_\_____| |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/


async function addUnit() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let unit_name = document.getElementById('addvalue').value;
  let addConfirm = document.getElementById('UnitConfirm');
  let unitColour = document.getElementById('addcolour').value;
  unitColour = unitColour.slice(1);
  let url = '/api/addunit?unitname=' + unit_name + '&unitcolour=' + unitColour;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  await fetch(url, fetchOptions).then(function(response) {
    if (!response.ok) { // This will run if the server api didn't respond or had a problem like 404 etc.
      throw Error(response.statusText);
    }
    else { // If no problems fetching, then unpack the response
      return response.text();
    }
  }).then(function(response){
    if (response=="true"){ //If the response was 'true' then the Unit was added successfully
      addConfirm.textContent = "Added to SQL server";
    }
    else{ //Unit was not added successfully
      alert('Could not add Unit!');
    }
  })
  .catch(function(error) {
    console.log('Fetch problem: \n', error);
  });
  getUnits();
}

async function submitHours() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let unitID = document.querySelector('.logselect').value;
  let unitHours = document.getElementById('lognumber').value;
  let tempday = "2018-01-03";
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  let url = '/api/submithours?name=' + unitID + '&unithours=' + unitHours + '&unitday=' + tempday;
  await fetch(url, fetchOptions).then(function(response) {
    if (!response.ok) { // This will run if the server api didn't respond or had a problem like 404 etc.
      throw Error(response.statusText);
    }
    else { // If no problems fetching, then unpack the response
      return response.text();
    }
  }).then(function(response){
    if (response=="true"){ //If the response was 'true' then the Unit was added successfully
      addConfirm.textContent = "Added to SQL server";
    }
    else{ //Unit was not added successfully
      alert('Could not add Unit!');
    }
  })
  .catch(function(error) {
    console.log('Fetch problem: \n', error);
  });
}

async function getUnits() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  const response = await fetch('/api/getunits', fetchOptions);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  const data = await response.json();
  const unitList = document.querySelector('.unitlist');
  unitList.innerHTML = '';
  if (data.length == 0) {
    return;
  }
  userData = {
    userID: "",
    units: []}
  userData.userID = data[0].ID;

  data.forEach((i) => { //loops through adding a new element with the content of the SQL database
    const unitTemplate = document.getElementById('unit').content.cloneNode(true);
    let unitTitle = unitTemplate.querySelector('.unittitle');
    unitTitle.textContent = i.name; //Set the text to the unit name
    unitTitle.name = i.ID; //Set the name attribute to the unit ID
    unitTitle.style.color = i.colour; //sets colour of attribute to selected unit colour
    unitList.appendChild(unitTemplate);
    userData.units.push( {
      name: i.name,
      unitID: i.ID,
      colour: i.colour,
      hours: i.hours
    })
  });
  resetCanvas();
}

async function getBarchartData(dateFrom) { //Gets the Json for the barchart, only needs the date (gets hours after and including this date)
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  let url = '/api/getbarchartdata?date='+dateFrom;
  const response = await fetch(url, fetchOptions);
  console.log(response);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  return await response.json();
}

async function getGraphData(unitID,dateFrom) { //Gets the Json for the graph, takes the unitID and the date (gets hours for each day after and including this date)
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  let url = '/api/getgraphdata?unitid='+unitID+'&date='+dateFrom;
  const response = await fetch(url, fetchOptions);
  console.log(response);
  if (!response.ok) {
    console.log(response.status);
    return;
  }
  return await response.json();
}

async function removeUnit() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let unitID = document.querySelector('.delselect').value;
  let url = '/api/removeunit?unitid=' + unitID;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  await fetch(url, fetchOptions).then(function(response) {
    if (!response.ok) { // This will run if the server api didn't respond or had a problem like 404 etc.
      throw Error(response.statusText);
    }
    else { // If no problems fetching, then unpack the response
      return response.text();
    }
  }).then(function(response){
    if (response=="true"){ //If the response was 'true' then the Unit was added successfully
      //put anything to run on confirmation of unit removed successfully here
      console.log("Removed unit: %s",unitID);
    }
    else{ //Unit was not added successfully
      alert('Could not remove Unit!');
    }
  })
  .catch(function(error) {
    console.log('Fetch problem: \n', error);
  });
}

 //   ____                            _____                 _   _
 //  / ___|__ _ _ ____   ____ _ ___  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 // | |   / _` | '_ \ \ / / _` / __| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // | |__| (_| | | | \ V / (_| \__ \ |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 //  \____\__,_|_| |_|\_/ \__,_|___/ |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //

 /**
  * Changes the height and width of the canvas element that is passed through
  * the canvas parameter in proportion to the height and width of the window
  *
  * @param {HTMLElement} canvas
  * Canvas element within the DOM Model
  */
function setCanvasSize(canvas) {
  let main = (window.innerHeight*0.6);
  canvas.width = (window.innerWidth*0.6);
  canvas.height = (main);
}

/**
 * Sets the width of the drop menu for changing the displayed week
 */
function setDropWidth() {
  let button = document.getElementsByClassName('canvasButton')[0];
  let dropdown = document.getElementsByClassName('dropdown-content')[0];
  let width = button.clientWidth + "px";
  dropdown.setAttribute("style",`width:${width}`)
}

/**
 * Initialises the event listeners for all buttons, whilst calling the functons
 * that set the size of the canvas and associated buttons. Also calls for the
 * graph to be drawn on its canvas.
 */
function setPage() {
  let add = document.getElementById('add')
  add.addEventListener('click', function(){
      toggleAdd(".addunit");

  });

  let log = document.getElementById('log')
  log.addEventListener('click', function(){
      toggleAdd(".loghours");
  });

  let element2 = document.getElementsByClassName('canvasButton')
  element2[0].addEventListener('click', function(){
      toggleAdd(".dropdown-content");
  });
  setButtons(graphChoice, currentData);
  setDropWidth();
  setCanvasSize(canvas);
  drawGraph();
}

/**
 * sets the currentData that the graph will use
 *
 * @param {Int} graphChoice
 * Integer that corresponds to which case iin the switch should be executed
 * @param {String} unitTitle
 * String that indicates which unit should be shown if the case requires
 *
 * @return {JSON}
 * Returns the data that the graph will use to plot
 */
function setCurrentData(graphChoice, unitTitle) {
  let data;
  switch (graphChoice) {
    case 0: //Overview
      data = userData;
      break;
    case 1: // Single Unit Breakdown
      data = weekData;
      break;
  }

  return data;
}

/**
 * Sets the drop down options for the graph buttons
 *
 * @param {Int} graphChoice
 * Integer that corresponds to which case iin the switch should be executed
 * @param {JSON} data
 * The JSON Data that will be used to pull which options should be added to the
 * drop down menu
 */
function setButtons(graphChoice, data) {
  let button = document.getElementsByClassName('canvasButton')[0];
  let test = document.getElementsByClassName('dropdown-content')[0];
  let choices = document.getElementsByClassName('dropdown-content')[0].children;
  switch (graphChoice) {
    case 0: //Overview
      currentData= setCurrentData(0);
      button.innerHTML = "Course Overview";
      while (test.firstChild) {
          test.removeChild(test.firstChild);
      }
      break;
    case 1: // Single Unit Breakdown
      currentData = setCurrentData(1, weekName);
      button.innerHTML = "Choose A Week";
      while (test.firstChild) {
          test.removeChild(test.firstChild);
      }
      userData.units.forEach((i) => {
        let option = document.createElement("A");
        let text = document.createTextNode(i.name);
        option.appendChild(text);
        test.appendChild(option);
      });
      console.log(choices.length);
      break;
  }
}

/**
 * Resets the graph, buttons and log data. To be called when the page is loaded,
 * the size of the page changes using event listeners, the graph data changes,
 * or the data requested changes
 */
function resetCanvas() {
  setButtons(graphChoice, currentData);
  logHours();
  logUnits();
  setDropWidth();
  setCanvasSize(canvas);
  drawGraph();
}

/**
 * Flips the graphChoice variable between the different graph choices. 0 or 1.
 */
function changeGraphChoice() {
  graphChoice = (graphChoice == 0) ? 1 :0;
  resetCanvas();
}

/**
 * Draws a line on a canvas
 *
 * @param {HTMLElement} c
 * The 2D-Context of a canvas to be drawn on.
 * @param {Number} fX
 * X co-ordinate for the first point of the line
 * @param {Number} fY
 * Y co-ordinate for the first point of the line
 * @param {Number} sX
 * X co-ordinate for the Second point of the line
 * @param {Number} sY
 * Y co-ordinate for the Second point of the line
 * @param {String} colour
 * The colour of the line
 */
function drawLine(c, fX, fY, sX, sY, colour) {
  c.beginPath();
  c.lineWidth = 2;
  c.strokeStyle = colour;
  c.fillStyle = colour;
  c.moveTo(fX,fY);
  c.lineTo(sX,sY);
  c.stroke();
}

/**
 * Draws a bar for a bar chart on a canvas
 *
 * @param {HTMLElement} c
 * The 2D-Context of a canvas to be drawn on.
 * @param {Number} fX
 * X co-ordinate for the first point of the line
 * @param {Number} fY
 * Y co-ordinate for the first point of the line
 * @param {Number} sX
 * X co-ordinate for the Second point of the bar
 * @param {Number} sY
 * Y co-ordinate for the Second point of the bar
 * @param {String} colour
 * The colour of the line
 * @param {Number} numberOfUnits
 * The number of units
 */
function drawBar(c, fX, fY, sX, sY, colour, numberOfUnits) {
  let barWidth = (canvas.width/2)/(numberOfUnits*2.5)
  c.beginPath();
  c.lineWidth = 2;
  c.strokeStyle = colour;
  c.fillStyle = colour;
  c.moveTo(fX-barWidth,fY);
  c.lineTo(fX-barWidth,sY);
  c.lineTo(sX+barWidth,sY);
  c.lineTo(sX+barWidth,fY);
  c.stroke();
}

/**
 * Draws a box with the centre marked on a canvas
 *
 * @param {HTMLElement} c
 * The 2D-Context of a canvas to be drawn on.
 * @param {Number} x
 * X co-ordinate for the centre of the box
 * @param {Number} y
 * Y co-ordinate for the centre of the box
 * @param {String} colour
 * The colour of the line
 * @param {Number} numberOfUnits
 * The number of units
 */
function drawBox(c, x, y, colour, numberOfUnits) {
  for (let i = 1; i < 9; i+=7) {
    let barWidth = (canvas.width/2)/(numberOfUnits*(8*i))
    c.beginPath();
    c.lineWidth = 2;
    c.strokeStyle = colour;
    c.fillStyle = colour;
    c.moveTo(x-barWidth,y-barWidth);
    c.lineTo(x-barWidth,y+barWidth);
    c.lineTo(x+barWidth,y+barWidth);
    c.lineTo(x+barWidth,y-barWidth);
    c.lineTo(x-barWidth,y-barWidth);
    c.stroke();
  }
}

/**
 * Draws a text on a canvas
 *
 * @param {HTMLElement} c
 * The 2D-Context of a canvas to be drawn on.
 * @param {Number} x
 * X co-ordinate for the centre of the box
 * @param {Number} y
 * Y co-ordinate for the centre of the box
 * @param {String} colour
 * The colour of the line
 * @param {Number} numberOfElements
 * The number of elements
 * @param {Number} sizeMod
 * Used to fine tune the size  of the text
 */
function drawText(c, x, y, colour, text, numberOfElements, sizeMod) {
  let textSize = Math.floor(canvas.width*(0.2/numberOfElements)*sizeMod);
  if (textSize > canvas.height*0.8) {textSize = canvas.height*0.8}
  c.save();
  c.textAlign="center";
  c.scale(-1, 1);
  c.translate(-x, y);
  c.rotate(-Math.PI);
  c.font = `${textSize}px Arial`;
  c.fillText(text,0,0);
  c.restore();
}

/**
 * Draws the graph on to a canvas
 *
 * @param {HTMLElement} c
 * The 2D-Context of a canvas to be drawn on.
 * @param {Boolean} horizontal
 * Boolean indicating the current driection of the graph line being drawn
 * @param {Number} startx
 * X co-ordinate for the start position if the canvas
 * @param {Number} starty
 * Y co-ordinate for the start position if the canvas
 * @param {String} endCoord
 * Shows the ending x or y dependant on horizontal
 * @param {JSON} data
 * The data that will be plotted on to the graph
 * @param {Number} type
 * Used to indicate which case of the switch will be executed. Corresponds to
 * the graphType
 */
function populateGraph(c, horizontal, startx, starty, endCoord, data, type) {
  function getHeight(canvasHeight, max, hours) {
    return ((canvasHeight-(canvasHeight*0.15))*(hours/max))+(canvasHeight*0.1)
  }

  switch (type) {
    case 0: // Bar Chart for overview of all units
      let numberOfUnits = data.units.length;
      let max = getMaxHours(data.units, graphChoice);
      if (horizontal) {
        let xdif = (endCoord - startx)/(numberOfUnits+1);
        for (let i = 0; i < numberOfUnits+1; i++) {
          if (i <= numberOfUnits && (i) != 0) {
            let unit = data.units[i - 1];
            let x = startx+(xdif*(i));
            drawBar(c, x, starty, x, getHeight(canvas.height, max, unit.hours), unit.colour, numberOfUnits)
            drawText(c, x, canvas.height*0.025, unit.colour, unit.name, numberOfUnits, 0.75)
          }
          drawLine(c, startx+(xdif*(i+1)), starty - 5, startx+(xdif*(i+1)), starty +5, "black");
        }
      } else {
        let ydif = (endCoord - starty)/10;
        for (let i = 0; i < 10; i++) {
          drawLine(c, startx - 5, starty+(ydif*(i+1)), startx + 5, starty+(ydif*(i+1)), "black");
          if ((i+1)%5 == 0) {
            drawText(c, canvas.width * 0.05, starty+(ydif*(i+1)) - 5, "black", max*((i+1)/10), 6, 1)
          }
        }
      }
      break;

    case 1: // Scatter Graph for breakdown of single unit
      if (horizontal) {
        let numberOfWeeks = data.weeks.length;
        let max = getMaxHours(data.weeks, graphChoice);
        let coords = [];
        let xdif = (endCoord - startx)/(numberOfWeeks+1);
        for (let i = 0; i < numberOfWeeks+1; i++) {
          if (i <= numberOfWeeks && (i) != 0) {
            let week = data.weeks[i - 1];
            let x = startx+(xdif*(i));
            let y = getHeight(canvas.height, max, week.hours);
            drawBox(c, x, y, week.colour, numberOfWeeks)
            drawText(c, x, canvas.height*0.025, week.colour, week.name, numberOfWeeks, 0.5)
            coords.push({x: x, y: y});
          }
          for (let i = 0; i < coords.length - 1; i++) {
            c.save();
            c.globalCompositeOperation = "destination-over";
            drawLine(c, coords[i].x, coords[i].y, coords[i+1].x, coords[i+1].y, "black");
            c.restore();
          }
          drawLine(c, startx+(xdif*(i+1)), starty - 5, startx+(xdif*(i+1)), starty +5, "black");
        }
      } else {
        let ydif = (endCoord - starty)/10;
        let max = getMaxHours(data.weeks, graphChoice);
        for (let i = 0; i < 10; i++) {
          drawLine(c, startx - 5, starty+(ydif*(i+1)), startx + 5, starty+(ydif*(i+1)), "black");
          if ((i+1)%5 == 0) {
            drawText(c, canvas.width * 0.05, starty+(ydif*(i+1)) - 5, "black", max*((i+1)/10), 6, 1)
          }
        }
      }
      break
    default:

  }
}

/**
 * Gets the heighest number of hours from a data set
 *
 * @param {JSON} data
 * The data that will be searched
 * @param {Number} type
 * Used to indicate which case of the switch will be executed. Corresponds to
 * the graphType
 */
function getMaxHours(data, graphChoice) {
  let max = 0;
  let length = data.length;
  for (let i = 0; i < data.length; i++) {
    if (data[i].hours >  max) {
      max = data[i].hours;
    }
  }

  return max;
}

/**
 * Calls all the necessary function in order to draw and populate the graph
 */
function drawGraph() {
  let width = canvas.width;
  let height = canvas.height;

  populateGraph(c, true, width*0.1, height*0.1, width-(width*0.05), currentData, graphChoice);
  populateGraph(c, false, width*0.1, height*0.1, height-(height*0.05), currentData, graphChoice);
  drawLine(c, width*0.1, height*0.05, width*0.1, height-(height*0.05), "black");
  drawLine(c, width*0.05, height*0.1, width-(width*0.05), height*0.1, "black")
}

window.addEventListener('load', setPage);
window.addEventListener('resize', resetCanvas);


 //  ____                  _              _____                 _   _
 // |  _ \ ___  __ _ _   _| | __ _ _ __  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 // | |_) / _ \/ _` | | | | |/ _` | '__| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // |  _ <  __/ (_| | |_| | | (_| | |    |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 // |_| \_\___|\__, |\__,_|_|\__,_|_|    |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //            |___/


function logHours() {
  let logData = document.getElementById('logoption');
  let logArea = document.getElementsByClassName('logselect')[0];
  while (logArea.firstChild) {
      logArea.removeChild(logArea.firstChild);
  }
  userData.units.forEach((i) => {
  let option = document.createElement("OPTION");
  let text = document.createTextNode(i.name);
  option.style.value = i.name;
  option.appendChild(text);
  logArea.appendChild(option);
});
}
function logUnits() {
  let logArea = document.getElementsByClassName('delselect')[0];
  while (logArea.firstChild) {
      logArea.removeChild(logArea.firstChild);
  }
  userData.units.forEach((i) => {
  let option = document.createElement("OPTION");
  let text = document.createTextNode(i.name);
  option.style.value = i.name;
  option.appendChild(text);
  logArea.appendChild(option);
});
}


function toggleDelete() {
    let delArea = document.querySelector('.deleteunit');
    delArea.classList.toggle('show');
}

 function buttonToggle() {
   let signin = document.getElementById('signin');
   signin.classList.toggle('none');
 }

 function toggleCanvas() {
   let canvas = document.querySelector('.canvasArea');
   canvas.classList.toggle('show');
 }

 function toggleAdd(className) {
   let content = document.querySelector(className);
   content.classList.toggle('show');
 }
