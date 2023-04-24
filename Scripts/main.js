
var langserver = null;

exports.activate = function() {
    // Do work when the extension is activated
    langserver = new CopilotLanguageServer();
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
    if (langserver) {
        langserver.deactivate();
        langserver = null;
    }
}


class CopilotLanguageServer {
    constructor() {
        // Observe the configuration setting for the server's location, and restart the server on change
        nova.config.observe('screenisland.novacopilotlsp.node-path', function(path) {
            this.start(path);
        }, this);
    }

    deactivate() {
        this.stop();
    }

    start(path) {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
        }

        // Use the default server path
        if (!path) {
            path = "/opt/homebrew/bin/node";
        }

        // Create the client
        var serverOptions = {
            path: path,
            args: [nova.path.join(nova.extension.path, 'copilot/dist/agent.js')],
        };
        var clientOptions = {
            // The set of document syntaxes for which the server is valid
            syntaxes: ['javascript', 'python', 'ruby', 'go', 'rust', 'java', 'php', 'html', 'css', 'typescript', 'json', 'txt', 'md']
        };
        var client = new LanguageClient('copilot', 'GitHub Copilot Language Server', serverOptions, clientOptions);

        try {
            // Start the client
            client.start();

            // Add the client to the subscriptions to be cleaned up
            nova.subscriptions.add(client);
            this.languageClient = client;
        }
        catch (err) {
            // If the .start() method throws, it's likely because the path to the language server is invalid
            if (nova.inDevMode()) {
                console.error(err);
            }
        }
    }

    stop() {
        if (this.languageClient) {
            this.languageClient.stop();
            nova.subscriptions.remove(this.languageClient);
            this.languageClient = null;
        }
    }
}

