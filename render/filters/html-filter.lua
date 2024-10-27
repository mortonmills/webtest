

-- Custom reader that extracts the content from HTML documents,
-- ignoring navigation and layout elements. This preprocesses input
-- through the 'readable' program (which can be installed using
-- 'npm install -g readability-cli') and then calls the HTML reader.
-- In addition, Divs that seem to have only a layout function are removed
-- to avoid clutter.

function make_readable(source)
    local result
    if not pcall(function ()
        local name = source.name
        if not name:match("http") then
          name = "file:///" .. name
        end
        result = pandoc.pipe("readable",
                   {"--keep-classes","--base",name},
                   source.text)
      end) then
        io.stderr:write("Error running 'readable': do you have it installed?\n")
        io.stderr:write("npm install -g readability-cli\n")
        os.exit(1)
    end
    return result
  end
  
  local boring_classes =
          { row = true,
            page = true,
            container = true
          }
  
  local boring_attributes = { "role" }
  
  local function is_boring_class(cl)
    return boring_classes[cl] or cl:match("col%-") or cl:match("pull%-")
  end
  
  local function handle_div(el)
    for i,class in ipairs(el.classes) do
      if is_boring_class(class) then
        el.classes[i] = nil
      end
    end
    for i,k in ipairs(boring_attributes) do
      el.attributes[k] = nil
    end
    if el.identifier:match("readability%-") then
      el.identifier = ""
    end
    if #el.classes == 0 and #el.attributes == 0 and #el.identifier == 0 then
      return el.content
    else
      return el
    end
  end
  
  function Reader(sources)
    local readable = ''
    for _,source in ipairs(sources) do
      readable = readable .. make_readable(source)
    end
    local doc = pandoc.read(readable, "html", PANDOC_READER_OPTIONS)
    -- Now remove Divs used only for layout
    return doc:walk{ Div = handle_div }
  end