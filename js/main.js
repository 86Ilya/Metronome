var metronome_ns = metronome_ns || {};
window.onload = main;

function main() {
  "use strict";

  document.getElementById("extraParams").style.display = "none";
  document.getElementById("check").checked = false;
  document.getElementById("tuner").onclick = tuner_handler;
  document.getElementById("startStopBtn").onclick = toggle;
  document.getElementById("check").onclick = showExtraParams;

  let tuneTime = 15;
  let rhythm_elem = document.getElementById("rhythm");
  let playTime_elem = document.getElementById("playTime");
  let checkBox_elem =document.getElementById("check");
  let increasePeriod_elem = document.getElementById("increasePeriod");
  let increaseNumber_elem = document.getElementById("increaseNumber");

  for (let slider of document.getElementsByClassName("slider")) {
    let output = document.getElementById(slider.id+"Value");
    output.innerHTML = slider.value;
    slider.oninput = function() {
        output.innerHTML = slider.value;
    };
  }

  //listen to shake event
  metronome_ns.shakeEvent = new Shake({threshold: 15});
  metronome_ns.shakeEvent.start();
  window.addEventListener('shake', tuner_handler, false);

  function showExtraParams() {
    // Get the checkbox
    var checkBox = document.getElementById("check");
    // Get the output text
    var params = document.getElementById("extraParams");

    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
      params.style.display = "block";
    } else {
      params.style.display = "none";
    }
  }

  function toggle(elem) {
    if(metronome_ns.tuner_play){
      return;
    }

    if(elem.target.innerText === "START") {
      elem.target.innerText = "STOP";
      let rhythm = parseInt(rhythm_elem.value);
      let playTime = parseInt(playTime_elem.value);
      let checkBox = checkBox_elem.checked;
      let increasePeriod = null;
      let increaseNumber = null;
      if(checkBox){
        increasePeriod = parseInt(increasePeriod_elem.value);
        increaseNumber = parseInt(increaseNumber_elem.value);
      }
      metronome_ns.metronome = Metronome(rhythm, playTime, increasePeriod, increaseNumber);

      metronome_ns.metronome.start();
      metronome_ns.changeTextTimeoutId = setTimeout(()=>{
        elem.target.innerText = "START";
        metronome_ns.metronome.stop();
      }, playTime * 60 * 1000 );
    }
    else{
      if(metronome_ns.changeTextTimeoutId){
        clearTimeout(metronome_ns.changeTextTimeoutId);
      }
      elem.target.innerText = "START";
      metronome_ns.metronome.stop();
    }
  }

  function tuner_handler(){
    if(!metronome_ns.metronome || !metronome_ns.metronome.status()){
      metronome_ns.tuner_play = true;
      tuner(tuneTime);
      setTimeout(()=>{ metronome_ns.tuner_play = false}, tuneTime * 1000);
    }
  }

}

