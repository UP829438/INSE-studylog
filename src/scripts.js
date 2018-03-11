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
  let unit_name = document.getElementById('addUnit').value;
  let addConfirm = document.getElementById('UnitConfirm');
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  await fetch('/api/addunit?unitname=' + unit_name, fetchOptions).then(function(response) {
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

function setCanvasSize(canvas) {
  canvas.width = (window.innerWidth/3)*2;
  canvas.height = (window.innerHeight/3)*2;
}

function resetCanvas() {
  setCanvasSize(canvas);
  initGraph();
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

function drawNotches(c, horizontal, startx, starty, endCoord, notches) {
  if (horizontal) {
    let xdif = (endCoord - startx)/notches;
    for (let i = startx + xdif; i < endCoord; i+=xdif) {
      drawLine(c, i, starty - 5, i, starty +5, "black");
    }
  } else {
    let ydif = (endCoord - starty)/notches;
    for (let i = starty + ydif; i < endCoord; i+=ydif) {
      drawLine(c, startx - 5, i, startx + 5, i, "black");
    }
  }
}

function initGraph() {
  let width = canvas.width;
  let height = canvas.height;
  drawLine(c, width/10, height/20, width/10, height-(height/20), "black");
  drawLine(c, width/20, height-(height/10), width-(width/20), height-(height/10), "black")
  drawNotches(c, true, width/10, height-(height/10), width-(width/20), 10);
  drawNotches(c, false, width/10, height/20, height-(height/10), 10);
}

window.addEventListener('resize', resetCanvas);
setCanvasSize(canvas);
initGraph();


 //  ____                  _              _____                 _   _
 // |  _ \ ___  __ _ _   _| | __ _ _ __  |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
 // | |_) / _ \/ _` | | | | |/ _` | '__| | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 // |  _ <  __/ (_| | |_| | | (_| | |    |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
 // |_| \_\___|\__, |\__,_|_|\__,_|_|    |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 //            |___/

 function buttonToggle() {
   let signIn = document.getElementById('signin');
   console.log(signOut);
   signIn.classList.toggle('none');
 };
