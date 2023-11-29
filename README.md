
pitch features
time
velocity

```
language features
notes
chords
arpeggios
trills
tremolos
patterns
repeats
tracks
```

> [!IMPORTANT]
> sfdsfd
> Score + Instruments + Player = Sound


> [!IMPORTANT]
> Crucial information necessary for users to succeed.

## Instruments
| File Type | Instruments Text | Instrument Files |     Instrument Players |
| :-------- | :--------------- | :--------------: | ---------------------: |
| soundfont | n/a              |     sf2, sf3     |             Fluidsynth |
| sfz       | sfz              |       sfz        |              sforzando |
| VST       | csound, chuck    |       VST        | DAW, Kontakt, VST Host |


## Score
| File Type              | Score Text     | Score Files |
| :--------------------- | :------------- | :---------: |
| quantitative           | abc, def, lily |    MIDI     |
| semantic, qualitiative | abc, def, lily |  MusicXML   |



## Features
| File Type              | Score Text     | Score Files |
| :--------------------- | :------------- | :---------: |
| quantitative           | abc, def, lily |    MIDI     |
| semantic, qualitiative | abc, def, lily |  MusicXML   |


```mermaid

flowchart LR

subgraph Pipeline
direction LR
instrument--->player
score--->player
player--->sound


end


subgraph player
direction TB
Fluidsynth---sfozando---DAW---VSTHost
end


subgraph instrument
direction LR
textinstrument-->scoreinstrument
end

subgraph score
direction LR
textscore-->scorefile
end


subgraph textinstrument
direction TB
2["sfz"]---csound---supercollider
end

subgraph scoreinstrument
direction TB
soundfont---sfz---VST
end

subgraph textscore
direction TB
abc---def---lily---mup
end


subgraph scorefile
direction TB
MIDI---MusicXML
end


```
