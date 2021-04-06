let guit_chord = new Map();

// NOTES:
// NEED TO ADD DIMINISHED NOTES TO A LOT OF THESE CHORD FAMILIES

//------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------FIRST OCTAVE----------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

/******************************** 									 									********************************

A note on inversions:

On guitar there are only so many ways to play a chord, and each inversion is just a different way of playing them.
Some ways work better for some chords (something like an "E major" is almost always played in the "E shape" as 001220)

For the parts I wrote, I'm referring to these as the different fingering shapes for the chord that most commonly uses it. ex. the E shape ^^

Even though there are 12 notes, there are really only 3 distinct ways to play a chord; ths shapes are: A, C, E.

The A shape is actually just the G shape, but without the bottom and top notes. The D shape is the same as the C shape, just without the lower notes.
(in each case, the lower notes aren't played bc the open strings are in the same key as the chord)
And F, F#, etc are usually played using the E shape but just moved up some frets.

Some chords dont't really make sense in inverted form (for example, Eb in the E shape is played on the eleventh fret, which is kinda annoying to play unless you're soloing or smt)
What gets kinda tricky is some complex chords don't really 'fit' into any chord shape ... like a diminshed 7th I guess would be in the E shape, but it's so far removed idek ...
And some complex chords can't be played in certain inversions, like a dom7#9 can't be played below the 9th fret easily in the key of A, so don't bother transcribing weird jazz chords for every inversion (I marked what I think should and shouldn't be added)

Anything played above the 12th fret is just the same chord shapes but with 12 added to each fret. Tbh I'm not sure if it's worth including since playing chords that high is uncommon, but it wouldn't be too complicated to add 12 to each I guess


A lot of this is just from my experience with playing guitar ... I didn't really cite anything or do research lol so I might be wrong about some of this but I kinda figure it doesn't need to be perfect at least yet



Hope this helps!



Also this site is great for fingerings/inversion charts:


https://jguitar.com/chorddictionary.jsp


******************************** 									 									********************************/

/*-------------------------------------------------------------------------------------------------------------------------------------*/
/******************************** 									A									********************************/

// inversion 1 ... "A shape"

guit_chord.set("02220-", "a_maj"); // A major
guit_chord.set("22220-", "a_6"); // A6
guit_chord.set("32020-", "a_7"); // A7
guit_chord.set("42220-", "a_maj_7"); // A major 7th
guit_chord.set("00220-", "a_sus_2"); // A suspended 2nd
guit_chord.set("03220-", "a_sus_4"); // A suspended 4th
guit_chord.set("01220-", "a_min"); // A minor
guit_chord.set("31220-", "a_min_7"); // A minor 7th
guit_chord.set("", "a_dim"); // A diminished
guit_chord.set("", "a_dim_7"); // A diminished 7th
guit_chord.set("", "a_aug"); // A augmented
guit_chord.set("", "a_9"); // A 9th
guit_chord.set("", "a_add_9"); // A add 9th

// inversion 2 ... "E shape"

guit_chord.set("556775", "a_maj_inv_2"); // A major
guit_chord.set("", "a_6_inv2"); // A6										dont include
guit_chord.set("", "a_7_inv2"); // A7
guit_chord.set("", "a_maj_7_inv_2"); // A major 7th
guit_chord.set("", "a_sus2_inv_2"); // A suspended 2nd 							your call on this one, probably don't include it I say
guit_chord.set("", "a_sus4_inv_2"); // A suspended 4th							include this tho
guit_chord.set("", "a_min_inv_2"); // A minor
guit_chord.set("", "a_min_7_inv_2"); // A minor 7th
guit_chord.set("", "a_dim_inv_2"); // A diminished								same as below
guit_chord.set("", "a_dim7_inv_2"); // A diminished 7th							not sure which inversion this falls under, but maybe just have it for this one
guit_chord.set("", "a_aug_inv_2"); // A augmented								and this one
guit_chord.set("", "a_9_inv_2"); // A 9th
guit_chord.set("", "a_add9_inv_2"); // A add 9th

// inversion 3 ... "C shape"

guit_chord.set("- 10 9 11 12 -", "a_maj_inv_3"); // A major									(not sure how to write the notes above the 10th fret, I guess -1091112- works too but thought it looked confusing lol)
guit_chord.set("", "a_6_inv_3"); // A6										tbh don't bother with this one ... in all my years of playing guitar I've never played this chord like this lol
guit_chord.set("", "a_7_inv_3"); // A7
guit_chord.set("", "a_M7_inv_3"); // A major 7th
guit_chord.set("", "a_sus2_inv_3"); // A suspended 2nd 							your call on this one, probably don't include it I say
guit_chord.set("", "a_sus4_inv_3"); // A suspended 4th							same with this one
guit_chord.set("", "a_min_inv_3"); // A minor
guit_chord.set("", "a_min_7_inv_3"); // A minor 7th
guit_chord.set("", "a_dim_inv_3"); // A diminished								and this one
guit_chord.set("", "a_dim7_inv_3"); // A diminished 7th							this too
guit_chord.set("", "a_aug_inv_3"); // A augmented								and this one
guit_chord.set("", "a_9_inv_3"); // A 9th									and this one
guit_chord.set("", "a_add9_inv_3"); // A add 9th								maybe keep this one actually, since added ninths are easier to play in the C shape
guit_chord.set("-5454-", "a_dom_7_9"); // no uke equivalent atm			// A dominant 7 #9							technically, this is only really playable in the C inversion

// ^ since the uke only has 4 strings, anything more complex than like a 7th can't truly be played on one, so that makes making the hash tables way easier

/*-------------------------------------------------------------------------------------------------------------------------------------*/
/******************************** 									B									********************************/

// B CHORD FIRST OCTAVE FAMILY:

guit_chord.set("24442-", "b_maj");
guit_chord.set("-4442-", "b_maj_var_2"); // no uke equivalent atm
guit_chord.set("20212-", "b_7");
guit_chord.set("23442-", "b_min");
guit_chord.set("7777--", "b_min_7");
guit_chord.set("778998", "b_bar");
guit_chord.set("--442-", "b_5");
guit_chord.set("22212-", "b_9");
guit_chord.set("", "b_dim"); // C diminished
guit_chord.set("", "b_dim_7"); // C diminished 7th
guit_chord.set("", "b_aug"); // C augmented											// A 9th
guit_chord.set("", "b_add_9");

// C CHORD FIRST OCTAVE FAMILY:

guit_chord.set("01023-", "c_maj");
guit_chord.set("-5553-", "c_maj_var_2"); // no uke equivalent atm
guit_chord.set("3101--", "c_min");
guit_chord.set("34553-", "c_min_bar"); // no uke equivalent atm
guit_chord.set("01323-", "c_7");
guit_chord.set("6455--", "c_min_7");
// guit_chord.set('889 10 10 8', 'c_bar_var_2');   frets above the 9th fret  // no uke equivalent atm
guit_chord.set("33323-", "c_9");
guit_chord.set("-8787-", "c_9_var_2");
guit_chord.set("", "c_dim"); // C diminished
guit_chord.set("", "c_dim_7"); // C diminished 7th
guit_chord.set("", "c_aug"); // C augmented
guit_chord.set("", "c_9"); // C 9th
guit_chord.set("", "c_add_9");

// D CHORD FIRST OCTAVE FAMILY:

guit_chord.set("2320--", "d_maj");
guit_chord.set("1320--", "d_min");
guit_chord.set("2120--", "d_7");
guit_chord.set("1120--", "d_min_7");
guit_chord.set("-7775-", "d_maj_var_2"); // no uke equivalent atm
guit_chord.set("55545-", "d_9");
guit_chord.set("2020--", "d_6");
guit_chord.set("", "d_dim"); // D diminished
guit_chord.set("", "d_dim_7"); // D diminished 7th
guit_chord.set("", "d_aug"); // D augmented
guit_chord.set("", "d_9"); // D 9th
guit_chord.set("", "d_add_9");

// E CHORD FIRST OCTAVE FAMILY:

guit_chord.set("001220", "e_maj");
guit_chord.set("031220", "e_7");
guit_chord.set("001020", "e_7_var_2");
guit_chord.set("000220", "e_min");
guit_chord.set("030220", "e_min_7");
guit_chord.set("-99970", "e_maj_var_2");
guit_chord.set("021220", "e_6");
guit_chord.set("002220", "e_sus");
guit_chord.set("---220", "e_5");
guit_chord.set("", "e_dim"); // E diminished
guit_chord.set("", "e_dim_7"); // E diminished 7th
guit_chord.set("", "e_aug"); // E augmented
guit_chord.set("", "e_9"); // E 9th
guit_chord.set("", "e_add_9");

// F CHORD FIRST OCTAVE FAMILY:

guit_chord.set("-1233-", "f_maj");
guit_chord.set("112331", "f_bar");
guit_chord.set("142131", "f_7");
guit_chord.set("111331", "f_min");
guit_chord.set("141131", "f_min_7");
guit_chord.set("", "f_maj_var_2");
// guit_chord.set('- 10 10 10 8-', 'f_5'); CONTAINS DOUBLE DIGIT FRETS -- SHOULD IT BE IN FIRST OCTAVE???
guit_chord.set("---331", "f_5");
guit_chord.set("11200-", "f_6");
guit_chord.set("4343--", "f_dim"); // F diminished
guit_chord.set("", "f_dim_7"); // F diminished 7th
guit_chord.set("", "f_aug"); // F augmented
guit_chord.set("", "f_9"); // F 9th
guit_chord.set("", "f_add_9");

// G CHORD FIRST OCTAVE FAMILY

guit_chord.set("300023", "g_maj");
guit_chord.set("100023", "g_7");
guit_chord.set("333553", "g_min");
guit_chord.set("363353", "g_min_7");
guit_chord.set("334553", "g_maj_var_2"); // no ukulele equivalent atm
guit_chord.set("-3232-", "g_dom_7_9"); // no ukulele equivalent atm
guit_chord.set("310023", "g_sus");
guit_chord.set("3232--", "g_dim");
guit_chord.set("", "g_dim");
guit_chord.set("", "g_dim_7");
guit_chord.set("", "g_aug");
guit_chord.set("", "g_9");
guit_chord.set("", "g_add_9");

// -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- Sharps and Flats First Octave -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

// F SHARP (G FLAT) FIRST OCTAVE FAMILY

guit_chord.set("2234--", "f_sharp_g_flat_maj");
guit_chord.set("223442", "f_sharp_g_flat_bar");
guit_chord.set("223242", "f_sharp_g_flat_7");
guit_chord.set("222442", "f_sharp_g_flat_min");
guit_chord.set("252242", "f_sharp_g_flat_min_7");
guit_chord.set("222242", "f_sharp_g_flat_min_7_var_2"); // does this cause a collission?
guit_chord.set("- 11 11 11 9 - ", "f_sharp_g_flat_maj_var_2"); // no ukulele equivalent atm -- DOUBLE DIGIT FRETS -- SHOULD IT BE CONSIDERED FIRST OCTAVE?
guit_chord.set("---442", "f_sharp_g_flat_5");
guit_chord.set("-2121-", "f_sharp_g_flat_9");
guit_chord.set("999999", "f_sharp_g_flat_11");
guit_chord.set("", "f_dim");
guit_chord.set("", "f_dim_7");
guit_chord.set("", "f_aug");
guit_chord.set("", "f_9");
guit_chord.set("", "f_add_9");

// C SHARP (D FLAT) FIRST OCTAVE FAMILY

guit_chord.set("1213--", "c_sharp_d_flat_maj");
guit_chord.set("7666- ", "c_sharp_d_flat_7");
guit_chord.set("0212--", "c_sharp_d_flat_min");
guit_chord.set("9 9 10 11 11 9", "c_sharp_d_flat_maj_var_2"); // DOUBLE DIGIT FRETS
guit_chord.set("02122-", "c_sharp_d_flat_min_7");
guit_chord.set("--664-", ""); //power chord
guit_chord.set("-2121-", ""); // no idea why i put this here. don't know what it is.
guit_chord.set("44434-", ""); // ^
guit_chord.set("", "f_sharp_g_flat_dim");
guit_chord.set("", "f_sharp_g_flat_dim_7");
guit_chord.set("", "f_sharp_g_flat_aug");
guit_chord.set("", "f_sharp_g_flat_9");
guit_chord.set("", "f_sharp_g_flat_add_9");

//D SHARP (E FLAT) FIRST OCTAVE FAMILY

guit_chord.set("3431--", "d_sharp_e_flat_maj");
guit_chord.set("-4656-", "d_sharp_e_flat_7");
guit_chord.set("2324--", "d_sharp_e_flat_min");
guit_chord.set("-4344-", "d_sharp_e_flat_min_7");
// guit_chord.set('11 11 12 13 13 11','d_sharp_e_flat_maj_var_2'); DOUBLE DIGIT FRETS
guit_chord.set("2121--", "d_sharp_e_flat_dim");
guit_chord.set("443---", "d_sharp_e_flat_sus");
guit_chord.set("-1011-", "d_sharp_e_flat_6");
guit_chord.set("", "f_sharp_g_flat_dim_7");
guit_chord.set("", "f_sharp_g_flat_aug");
guit_chord.set("", "f_sharp_g_flat_9");
guit_chord.set("", "f_sharp_g_flat_add_9");

guit_chord.set("-3331-", "a_sharp_b_flat_maj");
guit_chord.set("4333--", "a_sharp_b_flat_7");
guit_chord.set("123311", "a_sharp_b_flat_min");
guit_chord.set("6666--", "a_sharp_b_flat_min_7");
guit_chord.set("667886", "a_sharp_b_flat_maj_var_2");
guit_chord.set("33331-", "a_sharp_b_flat_6");
guit_chord.set("1110--", "a_sharp_b_flat_9");
guit_chord.set("", "a_sharp_b_flat_dim");
guit_chord.set("", "a_sharp_b_flat_dim_7");
guit_chord.set("", "a_sharp_b_flat_aug");
guit_chord.set("", "a_sharp_b_flat_add_9");

/*
guitar_chord.set('', '');
guitar_chord.set('', '');
guitar_chord.set('', '');
guitar_chord.set('', '');
guitar_chord.set('', ''); 
guitar_chord.set('', ''); 
guitar_chord.set('', '');
guitar_chord.set('', '');
*/

//------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------SECOND OCTAVE----------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------

// E CHORD SECOND OCTAVE FAMILY:

//guitar_chord.set('12 999--', 'e_var_3');  //FRETS ABOVE THE 9TH FRET -- no uke equivalent atm

//document.write(g_chord.get(userInput));
var hello = "hello!";