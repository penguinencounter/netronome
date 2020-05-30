console.log("metronome.js: Script load");
var AudioContext, audioContext, audioElement, track, startButton;
var playing = false;
var metronome_id = 0;
var bpm = 60;
var bpmOld = 60;


var bpm2delayMS = function(bpm) {
    return (60/bpm)*1000
}


var loadEvent = function() {
    document.title = "Netronome: Stopped";
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    // Grab the audio element and feed it to the context.
    audioElement = document.getElementById('metronome-click');
    track = audioContext.createMediaElementSource(audioElement);

    track.connect(audioContext.destination);


    loadEventHandlers();
    console.log("Listening for BPM changes.")
    setInterval(checkBPMChange, 100);
}


var checkBPMChange = function() {
    if (bpm <= 0 || bpm > 250) {
        console.log("Can't do that, sorry!");
        bpm = bpmOld;
        return;
    }
    if (playing && bpmOld !== bpm) {
        console.log("BPM changed.")
        startButton.click();
        startButton.click();
    }
    bpmOld = bpm;
};


var loadEventHandlers = function() {
    console.log("Event listeners ready.")
    // Add event listener to button.
    startButton = document.getElementById('play');
    startButton.addEventListener('click', function() {
        // play_tock();  // Autoplay workaround
        if (playing === false) {
            // Begin loop.
            play_tock();
            metronome_id = setInterval(play_tock, bpm2delayMS(bpm));
            playing = true;
            document.title = "Netronome: " + bpm + " BPM";
            console.log("Playing. Metronome ID is " + metronome_id);
        } else {
            // Stop loop.
            clearInterval(metronome_id);
            metronome_id = -1;
            playing = false;
            document.title = "Netronome: Stopped";
            console.log("Stopped.")
        }
    })

    //.
    audioElement.addEventListener('ended', () => {
        startButton.dataset.playing = 'false';
    }, false);
}


var play_tock = function() {
    // Make sure that the sound can play.
    if (audioContext.state === 'suspended') {
        console.log("Autoplay policy suspended audio, resuming...")
        audioContext.resume();
    }
    // Play noise.
    audioElement.pause();
    audioElement.fastSeek(0);
    audioElement.play();
    audioElement.dataset.playing = 'true';
}
