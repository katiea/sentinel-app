var myFirebaseRef = new Firebase("https://sentinel-app.firebaseio.com/");
var usersRef = myFirebaseRef.child("user");
var userEventsRef;
var userEventsRefEvents;
var isArmed = false;
var lastEvent;

// create audio file for alarm sound
var audio = new Audio('alarm.mp3');

$(document).ready(function(){

  // js for icon animation
  $('#nav-icon3').click(function(){
    $(this).toggleClass('open');
  });

  // response to "panicking" -- pause audio
  $('#panic-button').click(function(){
    audio.pause();
    $('#popup-alarm').hide();
    $('#response').show();
    usersRef.child(getName()).update({
      "armed": false
    });
  });
  // dismiss listener-- hide the popup and pause audio
  // set "silence" to true
  $('#dismiss-button').click(function(){
    $('#popup-alarm').hide();
    $('#nav-icon3').show();
    audio.pause();
    lastEvent.update({
      "silence": true
    });
    usersRef.child(getName()).update({
      "armed": false
    });
  });

  // change text for unlock/lock button and hint text
  $('#lock-toggle').click(function(){
    $('#circle').toggleClass("unlocked");
    // if currently locked, prompt to unlock
    if(this.checked){
      $('#button-text').text("UNLOCK");
      $('#suppl-text').text("Your car is under watch!");
      usersRef.child(getName()).update({
        "armed": true
      });
    } else{
      // if currently unlocked, prompt to lock
      $('#button-text').text("LOCK");
      $('#suppl-text').text("Press the button to arm your car!");
      usersRef.child(getName()).update({
        "armed": false
      });
    }
  });

  var 911 = new Audio('911.mp3');
  var AAA = new Audio('AAA.mp3');
  $('911call').click(function(){
    911.play();
  });
  $('AAAcall').click(function(){
    AAA.play();
  });
});

function setName(username){
  localStorage.setItem("username", username);
  usersRef.child(username).update({
    "email" : username + "@" + username + ".com",
    "location" : "Toronto, ON",
    "armed": false
  });
}
function getName(){
  return localStorage.getItem("username");
}
function clearUser(){
  localStorage.setItem("username", null);
}
function getHistory(){
  userEventsRefEvents = myFirebaseRef.child("user/"+getName()+"/events");
  userEventsRefEvents.orderByChild("time").on('value', function(datasnapshot){
    eventDataObject = datasnapshot.val();
    document.getElementById('events').innerHTML="";
    for(i in eventDataObject){
      var p = document.createElement('p');
      p.className = 'history-event';
      p.innerHTML = '<h5 class="history-event-type">' + eventDataObject[i].event.toUpperCase() +
        '</h5><p>Silenced: ' + eventDataObject[i].silence + '</p><p>Date: ' +
        new Date(eventDataObject[i].time*1000).toLocaleString() + '</p>';
      document.getElementById('events').appendChild(p);
    }
  });
}
function alarm(){
  userEventsRefEvents = myFirebaseRef.child("user/"+getName()+"/events");
  userEventsRefEvents.on('child_added', function(childSnapshot, prevChildKey){
    if(isArmed && childSnapshot.val().event == "alarm" && childSnapshot.val().time > Date.now()/1000 - 30000){
      audio.play();
      $('#popup-alarm').show();
      $('#nav-icon3').hide();
      lastEvent = childSnapshot.ref();
    }
  });
}
function watchIsArmed(){
  myFirebaseRef.child("user/"+ getName() +"/armed").on('value', function(datasnapshot){
    isArmed = datasnapshot.val();
  });
}
