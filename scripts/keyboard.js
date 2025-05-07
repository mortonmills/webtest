function keyboard(syntaxElements) {
    const headerRegex = /[`~!@#$%^&*]/
    const tonesRegex = /[a-zA-Z]/
    const timeRegex = /[0-9]/
    const specialRegex = /[()-=\[\]\\;',\.\/_+{}\|:"<>\?]/
    let letters = [
      "`1234567890-=",
      "qwertyuiop[]\\",
      "asdfghjkl;'",
      "zxcvbnm,./",
      "~!@#$%^&*()_+",
      "QWERTYUIOP{}|",
      "ASDFGHJKL:\"",
      "ZXCVBNM<>?",
    ]


let syntax = syntaxElements ? syntaxElements : `serftop`

    letters = letters.map(el => el
      .split(""))
    let keys = []
    letters.forEach((row, i, rowArr) => {
      keys.push(`<div>`)
      row.forEach((letter, letterIndex, letterArr) => {
        let lastLetter = letterArr.length - 1

        let group =
          headerRegex.test(letter)
            ? "headers"
            : tonesRegex.test(letter)
              ? "tones"
              : timeRegex.test(letter)
                ? "time"
                : specialRegex.test(letter)
                  ? "special"
                  : false

        let leftButton
        if (letterIndex === 0) {
          leftButton = letter === `q` || letter === `Q`
            ? "tab"
            : letter === `a` || letter === `A`
              ? "caps"
              : letter === `z` || letter === `Z`
                ? "shift"
                : false
        }


        let rightButton
        if (letterIndex === lastLetter) {
          rightButton = letter === `+` || letter === `=`
            ? "backspace"
            : letter === `"` || letter === `'`
              ? "enter"
              : letter === `/` || letter === `?`
                ? "shift"
                : false
        }



        let addLeftButton = `<div 
class="key button-size ${leftButton}">${leftButton}
  </div>`
        let addRightButton = `<div 
class="key button-size ${rightButton}">${rightButton}
  </div>`
        let code = `<div 
class="key button button-size ${syntax.includes(letter) ? group : 0}">${letter}
  </div>`

        leftButton && letterIndex === 0 ? keys.push(addLeftButton) : 0
        group ? keys.push(code) : 0
        rightButton && letterIndex === lastLetter ? keys.push(addRightButton) : 0
        letter === `?` || letter === `/` ? keys.push(`<br><br>`) : 0
      })
      keys.push(`</div>`)
    })




return  keys.join(" ")
  }