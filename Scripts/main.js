const LanguageServer = require("./copilot/LanguageServer")
// const CompletionProvider = require("./CompletionProvider")
const { applyCompletionCommand, signInCommand, signOutCommand } = require("./copilot/commands")

/** @type {LanguageServer} */
let langserver = null

// const syntaxes = ["javascript", "python", "ruby", "go", "rust", "java", "php", "html", "css", "typescript", "json", "txt", "md"]

/** Activate the extension. */
exports.activate = function() {
    langserver = new LanguageServer()

    // nova.assistants.registerCompletionAssistant(syntaxes, new CompletionProvider(langserver))
}

/** Deactivate the extension. */
exports.deactivate = function() {
    // Clean up state before the extension is deactivated
    if (langserver) {
        langserver.deactivate()
        langserver = null
    }
}

nova.subscriptions.add(
    nova.commands.register("screenisland.novacopilotlsp.signIn", () => signInCommand(langserver))
)

nova.subscriptions.add(
    nova.commands.register("screenisland.novacopilotlsp.signOut", () => signOutCommand(langserver))
)

nova.subscriptions.add(
    nova.commands.register("screenisland.novacopilotlsp.applyCompletion", async (editor) => applyCompletionCommand(editor, langserver))
)
