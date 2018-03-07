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
  addUser();
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("Signed out.");
  });
}

async function callServer() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const fetchOptions = {
    credentials: 'same-origin',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  const response = await fetch('/api/hello', fetchOptions);
  if (!response.ok) {
    // handle the error
    return;
  }
  console.log(response);
}


 //  ____   ___  _        __                  _   _
 // / ___| / _ \| |      / _|_   _ _ __   ___| |_(_) ___  _ __  ___
 // \___ \| | | | |     | |_| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 //  ___) | |_| | |___  |  _| |_| | | | | (__| |_| | (_) | | | \__ \
 // |____/ \__\_\_____| |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/


async function addUser() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  console.log("user added");
  const response = await fetch('/api/user?id=' + id_token, fetchOptions);
}


async function addUnit() {
  const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  let unit_name = document.getElementById('addvalue').value;
  let addConfirm = document.getElementById('addconfirm');
  console.log(addConfirm);
  const fetchOptions = {
    credentials: 'same-origin',
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + id_token },
  };
  addConfirm.textContent = "Added to SQL server";
  const response = await fetch('/api/add?unitname=' + unit_name, fetchOptions);
}

//Canvas Functions
const c = document.getElementById("canvas").getContext("2d");

function drawLine(c, fX, fY, tX, tY, colour) {
  c.beginPath();
  c.lineWidth = 2;
  c.strokeStyle = colour;
  c.fillStyle = colour;
  c.moveTo(fX,fY);
  c.lineTo(tX,tY);
  c.stroke();
}

function initGraph() {
  drawLine(c, 0,0,500,500,"black");
  drawLine(c, 0, 500, 500, 500, "black")
}

initGraph();
