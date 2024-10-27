
-- pandoc --toc --css=~/epub.css --lua-filter ~/removeCode.lua --split-level=3 --metadata title="emphcode" code-epub-test.md -s -o ~/emphcode.html

function CodeBlock(block)
            if block.classes[1] == "def" then
                string = [[
                <textarea id="textInput" rows="7" cols="40"></textarea>
<br>
<button id="playBtn">Play!</button>
<div id=player></div>
<div id=piano0></div>

<script>

    let textInput = document.getElementById("textInput")
    let playBtn = document.getElementById("playBtn")
    let player = new JZZ.gui.Player({ at: 'player' });
    var piano0 = JZZ.input.Kbd({ at: "piano0", chan: 0, from: 'C4', to: 'B5', wl: 75, ww: 21, bl: 50, bw: 13 })

    piano0.connect(out)
    player.connect(piano0);

    let previousTextInput;
    playBtn.addEventListener('click', (e) => {

        // e.preventDefault();

        if (textInput.value !== previousTextInput) {
            previousTextInput = textInput.value
            let data = def(textInput.value)
            let { midiFileData, canvasData } = data
            // canvasPianoRoll(canvasData, "pianoRoll")
            player.load(new JZZ.MIDI.SMF(midiFileData)); // MIDI 1.0, or
        }
        player.play()

    })


</script>
                ]]
                return pandoc.RawBlock('html', string)
            end

            if block.classes[1] == "abc" then
                return pandoc.Div( pandoc.Emph(block.text) )
            end
end
-- function CodeBlock(block)
--         return pandoc.Div( pandoc.Emph(block.text) )
-- end

-- function Code(inline)
--         -- local span = pandoc.Span(inline.text)
--         -- span.attr = {class = 'code'}
--         return pandoc.Strong( pandoc.Emph(inline.text) )
--         -- pandoc.Emph(inline.text)
-- end





-- for image replacement
-- function CodeBlock(block)
--         if block.classes[1] == "js" then
--            -- local img = abc2eps(block.text, filetype)
--            -- local fname = pandoc.sha1(img) .. "." .. filetype
--             -- pandoc.mediabag.insert(fname, mimetype, img)
--             return pandoc.Para{ pandoc.Image({pandoc.Str("alt text")}, "desktest.png", "thisisatitle")}
--         end
--     end
    
    --pandoc.Attr("", "", {height = "100px"})
    --Attr ([identifier[, classes[, attributes]]])