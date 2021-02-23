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

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
    name: 'Low',
    type: 'frequency',
    range: { min: 0, max: 250 }, // frequency range, in hz
    level: 0, // amplitude
    max: 0, // max amplitude
    corrected: 0 // smoothing applied, always between 0 and 1
  },
  {
    name: 'Mid',
    type: 'frequency',
    range: { min: 250, max: 2000 },
    level: 0,
    max: 0,
    corrected: 0
  },
  {
    name: 'High',
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
      Name: ${level.name}
      <br/>
      Type: ${level.type}
      <br/>
      <div id='level_${index}'>Level: ${level.level}<div>
      <br/>
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
// document.addEventListener("click", () => audioContext.resume()) // audioContexts must be started by user interaction with the page

/**********HERE***************/

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

/*****************************/
// meyda
let analyzer = null
let audioSourceNodeMap = {}

const initializeAnalyzer = audioSource => {
  analyzer = Meyda.createMeydaAnalyzer({
    audioContext,
    source: audioSourceNodeMap[audioSource],
    bufferSize: 1024,
    featureExtractors: [ //features to be added
      //'amplitudeSpectrum',
      'spectralCentroid',
      'spectralSpread',
	  'chroma',
	  //'powerSpectrum'
    ],
    callback: ({
      //amplitudeSpectrum, 
      spectralCentroid, 
      spectralSpread,
	  chroma,
	  //powerSpectrum
    }) => {

      newSpectrum = chroma // populate spectrum

      if (chroma) { brightness = 1024 / (1024 * chroma) }
      if (chroma) { currentEnergy = 0.87 + (chroma / 1024) } 
    }
  }) 
  
  analyzer.start()

}



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
	document.querySelector('#level_'+index).innerHTML = 'Normalized Level: ' + level.corrected
	
	let counter = Math.floor((freqTest * 4))
	
		if (freqTest < (0.5)){
			if(freqTest == 0.28){
				document.getElementById("eString").innerHTML += counter + "-"
				document.getElementById("BString").innerHTML += "--"
				document.getElementById("GString").innerHTML += "--"
				document.getElementById("DString").innerHTML += "--"
				document.getElementById("AString").innerHTML += "--"
				document.getElementById("EString").innerHTML += "--"
				if(counter % 2 != 0){																// alternate blank space with tabs
					document.getElementById("eString").innerHTML += "--"
					document.getElementById("BString").innerHTML += "--"
					document.getElementById("GString").innerHTML += "--"
					document.getElementById("DString").innerHTML += "--"
					document.getElementById("AString").innerHTML += "--"
					document.getElementById("EString").innerHTML += "--"
				}
			}
		}
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