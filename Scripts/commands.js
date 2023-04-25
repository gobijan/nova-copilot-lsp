/** @typedef {import("./LanguageServer")} LanguageServer */

/**
 * Sign in to Github Copilot
 * @param {LanguageServer} langserver
 */
exports.signInCommand = async (langserver) => {
    try {
        const signInInitiateResponse = await langserver.languageClient.sendRequest("signInInitiate", {})

        console.log(JSON.stringify(signInInitiateResponse))

        const verificationURI = signInInitiateResponse["verificationUri"]
        const userCode = signInInitiateResponse["userCode"]

        if (!verificationURI || !userCode) return

        nova.clipboard.writeText(userCode)
        nova.openURL(verificationURI)

        const signInConfirmResponse = await langserver.languageClient.sendRequest("signInConfirm", { "userCode": userCode })
        console.log(JSON.stringify(signInConfirmResponse))
    } catch (error) {
        console.error(error)
    }
}

/**
 * Sign out from Github Copilot
 * @param {LanguageServer} langserver
 */
exports.signOutCommand = async (langserver) => {
    try {
        const response = await langserver.languageClient.sendRequest("signOut", {})

        console.log(JSON.stringify(response))
    } catch (error) {
        console.error(error)
    }
}
