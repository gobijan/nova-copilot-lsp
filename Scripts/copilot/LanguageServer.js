const { AccountRequirement } = require("./support")

class LanguageServer {
    constructor() {
        /** @type {LanguageClient} */
        this.languageClient = null

        /** @type {boolean} */
        this.signedIn = false
        /** @type {boolean} */
        this.authorized = false

        // Observe the configuration setting for the server's location, and restart the server on change
        nova.config.observe("screenisland.novacopilotlsp.node-path", function(path) {
            this.activate(path)
        }, this)
    }

    async activate(path) {
        if (nova.inDevMode()) console.log("Activating Copilot...")

        if (this.languageClient) {
            this.languageClient.stop()
            nova.subscriptions.remove(this.languageClient)
        }

        // Use the default server path
        if (!path) {
            path = "/opt/homebrew/bin/node"
        }

        // Create the client
        var serverOptions = {
            path: path,
            args: [nova.path.join(nova.extension.path, "copilot/dist/agent.js"), "--stdio"],
            type: "stdio"
        }
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ["javascript", "python", "ruby", "go", "rust", "java", "php", "html", "css", "typescript", "json", "txt", "md"],
            debug: false
        }
        var client = new LanguageClient("copilot", "GitHub Copilot Language Server", serverOptions, clientOptions)

        try {
            // Start the client
            client.start()

            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client)
            this.languageClient = client

            this.languageClient.onNotification("statusNotification", (notification) => {
                console.log(JSON.stringify(notification))
            })
            this.languageClient.onNotification("PanelSolution", (notification) => {
                console.log(JSON.stringify(notification))
            })
            this.languageClient.onNotification("PanelSolutionsDone", (notification) => {
                console.log(JSON.stringify(notification))
            })
            this.languageClient.onNotification("LogMessage", (notification) => {
                // console.log(JSON.stringify(notification))
            })

            this.initialize()
            this.checkStatus()
            this.setEditorInfo()
        } catch (err) {
            // If the .start() method throws, it's likely because the path to the language server is invalid
            if (nova.inDevMode()) {
                console.error(err)
            }
        }
    }

    deactivate() {
        if (nova.inDevMode()) console.log("Deactivating Copilot...")

        if (this.languageClient) {
            this.languageClient.stop()
            nova.subscriptions.remove(this.languageClient)
            this.languageClient = null
        }
    }

    /** @private */
    async initialize() {
        try {
            const params = { "capabilities": { "workspace": { "workspaceFolders": true } } }
            await this.languageClient.sendRequest("initialize", params)
        } catch (error) {
            console.error(error)
        }
    }

    async checkStatus() {
        try {
            const response = await this.languageClient.sendRequest("checkStatus", {})

            const status = response["status"]
            const signedIn = ["NotAuthorized", "OK"].includes(status) ? true : false
            const authorized = status == "OK" ? true : false

            this.accountStatus = { signedIn, authorized }
        } catch (error) {
            console.error(error)
        }
    }

    /** @private */
    async setEditorInfo() {
        try {
            await this.languageClient.sendRequest("setEditorInfo", this.editorInfo)
        } catch (error) {
            console.error(error)
        }
    }

    /** @private @readonly */
    get editorInfo() {
        return {
            "editorInfo": {
                "name": "Nova",
                "version": "10.6",
            },
            "editorPluginInfo": {
                "name": "Nova Copilot",
                "version": "1.0",
            },
        }
    }

    /**
     * Object representing the current account status.
     * @type {{ signedIn: boolean, authorized: boolean }}
     */
    get accountStatus() {
        return {
            signedIn: this.signedIn,
            authorized: this.authorized
        }
    }

    /**
     * Set the current account status.
     * @param {{ signedIn: ?boolean, authorized: ?boolean }} newStatus
     */
    set accountStatus(newStatus) {
        if (newStatus.signedIn != null) this.signedIn = newStatus.signedIn
        if (newStatus.authorized != null) this.authorized = newStatus.authorized

        if (!this.signedIn) {
            console.warn("Copilot: has NOT been signed in.")
        } else if (!this.authorized) {
            console.warn("Copilot: has signed in but not authorized.")
        } else {
            console.log("Copilot: has been signed in and authorized")
        }
    }

    /**
     * Check if the current Account meets the specified requirement
     * @param {AccountRequirement} requirement
     * @returns {boolean}
     */
    accountMeetsRequirement(requirement) {
        switch (requirement) {
            case AccountRequirement.SignedIn:
                return this.accountStatus.signedIn
            case AccountRequirement.Authorized:
                return this.accountStatus.authorized
            case AccountRequirement.SignedOut:
                return !this.accountStatus.signedIn
            default:
                return false
        }
    }
}

module.exports = LanguageServer
