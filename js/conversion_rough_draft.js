/****************************************************************************************************************************************************


					-----------------
					POTENTIAL ISSUES:
					-----------------
					

					1.) Converting to an instrument beyond notation range
						ex. mandolin to bass guitar
						
						Possible fix: transpose by appropriate amount of octaves
						
						
					2.) Playing notes beyond detection range

						Possible fix: expand pitch variables to include subsonic and supersonic frequencies
						
						
					3.) Inability to store two pitches simultaneously (polyphonics/chords)

						Possible fix: have separate variables (amount will correspond to number of strings; ex. 6 for guitar)
									  each variable would represent a different string, and if only one note is played, others will be ignored


					4.) Microtonal instrumentes
					
						Possible fix: more variables for frequencies not represented on chromatic scale


					5.) Neatly notating double-digit tabs
					
						Possible fix: if statement that adds more space when greater than 9


****************************************************************************************************************************************************/

/**********************************************************************/
/* create 96 variables for each note of chromatic scale from C0 to C8 */
/**********************************************************************/

let C8 = 96 // when pitch is ~4186 (highest note possible to play on violin in standard tuning)
let B7 = 95
// ...
let Db1 = 1 //use flats, not sharps
let C1 = 0 // when pitch is ~32Hz (C below lowest note on bass guitar in standard-tuning)

//will need to have a copy of this but in reverse in the hash tables so we can look up chords ^
//so we can have "if notesplayed = C0 && E0 && G0, then C chord" (and we can get smart about removing the numbers at the end, so C0 E5 G3 is still C major)

//... alternatively, could use interval notation for chord lookup... this would save space and would only need to be written for one pitch class

// instrument detected by microhpone (input instrument), reads high to low
let string1 = C1
let string2 = C1
let string3 = C1
let string4 = C1
let string5 = C1
let string6 = C1

// instrument you're converting to (output instrument)
let outputString1 = C1
let outputString2 = C1
let outputString3 = C1
let outputString4 = C1
let outputString5 = C1
let outputString6 = C1

let frequency = //somehow get microphone input to correspond to frequency
// we could either have "let A4 = 440, and when mic input is close to 440, then its an A" or leave it how it is and figure it out idk

let notePlayed = C1; // this is the note that the user plays; set from microhpone, changes each time
let fretNumber = 0; // this is the actual tab-notation numerical value
let string1Note = C1;


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*																				WRITING GUITAR TABS TO HTML																			*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


/* Guitar in standard tuning */

string1 = E4 //329Hz
string2 = B3 //246Hz
string3 = G3 //196
string4 = D3 //146
string5 = A2 //110
string6 = E2 //82

if(notePlayed >= string1 ){										// only works for monophonics; see issue 3
	fretNumber = notePlayed - string1
	document.getElementById("eString").innerHTML += fret + "-"
	document.getElementById("BString").innerHTML += "--"
	document.getElementById("GString").innerHTML += "--"
	document.getElementById("DString").innerHTML += "--"
	document.getElementById("AString").innerHTML += "--"
	document.getElementById("EString").innerHTML += "--"
	fretNumber = string1Note
}else if(notePlayed > string1 && notePlayed <= string2){
	fretNumber = notePlayed - string2
	document.getElementById("eString").innerHTML += "--"
	document.getElementById("BString").innerHTML += fret + "-"
	document.getElementById("GString").innerHTML += "--"
	document.getElementById("DString").innerHTML += "--"
	document.getElementById("AString").innerHTML += "--"
	document.getElementById("EString").innerHTML += "--"
}else if(notePlayed > string2 && notePlayed <= string3){
	fretNumber = notePlayed - string3
	document.getElementById("eString").innerHTML += "--"
	document.getElementById("BString").innerHTML += "--"
	document.getElementById("GString").innerHTML += fret + "-"
	document.getElementById("DString").innerHTML += "--"
	document.getElementById("AString").innerHTML += "--"
	document.getElementById("EString").innerHTML += "--"
}else if(notePlayed > string3 && notePlayed <= string4){
	fretNumber = notePlayed - string4
	document.getElementById("eString").innerHTML += "--"
	document.getElementById("BString").innerHTML += "--"
	document.getElementById("GString").innerHTML += "--"
	document.getElementById("DString").innerHTML += fret + "-"
	document.getElementById("AString").innerHTML += "--"
	document.getElementById("EString").innerHTML += "--"
}else if(notePlayed > string4 && notePlayed <= string5){
	fretNumber = notePlayed - string5
	document.getElementById("eString").innerHTML += "--"
	document.getElementById("BString").innerHTML += "--"
	document.getElementById("GString").innerHTML += "--"
	document.getElementById("DString").innerHTML += "--"
	document.getElementById("AString").innerHTML += fret + "-"
	document.getElementById("EString").innerHTML += "--"
}else if(notePlayed <= string6 ){
	fretNumber = notePlayed - string6
	document.getElementById("eString").innerHTML += "--"
	document.getElementById("BString").innerHTML += "--"
	document.getElementById("GString").innerHTML += "--"
	document.getElementById("DString").innerHTML += "--"
	document.getElementById("AString").innerHTML += "--"
	document.getElementById("EString").innerHTML += fret + "-"
}


/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*																				CONVERTING TABS																						*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


/* Guitar in standard tuning, half-step lowered */

outputString1 = Eb4
outputString2 = Bb3
outputString3 = Gb3
outputString4 = Db3
outputString5 = Ab2
outputString6 = Eb2

//then repeat all of those if statements above and I think that should just work but idk lol