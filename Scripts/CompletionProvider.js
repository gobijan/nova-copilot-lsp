const { rangeToLspRange } = require("./helpers")
/** @typedef {import("./copilot/LanguageServer")} LanguageServer */

/** @implements {CompletionAssistant} */
class CompletionProvider {
    /** @param {LanguageServer} langserver */
    constructor(langserver) {
        this.langserver = langserver
    }

    /**
     * @param {TextEditor} editor
     * @param {CompletionContext} context
     * @returns {Promise<CompletionItem[]|null>}
     */
    async provideCompletionItems(editor, context) {

        // if (context.reason == CompletionReason.Character) return null

        const range = new Range(context.position, context.position)
        const completions = await this.langserver.getAllCompletions(editor, range)

        const completionItems = completions.map(completion => {
            const item = new CompletionItem(context.text, CompletionItemKind.Expression)
            item.insertText = completion.text
            item.documentation = completion.displayText
            item.detail = 'Copilot'
            return item
        })
        return completionItems
    }
}

module.exports = CompletionProvider
