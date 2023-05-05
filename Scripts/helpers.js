/**
 * Convert a Nova Range into an LSP compatible Range
 * @param {TextDocument} document
 * @param {Range} range
 * @returns {?{ start: { line: number, character: number }, end: { line: number, character: number } }}
 */
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

/**
 * Convert an LSP compatible Range into a Nova Range
 * @param {TextDocument} document
 * @param {{ start: { line: number, character: number }, end: { line: number, character: number } }} range
 * @returns {Range}
 */
exports.lspRangeToRange = (document, range) => {
    const fullContents = document.getTextInRange(new Range(0, document.length))
    let rangeStart     = 0
    let rangeEnd       = 0
    let chars          = 0

    const lines = fullContents.split(document.eol)

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const lineLength = lines[lineIndex].length + document.eol.length

        if (range.start.line === lineIndex) {
            rangeStart = chars + range.start.character
        }
        if (range.end.line === lineIndex) {
            rangeEnd = chars + range.end.character
            break
        }

        chars += lineLength
    }

    return new Range(rangeStart, rangeEnd)
}
