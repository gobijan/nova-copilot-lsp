const { AccountRequirement } = require("./support")
/** @typedef {import("./LanguageServer")} LanguageServer */

/**
 * Sign in to Github Copilot
 * @param {LanguageServer} langserver
 */
exports.signInCommand = async (langserver) => {
    if (!langserver.accountMeetsRequirement(AccountRequirement.SignedOut)) {
        nova.workspace.showInformativeMessage("You are already logged into your Copilot account.")
        console.log("Already signed in")
        return
    }

    try {
        const signInInitiateResponse = await langserver.languageClient.sendRequest("signInInitiate", {})

        const verificationURI = signInInitiateResponse["verificationUri"]
        const userCode = signInInitiateResponse["userCode"]

        if (!verificationURI || !userCode) return

        nova.clipboard.writeText(userCode)
        nova.openURL(verificationURI)

        /** @type {any} */
        const signInConfirmResponse = await langserver.languageClient.sendRequest("signInConfirm", { "userCode": userCode })

        if (signInConfirmResponse.status == "OK") {
            langserver.checkStatus()
            nova.workspace.showInformativeMessage("Signed into your Copilot account.")
            console.log("Signed in")
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Sign out from Github Copilot
 * @param {LanguageServer} langserver
 */
exports.signOutCommand = async (langserver) => {
    if (!langserver.accountMeetsRequirement(AccountRequirement.SignedIn)) {
        nova.workspace.showInformativeMessage("You are already logged out of your Copilot account.")
        console.log("Already signed out")
        return
    }

    try {
        /** @type {any} */
        const response = await langserver.languageClient.sendRequest("signOut", {})

        if (response?.status == "NotSignedIn") {
            langserver.checkStatus()
            nova.workspace.showInformativeMessage("Signed out from your Copilot account.")
            console.log("Signed out")
        }
    } catch (error) {
        console.error(error)
    }
}
