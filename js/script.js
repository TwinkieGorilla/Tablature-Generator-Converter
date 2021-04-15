 /*-----------------------------------------------------------------------------------------------P-T-C-H-.-J-S-----------------------------------------------------------------------------------------------------*/
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContextPitchDetect = null;
var isPlayingPitchDetect = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var detectorElem, 
	canvasElem,
	waveCanvas,
	pitchElem,
	noteElem,
	detuneElem,
	detuneAmount;

function gotStream(stream) {
		audioContextPitchDetect = new AudioContext();

		detectorElem = document.getElementById( "detector" );
		canvasElem = document.getElementById( "output" );
		pitchElem = document.getElementById( "pitch" );
		noteElem = document.getElementById( "note" );
		detuneElem = document.getElementById( "detune" );
		detuneAmount = document.getElementById( "detune_amt" );

    // Create an AudioNode from the stream.
    mediaStreamSource = audioContextPitchDetect.createMediaStreamSource(stream);

    // Connect it to the destination.
    analyser = audioContextPitchDetect.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect( analyser );
    updatePitch();
}

var rafID = null;
var tracks = null;
var buflen = 1024;
var buf = new Float32Array( buflen );

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.

function autoCorrelate( buf, sampleRate ) {
	var SIZE = buf.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
	//var best_frequency = sampleRate/best_offset;
}

function updatePitch( time ) {
	var cycles = new Array;
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, audioContextPitchDetect.sampleRate );
	// TODO: Paint confidence meter on canvasElem here.

	if (ac == -1) {
		detectorElem.className = "vague";
		pitchElem.innerText = "--";
		noteElem.innerText = "-";
		detuneElem.className = "";
		detuneAmount.innerText = "--";
	} else {
		detectorElem.className = "confident";
		pitch = ac;
		pitchElem.innerText = Math.round( pitch ) ;
		var note =  noteFromPitch( pitch );
		noteElem.innerHTML = noteStrings[note%12];
		var detune = centsOffFromPitch( pitch, note );
		if (detune == 0 ) {
			detuneElem.className = "";
			detuneAmount.innerHTML = "--";
		} else {
			if (detune < 0)
				detuneElem.className = "flat";
			else
				detuneElem.className = "sharp";
			detuneAmount.innerHTML = Math.abs( detune );
		}

    /*console.log('Pitch', pitch)                                                                 // original pitch.js code
    console.log('Note', noteStrings[note%12])
    console.log('Detune', detune < 0 ? 'flat' : 'sharp')
    console.log('Detune amount', Math.abs( detune ))
    console.log('------------')*/

	}

	if (!window.requestAnimationFrame)
	  window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	  rafID = window.requestAnimationFrame( updatePitch );
}


 /*-------------------------------------------------------------------------------------M-E-Y-D-A-------------------------------------------------------------------------------------------------------------------*/

let audioSource = null; // the active audio source
let audioSources = []; // every audio source

const createMicrophoneSources = () => { 
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const addMicrophoneSources = () => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const microphones = devices.filter(device => device.kind === 'audioinput')
          microphones.forEach(({deviceId, label}, index) => {
            navigator.mediaDevices.getUserMedia({ 
              audio: { 
                mandatory: { 
                  sourceId: deviceId, 
                  echoCancellation: false, // necessary to avoid feedback
                  googAutoGainControl: false
                }
              } 
            })
            .then((stream) => { 
              audioSources.push({
                name: label,
                source: stream,
                type: 'microphone'
              })

              // update select element
              const audioSourceSelectElement = document.querySelector('#audioSourceSelect')
              const optionToUpdate = audioSourceSelectElement.options[index]
              if (optionToUpdate) {	// if an option already exists at that index
                optionToUpdate.innerHTML = label
                optionToUpdate.value = label
              } 
              else { // create the option if it doesn't exist
                const option = document.createElement('option')
                option.text = label
                option.value = label
                audioSourceSelectElement.add(option)
              }

              // automatically set the audio source if it's the first index, or if you set it before
              if (index === 0 || label === localStorage.getItem('preferredAudioSource')) { 
                audioSource = label
                audioSourceSelectElement.value = label
                audioSourceSelectElement.dispatchEvent(new Event('change'));
              }
            })
          })
        })
      }  
      
      // ask for access to your mic
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop()) // once you have access, continue with function above
        addMicrophoneSources()
      })
      .catch(() => alert('Either you do not have a microphone or you have not given this app permision to use it') )
  }
}
createMicrophoneSources() // call immediately once the page loads

// watcher for the audioSourceSelect element
const ON_AUDIO_SOURCE_CHANGE = callback => {
  document.querySelector('#audioSourceSelect').onchange = e => {
    localStorage.setItem('preferredAudioSource', e.target.value)
    callback(e.target.value, audioSources)
  }
}

// draws the spectrum on the canvas element
const drawSpectrumVisualizer = (spectrum, noSignal) => {
  const numberOfBins = spectrum.length
  const binFrequencyRange = 22050 / numberOfBins
  const maxFrequency = 3000
  const maxBin = Math.floor(maxFrequency / binFrequencyRange)
  const detail = 60 // amount of bars

  const truncatedSpectrum = spectrum.slice(0, maxBin)
  const bands = _.chunk(truncatedSpectrum, truncatedSpectrum.length / detail).map(band => band.reduce((acc, c) => acc + c, 0) / band.length)

  const canvas = document.querySelector('#canvas')
  if (canvas) {
    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, width, height)
    const barWidth = Math.floor(width / bands.length)
    let x = 0
    bands.forEach((level, index) => {
      const correctedBand = level * height
      ctx.fillStyle = noSignal ? 'rgb(192,12,0)' : 'rgb(238,238,238)'
      ctx.fillRect(x, (height / 2) - (correctedBand / 2), barWidth, correctedBand + 1)
      x += barWidth
    })
  }        
}

// real time data is stored
let levels = [
  {
    name: 'Chroma bands',
    type: 'frequency',
    range: { min: 2000, max: 22050 },
    level: 0,
    max: 0,
    corrected: 0
  },
]

// create monitor elements
const parent = document.querySelector('#monitor')
levels.forEach((level, index) => {
  const element = document.createElement('div')
  element.innerHTML = `
    <div class='level'>
      <div id='level_${index}'><div>
      <br/>
    </div>
  `
  parent.appendChild(element)
})

// set all the levels back to 0
const resetLevels = () => {
  levels.filter(level => level.type === 'frequency').map(level => {
    level.level = 0
    level.max = 0
    level.corrected = 0
  })
}

// lowers the max level periodically to be sensitive to changes over time
const recalibrateFreq = () => {
  levels.filter(level => 
    level.type === 'frequency'
  ).map(level => {
    if (level.corrected > 0.01) {
      level.level = level.level * .7
      level.max = level.max * .7
      level.corrected = level.corrected * .7
    }
  })
}
setInterval(recalibrateFreq, 20000) 

let masterMediaStreamTrack = null
const getMediaStreamTrack = () => masterMediaStreamTrack

const AudioContext = window.AudioContext
  || window.webkitAudioContext
  || false

const audioContext = new AudioContext()
console.log('state after instantiation: ' + audioContext.state)
 //document.addEventListener("click", () => audioContext.resume()) // audioContexts must be started by user interaction with the page

document.querySelector("#start").addEventListener("click", function() {
  console.log("Start button clicked");
  audioContext.resume();
  console.log('after resume function called: ' + audioContext.state);
  initializeAudio(); 
});

document.querySelector("#stop").addEventListener("click", function () {
  console.log("Stop button clicked");
  audioContext.suspend();
  console.log('after stop function called: ' + audioContext.state);

});


// meyda
let analyzer = null
let audioSourceNodeMap = {}
let averageLoudness = 0
let notePlayed = 0                                                      // these might be able to be declared a little lower in the code
let fretNumber = 0
let fretString = "--"

const initializeAnalyzer = audioSource => {
  analyzer = Meyda.createMeydaAnalyzer({
    audioContext,
    source: audioSourceNodeMap[audioSource],
    bufferSize: 1024,
    featureExtractors: [ 
	  'chroma',
	  'spectralFlatness',
	  'mfcc'
    ],
    callback: ({
	  chroma,
	  spectralFlatness,
	  mfcc
    }) => {

      newSpectrum = chroma // populate spectrum
	  //console.log(mfcc)

    if (chroma) { brightness = 1024 / (1024 * chroma) }
    if (chroma) { currentEnergy = 0.87 + (chroma / 1024) } 



    /*-------------------------------------------------------------------------T-A-B-L-A-T-U-R-E--------------G-E-N-E-R-A-T-I-O-N-----------------------------------------------------------------------------------------------------*/



    if(spectralFlatness < 0.1){									                          // Meyda feature extractor for detcting noisiness; if sound played is "not noisy" (purposefully played), then begin taking input



      /************************************************************************************************************************************************
          Each string on a guitar in standard tuning, read highest string to lowest string

          The note to which each string is tuned is assigned a numerical value based on the total set of playable notes on a guitar (in standard tuning)

          The low E is represented with 0 because it is lowest playable note
      *************************************************************************************************************************************************/



      string1 = 24                                                      // These should probably be defined somewhere else... maybe above the if statement?
      string2 = 19
      string3 = 15
      string4 = 10
      string5 = 5
      string6 = 0



      /***************************************************************************************************************************************************************
          Using pitch.js, each frequency of every note on the guitar fretboard is assigned a numerical value

          0 is the value for the lowest playable note (an E2, played open on the lowest string in standard tuning)

          I haven't added everything yet, but the highest is probably about 50 ... meaning there are only 50 or so unique notes on a guitar

          "pitch" is a variable created by pitch.js that normally returns a frequency, ex. 440 for an A

          I built in some redundancy by making a range of acceptable frequencies that qualify for a note, if someone is out of tune

          Each if statement below represents a different note, so if the frequency of that note is played (+ or - some error), then it is assigned a value from 0 to 50

          This value is called "notePlayed" ... the console.logs are there for testing purposes and also to let us know which note is which

          When we add other instruments, we will need to copy this if statment and change the numerical assignment to correspond to that instrument's tuning system

          This should probably be done in different files, but idk how to do that
      ******************************************************************************************************************************************************************/


  
         if(pitch < 1580 && pitch > 1570){                               // 1574 is a G ... left in bc it's easy to whistle
          console.log("high G")
          notePlayed = 26

        // TODO: ADD IN THE REST OF THE NOTES

        }else if(pitch < 542 && pitch > 511){
          console.log("C5")                                             // BEGIN OCTAVE 5
          notePlayed = 32
        }else if(pitch < 510 && pitch > 483){
          console.log("B4")
          notePlayed = 31
        }else if(pitch < 482 && pitch > 455){
          console.log("A#4")
          notePlayed = 30
        }else if(pitch < 454 && pitch > 432){
          console.log("A4")
          notePlayed = 29
        }else if(pitch < 431 && pitch > 405){
          console.log("G#4")
          notePlayed = 28
        }else if(pitch < 404 && pitch > 385){
          console.log("G4")
          notePlayed = 27
        }else if(pitch < 384 && pitch > 360){
          console.log("F#4")
          notePlayed = 26
        }else if(pitch < 359 && pitch > 341){
          console.log("F4")
          notePlayed = 25
        }else if(pitch < 340 && pitch > 322){
          console.log("E4")                          
          notePlayed = 24
        }else if(pitch < 321 && pitch > 305){
          console.log("D#4")
          notePlayed = 23
        }else if(pitch < 304 && pitch > 289){
          console.log("D4")
          notePlayed = 22
        }else if(pitch < 288 && pitch > 271){
          console.log("C#4")
          notePlayed = 21
        }else if(pitch < 270 && pitch > 256){
          console.log("C4")                                             // BEGIN OCTAVE 4
          notePlayed = 20
        }else if(pitch < 255 && pitch > 241){
          console.log("B3")
          notePlayed = 19
        }else if(pitch < 240 && pitch > 230){
          console.log("A#3")
          notePlayed = 18
        }else if(pitch < 229 && pitch > 214){
          console.log("A3")
          notePlayed = 17
        }else if(pitch < 213 && pitch > 201){
          console.log("G#3")
          notePlayed = 16
        }else if(pitch < 200 && pitch > 191){
          console.log("G3")
          notePlayed = 15
        }else if(pitch < 190 && pitch > 181){
          console.log("F#3")
          notePlayed = 14
        }else if(pitch < 180 && pitch > 170){
          console.log("F3")
          notePlayed = 13
        }else if(pitch < 169 && pitch > 160){
          console.log("E3")                          
          notePlayed = 12
        }else if(pitch < 159 && pitch > 153){
          console.log("D#3")
          notePlayed = 11
        }else if(pitch < 152 && pitch > 144){
          console.log("D3")
          notePlayed = 10
        }else if(pitch < 143 && pitch > 136){
          console.log("C#3")
          notePlayed = 9
        }else if(pitch < 135 && pitch > 128){ // 131 is a C3                // BEGIN OCTAVE 3
          console.log("C3")
          notePlayed = 8
        }else if(pitch < 127 && pitch > 121){ // 123 is a B2
          console.log("B2")
          notePlayed = 7
        }else if(pitch < 120 && pitch > 115){ // 117 is a A#2
          console.log("A#2")
          notePlayed = 6
        }else if(pitch < 114 && pitch > 108){ // 110 is a A2
          console.log("A2")
          notePlayed = 5
        }else if(pitch < 107 && pitch > 103){ // 104 is a G#2
          console.log("G#2")
          notePlayed = 4
        }else if(pitch < 102 && pitch > 96){ // 98 is a G2
          console.log("G2")
          notePlayed = 3
        }else if(pitch < 95 && pitch > 91){ // 92 is a F#2
          console.log("F#2")
          notePlayed = 2
        }else if(pitch < 90 && pitch > 85){ // 87 is a F2
          console.log("F2")
          notePlayed = 1
        }else if(pitch < 84 && pitch > 79){ // 82 is a E2
          console.log("E2")                          
          notePlayed = 0
        }else{                                                              // when pitch isn't detcted, write "--" ... gotta love JS type safety lol     if this wasn't in here, it would write 0s instead
          console.log("Pitch too low to be detected")
          notePlayed = "--"
        }

      if(notePlayed == -1){                                                 // this code might be redundant, but it's used a few lines down ... 
          fretString = "--"
      }
      
      console.log(notePlayed)                                               // just here for testing purposes

      if(notePlayed >= string1){                                            // if the note you played (notePlayed) is higher in pitch than the high E (the note to which the top string is tuned), then write it on the top string
        fretNumber = notePlayed - string1
        fretString = fretNumber.toString()
        document.getElementById("string1").innerHTML += fretString + "-"
        document.getElementById("string2").innerHTML += "--"
        document.getElementById("string3").innerHTML += "--"
        document.getElementById("string4").innerHTML += "--"
        document.getElementById("string5").innerHTML += "--"
        document.getElementById("string6").innerHTML += "--"
      }else if(notePlayed < string1 && notePlayed >= string2){              // if the note you played is higher than the open B string, but lower than the high E string, then write on the second string
        fretNumber = notePlayed - string2
        fretString = fretNumber.toString()
        document.getElementById("string1").innerHTML += "--"
        document.getElementById("string2").innerHTML += fretString + "-"
        document.getElementById("string3").innerHTML += "--"
        document.getElementById("string4").innerHTML += "--"
        document.getElementById("string5").innerHTML += "--"
        document.getElementById("string6").innerHTML += "--"
      }else if(notePlayed < string2 && notePlayed >= string3){            // same idea for the other string ...
        fretNumber = notePlayed - string3
        fretString = fretNumber.toString()
        document.getElementById("string1").innerHTML += "--"
        document.getElementById("string2").innerHTML += "--"
        document.getElementById("string3").innerHTML += fretString + "-"
        document.getElementById("string4").innerHTML += "--"
        document.getElementById("string5").innerHTML += "--"
        document.getElementById("string6").innerHTML += "--"
      }else if(notePlayed < string3 && notePlayed >= string4){
        fretNumber = notePlayed - string4
        fretString = fretNumber.toString()
        document.getElementById("string1").innerHTML += "--"
        document.getElementById("string2").innerHTML += "--"
        document.getElementById("string3").innerHTML += "--"
        document.getElementById("string4").innerHTML += fretString + "-"
        document.getElementById("string5").innerHTML += "--"
        document.getElementById("string6").innerHTML += "--"
      }else if(notePlayed < string4 && notePlayed >= string5){
        fretNumber = notePlayed - string5
        fretString = fretNumber.toString()
        document.getElementById("string1").innerHTML += "--"
        document.getElementById("string2").innerHTML += "--"
        document.getElementById("string3").innerHTML += "--"
        document.getElementById("string4").innerHTML += "--"
        document.getElementById("string5").innerHTML += fretString + "-"
        document.getElementById("string6").innerHTML += "--"
      }else if(notePlayed < string5 ){
        fretNumber = notePlayed - string6
        fretString = fretNumber.toString()
        document.getElementById("string1").innerHTML += "--"
        document.getElementById("string2").innerHTML += "--"
        document.getElementById("string3").innerHTML += "--"
        document.getElementById("string4").innerHTML += "--"
        document.getElementById("string5").innerHTML += "--"
        document.getElementById("string6").innerHTML += fretString + "-"
      }

    // below are several lines of old Meyda code used in the old demos. This works for only one octave on one string

    /*
      // console.log("you played a C")
      fret = 8
    }else if(chroma[1] > 0.7){
      // console.log("you played a C#")
      fret = 9
    }else if(chroma[2] > 0.7){
      // console.log("you played a D")
      fret = 10
    }else if(chroma[3] > 0.7){
      // console.log("you played a D#")
      fret = 11
    }else if(chroma[4] > 0.7){
      // console.log("you played a E")
      fret = 0
    }else if(chroma[5] > 0.7){
      // console.log("you played a F")
      fret = 1
    }else if(chroma[6] > 0.7){
      // console.log("you played a F#")
      fret = 2
    }else if(chroma[7] > 0.7){
      // console.log("you played a G")
      fret = 3
    }else if(chroma[8] > 0.7){
      // console.log("you played a G#")
      fret = 4
    }else if(chroma[9] > 0.7){
      // console.log("you played a A")
      fret = 5
    }else if(chroma[10] > 0.7){
      // console.log("you played a A#")
      fret = 6
    }else if(chroma[11] > 0.7){
      // console.log("you played a B")
      fret = 7
    }

    document.getElementById("string1").innerHTML += (fretNumber.toString().length === 1 ? `$${fretNumber}` : fretNumber) + "-"             // this is a prettier way to write the tabs ... might solve the spacing inconsistencies between strings
    document.getElementById("string2").innerHTML += "--"
    document.getElementById("string3").innerHTML += "--"
    document.getElementById("string4").innerHTML += "--"
    document.getElementById("string5").innerHTML += "--"
    document.getElementById("string6").innerHTML += "--"
    
    if(chroma % 2 != 0){															                                                                                   	// alternate tabs with blank space ... we will probably still need this but it currently isn't working well wnough for that to be a concern
      document.getElementById("string1").innerHTML += "--"
      document.getElementById("string2").innerHTML += "--"
      document.getElementById("string3").innerHTML += "--"
      document.getElementById("string4").innerHTML += "--"
      document.getElementById("string5").innerHTML += "--"
      document.getElementById("string6").innerHTML += "--"
    }		*/

		  }
	  
    }
  }) 
  
  analyzer.start()
  
}


/*-------------------------------------------------------------------------A-U-D-I-O---------S-O-U-R-C-E-S----&------M-E-Y-D-A-----V-I-S-U-A-L-S-----------------------------------------------------------------------*/


// connect the audioSource to the audioContext (needed in order to process it)
const connectAudioSource = (audioSource, audioSources) => {
  activeAudioSource = audioSource
  audioSources.forEach(({type, name, source}) => {
    if (type === 'microphone') {
      if (!audioSourceNodeMap[name]) {
        audioSourceNodeMap[name] = audioContext.createMediaStreamSource(source)
      }
      const mediaStreamTrack = source.getAudioTracks()[0]
      name === audioSource ? mediaStreamTrack.enabled = true : mediaStreamTrack.enabled = false
    }

    // if (type === 'video') {
    //   if (!audioSourceNodeMap[name]) {
    //     audioSourceNodeMap[name] = audioContext.createMediaElementSource(source)
    //   }
    //   name === audioSource ? source.muted = false : source.muted = true
    //   audioSourceNodeMap[name].connect(audioContext.destination)
    // }
  })
}

const setMasterAudioSource = ({type, source}) => {
  if (type === 'microphone') {
    masterMediaStreamTrack = source.getAudioTracks()[0]
  }
  
  // if (type === 'video') {
  //   masterMediaStreamTrack = source.captureStream().getAudioTracks()[0]
  // }
}



let newSpectrum = new Array(512) // holds 512 values (bins) for the audio frequency spectrum
newSpectrum.fill(0, 0, newSpectrum.length)
let currentSpectrum = new Array(512)
currentSpectrum.fill(0, 0, currentSpectrum.length)
let normalizedSpectrum = []
let maxSpectrumEnergy = 0

// execute this code whenever the audioSource changes
ON_AUDIO_SOURCE_CHANGE((audioSource, audioSources) => {
  // reset audio
  newSpectrum = new Array(512)
  newSpectrum.fill(0, 0, newSpectrum.length)
  currentSpectrum = new Array(512)
  currentSpectrum.fill(0, 0, currentSpectrum.length)
  normalizedSpectrum = new Array(512)
  normalizedSpectrum.fill(0, 0, normalizedSpectrum.length)
  maxSpectrumEnergy = 0
  resetLevels()

  // connect new source and initialize analyzation
  connectAudioSource(audioSource, audioSources)
  setMasterAudioSource(audioSources.find(source => source.name === audioSource))
  analyzer ? analyzer.setSource(audioSourceNodeMap[audioSource]) : initializeAnalyzer(audioSource)

  const stream = audioSources.find(audioSrc => audioSrc.name === audioSource).source
  gotStream(stream)

})

// real time levels data
let isPlaying = false
const setLevels = () => {
  requestAnimationFrame(setLevels)
  // smoothing for spectrum
  let noSignal = false
  newSpectrum.forEach((value, index) => {
    const newValue = 0.8 * (currentSpectrum[index] + 0.2 * ( newSpectrum[index] )) // smoothing function
    if (newValue < 500) { newSpectrum[index] = newValue }
    else { 
      newSpectrum[index] = 499
      noSignal = true
    }
  })
  
  currentSpectrum = newSpectrum

  // correct and set audio levels
  const frequencyLevels = levels.filter(level => level.type === 'frequency')
  frequencyLevels.forEach((level, index) => {
    const binFrequencyRange = 22050 / newSpectrum.length
    const minBin = Math.floor(level.range.min / binFrequencyRange)
    const maxBin = Math.floor(level.range.max / binFrequencyRange)
    const numberOfBinsToAnalyze = (maxBin - minBin) + 1
    let freqSum = 0
    for (let i = minBin; i < maxBin; i++) {
      freqSum += newSpectrum[i]
    }
	
	level.level = freqSum / numberOfBinsToAnalyze

    if (level.level > level.max) { level.max = level.level }
    level.corrected = (level.level / level.max).toFixed(2)
	
	freqTest = level.level.toFixed(2)
	// document.querySelector('#level_'+index).innerHTML = 'Normalized Level: ' + level.level
	
	
	})
  // draw spectrum
  newSpectrum.forEach((value, index) => {
    if (value > maxSpectrumEnergy) { 
      maxSpectrumEnergy = value 
    }
	normalizedSpectrum[index] = value / maxSpectrumEnergy
  })

  drawSpectrumVisualizer(normalizedSpectrum, noSignal)
}

// requestanimationframe runs once every time screen refreshes
const initializeAudio = () => { requestAnimationFrame(setLevels) } 
//initializeAudio() // initialize the audio as soon as the page is loaded