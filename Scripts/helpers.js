exports.rangeToLspRange = (document, range) => {
    const fullContents = document.getTextInRange(new Range(0, document.length))
    let chars = 0
    let startLspRange

    const lines = fullContents.split(document.eol)

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const lineLength = lines[lineIndex].length + document.eol.length

        if (!startLspRange && chars + lineLength >= range.start) {
            const character = range.start - chars
            startLspRange = { line: lineIndex, character }
        }
        if (startLspRange && chars + lineLength >= range.end) {
            const character = range.end - chars
            return { start: startLspRange, end: { line: lineIndex, character } }
        }

        chars += lineLength
    }

    return null
}
