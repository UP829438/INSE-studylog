 //                          _         _         _   _       _____                 _   _
 //   __ _  ___   ___   __ _| | ___   / \  _   _| |_| |__   |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 //  / _` |/ _ \ / _ \ / _` | |/ _ \ / _ \| | | | __| '_ \  | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // | (_| | (_) | (_) | (_| | |  __// ___ \ |_| | |_| | | | |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 //  \__, |\___/ \___/ \__, |_|\___/_/   \_\__,_|\__|_| |_| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //  |___/             |___/
 //


function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  console.log('Logged in as:' + profile.getName());
  callServer();
  buttonToggle();
  //addUser(); Moved this serverside
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  let signOut = document.getElementById('signout');
  auth2.signOut().then(function () {
    window.main.innerHTML =
    '<div id="sessionover"><h1> Session over. </h1></div>'
    signOut.classList.toggle('none');
  });
}

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
  unitColour = unitColour.slice( 1 );
  console.log(unitColour);
  let url = '/api/addunit?unitname=' + unit_name + '&unitcolour=' + unitColour;
  console.log(url);
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
}

//Canvas Functions
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
const testData = {
    userName: "a",
    units: [
      {
        unitName: "one",
        unitColour: "#4286f4",
        unitHours: 12
      },
      {
        unitName: "two",
        unitColour: "#dc37f2",
        unitHours: 6
      },
      {
        unitName: "three",
        unitColour: "#d61326",
        unitHours: 3
      },
      {
        unitName: "four",
        unitColour: "#7286f4",
        unitHours: 2
      }
    ]
}

function setCanvasSize(canvas) {
  let main = (window.innerHeight*0.6);
  canvas.width = (window.innerWidth*0.6);
  canvas.height = (main);
}

function resetCanvas() {
  setCanvasSize(canvas);
  drawGraph();
}

function drawLine(c, fX, fY, tX, tY, colour) {
  c.beginPath();
  c.lineWidth = 2;
  c.strokeStyle = colour;
  c.fillStyle = colour;
  c.moveTo(fX,fY);
  c.lineTo(tX,tY);
  c.stroke();
}

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

function populateGraph(c, horizontal, startx, starty, endCoord, data, type) {
  function getHeight(canvasHeight, max, hours) {
    return ((canvasHeight-(canvasHeight*0.15))*(hours/max))+(canvasHeight*0.1)
  }

  switch (type) {
    case 0: // Bar Chart for overview of all units
      let numberOfUnits = data.units.length;
      let max = getMaxHours(data.units);
      if (horizontal) {
        let xdif = (endCoord - startx)/(numberOfUnits+1);
        for (let i = 0; i < numberOfUnits+1; i++) {
          if (i <= numberOfUnits && (i) != 0) {
            let unit = data.units[i - 1];
            let x = startx+(xdif*(i));
            drawBar(c, x, starty, x, getHeight(canvas.height, max, unit.unitHours), unit.unitColour, numberOfUnits)
          }
          drawLine(c, startx+(xdif*(i+1)), starty - 5, startx+(xdif*(i+1)), starty +5, "black");
        }
      } else {
        let ydif = (endCoord - starty)/10;
        for (let i = 0; i < 10; i++) {
          drawLine(c, startx - 5, starty+(ydif*(i+1)), startx + 5, starty+(ydif*(i+1)), "black");
        }
      }
      break;

    case 1: // Scatter Graph for breakdown of single unit
      if (horizontal) {
        let numberOfWeeks = data.units.length;
        let max = getMaxHours(data.units);
        let coords = [];
        let xdif = (endCoord - startx)/(numberOfWeeks+1);
        for (let i = 0; i < numberOfWeeks+1; i++) {
          if (i <= numberOfWeeks && (i) != 0) {
            let week = data.units[i - 1];
            let x = startx+(xdif*(i));
            let y = getHeight(canvas.height, max, week.unitHours);
            drawBox(c, x, y, week.unitColour, numberOfWeeks)
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
        for (let i = 0; i < 10; i++) {
          drawLine(c, startx - 5, starty+(ydif*(i+1)), startx + 5, starty+(ydif*(i+1)), "black");
        }
      }
      break
    default:

  }
}

function getMaxHours(units) {
  let max = 0;
  for (let i = 0; i < units.length; i++) {
    if (units[i].unitHours >  max) {
      max = units[i].unitHours;
    }
  }

  return max;
}

function drawGraph() {
  //let userData = getUserData(getUserID());
  let width = canvas.width;
  let height = canvas.height;

  populateGraph(c, true, width*0.1, height*0.1, width-(width*0.05), testData, 1);
  populateGraph(c, false, width*0.1, height*0.1, height-(height*0.05), testData, 1);
  drawLine(c, width*0.1, height*0.05, width*0.1, height-(height*0.05), "black");
  drawLine(c, width*0.05, height*0.1, width-(width*0.05), height*0.1, "black")
}

window.addEventListener('load', resetCanvas);
window.addEventListener('resize', resetCanvas);


 //  ____                  _              _____                 _   _
 // |  _ \ ___  __ _ _   _| | __ _ _ __  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 // | |_) / _ \/ _` | | | | |/ _` | '__| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // |  _ <  __/ (_| | |_| | | (_| | |    |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 // |_| \_\___|\__, |\__,_|_|\__,_|_|    |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //            |___/

 function buttonToggle() {
   let signIn = document.getElementById('signin');
   signIn.classList.toggle('none');
 };


  function toggleAdd() {
    let content = document.querySelector(".addunit");
    content.classList.toggle('show');
  };
