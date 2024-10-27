-- This is a reader that puts the content of each input file into a code block, 
-- sets the file’s extension as the block’s class to enable code highlighting, 
-- and places the filename as a header above each code block.

function to_code_block (source)
    local _, lang = pandoc.path.split_extension(source.name)
    return pandoc.Div{
      pandoc.Header(2, source.name == '' and '<stdin>' or source.name),
      pandoc.CodeBlock(source.text, {class=lang}),
    }
  end
  
  function Reader (input, opts)
    return pandoc.Pandoc(input:map(to_code_block))
  end



--   This just returns a document containing a big code block with all of the input. 
--   Or, to create a separate code block for each input file, one might write

--   function Reader(input)
--     return pandoc.Pandoc(input:map(
--       function (s) return pandoc.CodeBlock(s.text) end))
--   end