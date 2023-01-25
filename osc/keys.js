const letters = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let octaves;
let startingMIDI;

function keysSetup() {
	let keys = $("#keys")[0];
	octaves = 3;
	startingMIDI = 60 - 12 * Math.floor(octaves / 2);
	let whiteKeyWidth = 100 / (octaves * 7 + 1);
	let blackKeyWidth = 90 / (octaves * 7 + 1);
	let totalKeys = octaves * 12 + 1;

	for (let i = 0; i < totalKeys; i++) {
		let key = document.createElement("button");
		let letter = letters[i % 12];
		let midiNumber = startingMIDI + i;
		key.innerHTML = letter;
		key.id = "key" + midiNumber;
		if (letter.length === 1) {
			key.className = "whiteKeys";
			key.style.width = whiteKeyWidth + "%";
		} else {
			key.className = "blackKeys";
			key.style.left = ((0.55 + Math.floor(i / 2 + i / 12)) * whiteKeyWidth) + "%";
			key.style.width = blackKeyWidth + "%";
		}
		key.onmousedown = function () { mouseInput(midiNumber, "down") };
		key.onmouseup = function () { mouseInput(midiNumber, "up") };
		keys.append(key);
	}

	$(document).keydown(function (e) { keyboardInput(e.key, "down") });
	$(document).keyup(function (e) { keyboardInput(e.key, "up") });
}

function activateNote(midiNumber) {
	let freq = 440 * 2 ** ((midiNumber - 69) / 12);
	console.log(letters[midiNumber % 12] + " (midi: " + midiNumber + ", " + freq.toFixed(1) + "Hz)");

	osc1.setFrequency(freq, 0);
	$("#freqSlider")[0].value = Math.log10(freq);
	$("#hertz").text(freq.toFixed(1));
}

// mouse input
function mouseInput(midiNumber, type) {
	if (type == "down") {
		if (!ctx) setup();
		activateNote(midiNumber);
	}
}

// keyboard input
function keyboardInput(key, type) {
	console.log(key + " (" + type + ")");
	let midiNumber = 0;
	switch (key.toLowerCase()) {
		case ']': midiNumber++; // G
		case '=': midiNumber++; // F#
		case '[': midiNumber++; // F
		case 'p': midiNumber++; // E
		case '0': midiNumber++; // D#
		case 'o': midiNumber++; // D
		case '9': midiNumber++; // C#
		case 'i': midiNumber++; // C6
		case 'u': midiNumber++; // B
		case '7': midiNumber++; // A#
		case 'y': midiNumber++; // A
		case '6': midiNumber++; // G#
		case 't': midiNumber++; // G
		case '5': midiNumber++; // F#
		case 'r': midiNumber++; // F
		case '/': case 'e': midiNumber++; // E
		case ';': case '3': midiNumber++; // D#
		case '.': case 'w': midiNumber++; // D
		case 'l': case '2': midiNumber++; // C#
		case ',': case 'q': midiNumber++; // C5
		case 'm': midiNumber++; // B
		case 'j': midiNumber++; // A#
		case 'n': midiNumber++; // A
		case 'h': midiNumber++; // G#
		case 'b': midiNumber++; // G
		case 'g': midiNumber++; // F#
		case 'v': midiNumber++; // F
		case 'c': midiNumber++; // E
		case 'd': midiNumber++; // D#
		case 'x': midiNumber++; // D
		case 's': midiNumber++; // C#
		case 'z': midiNumber += 48; // C4
	}

	if (midiNumber >= 48) { // check if valid
		if (type == "down") {
			activateNote(midiNumber);
			$("#key" + midiNumber).addClass('active');
		} else if (type == "up") {
			$("#key" + midiNumber).removeClass('active');
		}
	}
}
