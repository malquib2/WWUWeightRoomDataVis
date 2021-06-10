/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */

/*const rangeslider = document.getElementById("sliderRange");
const output = document.getElementById("demo");
output.innerHTML = rangeslider.value+"%";
fillSideBar();

rangeslider.oninput = function() {
  output.innerHTML = this.value+"%";
};*/

function snapshotToArray(snapshot) {
  const returnArr = [];

  snapshot.forEach(function(childSnapshot) {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
}

function addToTable(Name, Data) {
  const dataTable = document.getElementById("dataTable");
  let tempString = "";
  const multiplyer = (rangeslider.value/100);


  // body weight no calculations needed
  tempString += "<tr>"+
    "<td>"+Name+"</td>"+
    "<td>"+Data[0]+"</td>";

  // Squat calculation
  if (Data[1] <= (Data[0]*multiplyer)) {
    tempString += "<td style=\"background-color: lightcoral;\">"+Data[1]+"</td>";
  } else {
    tempString += "<td style=\"background-color: chartreuse;\">"+Data[1]+"</td>";
  }

  // Bench calculation
  if (Data[2] <= (Data[0]*multiplyer)) {
    tempString += "<td style=\"background-color: lightcoral;\">"+Data[2]+"</td>";
  } else {
    tempString += "<td style=\"background-color: chartreuse;\">"+Data[2]+"</td>";
  }

  // Clean calculation
  if (Data[3] <= (Data[0]*multiplyer)) {
    tempString += "<td style=\"background-color: lightcoral;\">"+Data[3]+"</td>";
  } else {
    tempString += "<td style=\"background-color: chartreuse;\">"+Data[3]+"</td>";
  }

  // end of entry
  tempString += "<td>" +
        "<button type='button' onclick='productDelete(this);' class='btn btn-default'>" +
        "<span class='glyphicon glyphicon-remove' />" +
        "</button>" +
        "</td>";
  tempString += "</tr>";
  dataTable.innerHTML += tempString;
}

function updateData(Team) {
  // database call
  const database = firebase.database();
  const ref = database.ref();
  const selectedTeamref = ref.child("Teams").child(Team);
  const athleteRef = ref.child("Athletes");
  // ref to datatable
  const dataTable = document.getElementById("dataTable");

  dataTable.innerHTML ="<tr>"+
  "<th>Name</th>"+
  "<th>Weight</th>"+
  "<th>Squat</th>"+
  "<th>Bench</th>"+
  "<th>Clean</th>"+
  "<th>Delete</th>"+
  "</tr>";

  let name = "blank";
  let data1 = [];
  let data2 = [];
  // work on datatable

  selectedTeamref.once("value", (snapshot) => {
    snapshot.forEach((child) => {
      name = child.key;

      selectedTeamref.child(child.key).on("value", function(snapshot) {
        data1 = snapshotToArray(snapshot);
      });
      athleteRef.child(name).on("value", function(snapshot) {
        data2 = snapshotToArray(snapshot);
      });

      data1 = data1.concat(data2);
      addToTable(name, data1);
    });
  });
}

function updateButtons() {
  // used to get info from radio buttons
  const Teams = document.getElementsByName("team");
  let selected = 0;
  for (i = 0; i<Teams.length; i++) {
    if (Teams[i].checked) {
      selected = i;
    }
  }
  const out = (Teams[selected].getAttribute("id"));
  return out;
}

function changeTeam() {
  // used to call methods needed to update the datatable
  const newTeam = updateButtons();

  updateData(newTeam);
}

function fillSideBar() {
  const sideBar = document.getElementById("sideBar");
  const database = firebase.database();
  const ref = database.ref();

  ref.child("Teams").once("value", (snapshot) => {
    snapshot.forEach((child) => {
      sideBar.innerHTML += "<input type=\"radio\" id=\""+child.key+"\" onchange=\"changeTeam()\" name=\"team\" value=\""+ child.key+"\">"+
      "<label for=\"other\">"+child.key+"</label><br>";
    });
  });
}

function addData() {
  const database = firebase.database();
  const ref = database.ref();
  const athleteRef = ref.child("Athletes");

  const fileInput = document.getElementById("dataIn");
  let parsed;

  Papa.parse(fileInput.files[0], {
    complete: function(data) {
      parsed = data.data;
      console.log(parsed);
      let i;
      for (i=60; i< parsed.length-1; i++) {
        const tempName = parsed[i][0]+" "+parsed[i][1];
        foo = {};

        if ((parsed[i][6] == "Barbell Bench Press")) {
          athleteRef.child(tempName).update({
            Barbell_Bench_Press: parsed[i][34],
          });
        } else if (parsed[i][6] == "Barbell Back Squat") {
          athleteRef.child(tempName).update({
            Barbell_Back_Squat: parsed[i][34],
          });
        } else if (parsed[i][6] == "Power Clean") {
          athleteRef.child(tempName).update({
            Power_Clean: parsed[i][34],
          });
        }
      }
      console.log("data is finished being added");
    },
  });
}

function productDelete(ctl) {
  // gets name to be deleted from database
  const deleteThis = $(ctl).parents("tr").find("td:first").text();

  const database = firebase.database();
  const ref = database.ref();
  const where = updateButtons();
  ref.child("Teams").child(where).child(deleteThis).remove();

  // visually removes it from the table.
  $(ctl).parents("tr").remove();
}

function addAthlete() {
  const database = firebase.database();
  const ref = database.ref();
  const tempTeam = document.getElementById("teamIn").value;
  const team = tempTeam.trim();
  const tempName = document.getElementById("nameIn").value;
  const name = tempName.trim();
  const tempBodyWeight = document.getElementById("weightIn").value;
  const bodyWeight = tempBodyWeight.trim();

  ref.child("Teams").child(team).child(name).update({
    Weight: bodyWeight,
  });
}
