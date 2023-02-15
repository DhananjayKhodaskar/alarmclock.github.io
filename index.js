const currTime = document.querySelector("#current-time");
const setHour = document.querySelector("#hour");
const setMin = document.querySelector("#minute");
const setSec = document.querySelector("#second");
const setAmPm = document.querySelector("#am-pm");
const setAlarmBtn = document.querySelector("#submitBtn");
const alarmCont = document.querySelector("#alarms-container");

// Adding hour, minute, second in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  
  dropDownMenu(1, 12, setHour);
 
  dropDownMenu(0, 59, setMin);

  dropDownMenu(0, 59, setSec);

  setInterval(getcurrTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmBtn.addEventListener("click", getInputs);


function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

//Function to fetch current time 
function getcurrTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currTime.innerHTML = time;

  return time;
}

//function to get inputs from user for alarm
function getInputs(e) {
  e.preventDefault();
  const hourVal = setHour.value;
  const minVal = setMin.value;
  const secondVal = setSec.value;
  const ampmVal = setAmPm.value;

  const alarmTime = convert12hrto24hr(
    hourVal,
    minVal,
    secondVal,
    ampmVal
  );
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convert12hrto24hr(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

//function to give 'alert()' when alarm time matches with current time
function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getcurrTime()) {
      alert('Alarm is Ringing!')
    }
  }, 500);
  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

// Alarms set by user Dislayed in HTML 
// this function adds the alarm set by user in the form of list along with delete button
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "flex");
  alarm.innerHTML = `
              <div class="time">${time}</div>
              <button class="btn delete-alarm white-text" data-id=${intervalId}>Delete</button>
              `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmCont.prepend(alarm);
}

// Is alarms saved in Local Storage?
function checkAlarams() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarams();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetching alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarams();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

// below are the function used to delete the alarm when user click on delete button
function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocalStorage(time);
  alarm.remove();
}
function deleteAlarmFromLocalStorage(time) {
  const alarms = checkAlarams();

  const ind = alarms.indexOf(time);
  alarms.splice(ind, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
