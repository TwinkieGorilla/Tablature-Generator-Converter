I'm pretty sure we're all on the same page with this, but just to get my thoughts in order, here is where my portion is at:


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1 - Program description and noise problems


The 'script.js' file uses the Meyda library to capture live audio in real-time from a microphone.
The program will not work without access to a microphone.

Currently, Meyda extracts frequency (pitch) data using the "chroma" feature (see line 203). These frequency data are displayed in the blue box as a waveform.

In order to make the data more accurate, the audio stream is normalized to a set volume.
This means that audio at any volume will be detected evenly, no matter how quiet or loud it is.

A consequence of doing this is that excessive noise is picked up when there is silence.
The detected noise results in random data, which is the big problem I'm facing now.
Normalizing input is kind of necessary, unfortunately. And even without it, random noise is still picked up.

When I was testing the program, I found that it is capable of detecting pitches as we want if it is loud enough.
For example, if I whistle a sustained note into my microphone, it just detects the note I'm whistling without any background noise.
The problem is, silence exists in music and there will be times when a musician isn't playing and random data will be picked up instead of being ignored.

A solution to this problem is to apply a noise gate, which would 'block' (i.e., not tabulate) any audio quieter than a set amplitude.

I do not yet know how to do this :(


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

2 - Outputting pitch data to console


The frequency data are output to the console as they are read.
These can be viewed by opening the console in browser. (Inspect element -> console tab).

Readings are taken very often, so it very quickly becomes unusable.
Eventually we can set how frequently it reads from the audio stream. This may be as simple as reducing the buffer size or something.

Every pitch value is between 0 and 1. (If they weren't normalized they would be between 0 and infinity(?), which is a lot harder to use).
I'm not sure how the values correspond to usable pitch data we can use, so I think that should be one of the next steps.
In theory, 0 should be 20Hz (or whatever we set the minimum to) and 1 should be the maximum (20,000Hz).

The frequency data currently being logged to the console (lines 306-313) are what we need to put in the tab file.

I was looking into how to write data to a .txt file in JavaScript a bit this afternoon, but for security reasons, it looks like that functionality is pretty much blocked by every modern browser.


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

3 - What to do next


The two main issues I'm having are picking up noise and writing the data to a .txt file.
Later on, we will have to worry about translating the pitch data (between 0 and 1) into musical notes and then translating that into actual tablature.
I don't think that last part will be too bad, since we can just play a note and see what value it is.

So that's pretty much where I'm at so far.

I defintiely encourage you guys to play around with Meyda/the program if you have a mic.
A good deal of this code was stitched together from the Meyda site and elsewhere, so I'm still sort of figuring it out myself.