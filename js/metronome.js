/// METRONOM MODULE
var Metronome = function (rhythm_, playTime_, increasePeriod_, increaseNumber_) {
  "use strict";
  let context = new AudioContext(), // Audio context, in which all metronome beats are planned
      rhythm = rhythm_, // current rhythm
      beatLen = (60/rhythm), // Duratation of entire pause including the metronome beat itself (sec)
      tick_len = 0.15, // Duratation of metronome beat itself (sec)
      playTime = playTime_, // Full time of metronome working (min)
      startDelay =1 , // Delay before start (sec)
      increasePeriod = increasePeriod_, // Duratation of the period of the same rhythm (min)
      increaseNumber = increaseNumber_, // Rhythm is increased on this value
      frequency = 440, // Frequency of sound metronome beat
      oscillator,
      scheduleId, // id of main sheduler
      startTime, // beat start time
      ticksToPlay, // number of beats for planning
      periods, // number of periods of different rhythms
      defaultPeriod = 1,
      period,
      clearScheduleId;

  function start() {
    startTime = context.currentTime+startDelay;
    ticksToPlay = 0; // number of metronome beats
    // Let's calculate our metronome cycle, with increase rhythm or not.
    // Also all beats will be planned here.
    // It's possible to stop everything by calling context.stop()
    // remark: if rhythm is constant then we will use period for planning metronome beats.
    period = increasePeriod && increaseNumber ? increasePeriod: defaultPeriod;
    // number of periods of same rhythm
    periods = Math.ceil(playTime/period);
    scheduleTics();
    clearScheduleId = setTimeout(()=>{
      scheduleId = null;
    }, (startDelay+playTime*60)*1000);
  }


  function stop() {
    context.close();
    clearTimeout(scheduleId);
    clearTimeout(clearScheduleId);
    scheduleId = null;
    clearScheduleId = null;
  }

  function playTicks(ticksToPlay, beatLen) {
    let tick=0;
    let first_tick_freq = increasePeriod ? frequency/2: frequency;
    playTick(startTime, startTime + tick_len, first_tick_freq);
    startTime = startTime + beatLen;

    for(tick=1; tick<=ticksToPlay; tick++){
      playTick(startTime, startTime + tick_len, frequency);
      startTime = startTime + beatLen;
    }
  }

  function scheduleTics() {
    // We will use some delay in planning beats
    // otherwise audio context will work slowly
    scheduleId = setTimeout(function () {
      ticksToPlay = period * rhythm;
      playTicks(ticksToPlay, beatLen);
      if(increasePeriod && increaseNumber) {

        rhythm += increaseNumber;
        beatLen = (60/rhythm);
      }
      periods--;

      if(periods>0){
        scheduleTics();
      }
    }, periods == Math.ceil( playTime/period ) ? 0 : ( period * 60 * 1000) - 1000  );

  }

  function playTick(startTime, endTime, frequency) {
      oscillator = context.createOscillator();
      oscillator.frequency.value = frequency;
      oscillator.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(endTime);
  }

  function status(){
    return Boolean(scheduleId);
  }

  // from outside only this methods will be accessible
  return {
    start: start,
    stop: stop,
    status: status
  };
};
/// END OF METRONOM MODULE

function tuner(tuneTime){
  "use strict";
  let context = new AudioContext();
  let oscillator = context.createOscillator();
  oscillator.frequency.value = 440.0;
  oscillator.connect(context.destination);
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + tuneTime);
}
