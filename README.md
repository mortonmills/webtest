# midi2sing

this repo is for converting the lyrics in midi files to singing.
The singing is an audio file that matches the timing of the midi file
so will align to the midi file.
The lyrics go through 4 stages.
- formants
- pitch
- velocity
- duration


support for:
TEMPO
tempo changes, each will have a tempo fixed to it, 
if any change is found then new section is generated, festival

get tempo from parsed midi, add too each lyric event with pitch
create a tempo track, will filter entire midi file for events and add all to tempo track
then sort tempo events by time
then add a tempo property for each lyrics event


MULTIPLE PITCHES
multiple pitches at the same time on a single track

setup vocal range for espeak should cover entire range for midi
will need to voice files for 9 octaves for about 5 voice files per midi file
can check the default hz for each voice in espeak and evaluate base pitch using that


DURATIONS
duration is questionable, not recommended altering audio speed within sox or DAW, quality can be low
create current tempo for each lyric event to determine the durational value in seconds


get the absolute duration from current noteOn to the next noteOn within the voice
may want to sort, in case absDeltaTime gets rearranged


PARAMETER CONTROL
can also keep voice monotone and add effects in other audio development
audio clear and maintains quality in output like this


RESTS
can subtract end time from duration to get a rest value in festival singing mode














These 4 data types can all be rendered to audio using midi data.
Values can also be left to a default value, ex, pitch can be left monotone.
midi2sing currently uses 2 text-to-speech backends for generating the formants stages.
They are also capable of producing pitch and volume, 
espeak with SSML and festival with its own singing mode.
festival's single is also capable of rendering the duration from a midi file.
espeak however requires further processing using sox and soxi.
first an SSML file is generated from the midi file.
Then the audio is generated from the SSML
using word gaps of silence to split the audio into syllables.
The time of the syllables are then compared to the time til the next note.
The remaining value is padded as silence to the syllables.
Then the syllables are merged into one track.
And if any other events occur on the track then they are merged as well into a single audio file.
Each audio file represents a track with lyric data.

A final optional rendering can merge a rendered midi using fluidsynth
and all the singing audio tracks from the midi
into complete audio file.

Note:
add fluidsynth output and merge with audio for complete audio render
fluidsynth includes soundfont and qsynth 
so will need to remove those from download when adding in local use



