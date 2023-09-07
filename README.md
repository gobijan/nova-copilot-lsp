<!--
👋 Hello! As Nova users browse the extensions library, a good README can help them understand what your extension does, how it works, and what setup or configuration it may require.

Not every extension will need every item described below. Use your best judgement when deciding which parts to keep to provide the best experience for your new users.

💡 Quick Tip! As you edit this README template, you can preview your changes by selecting **Extensions → Activate Project as Extension**, opening the Extension Library, and selecting "nova-copilot-lsp" in the sidebar.

Let's get started!
-->

<!--
🎈 Include a brief description of the features your extension provides. For example:
-->

**nova-copilot-lsp** aims to provide deep integration with [**Github Copilot**](https://github.com/features/copilot), including the most important features.


Right now it is functional, but takes some finagling. If you'd like a deeper integration, [help us out](https://github.com/gobijan/nova-copilot-lsp) or let Github know by [leaving a comment in their discussion.](https://github.com/orgs/community/discussions/7431)
Working copilot language server extracted from [Github's Neovim Copilot Plugin](https://github.com/github/copilot.vim).



## Requirements

<!--
🎈 If your extension depends on external processes or tools that users will need to have, it's helpful to list those and provide links to their installers:
-->


nova-copilot-lsp requires some additional tools to be installed on your Mac:

- [Node.js](https://nodejs.org) 8.2.0 or newer and NPM 5.2.0 or newer
- [Neovim](https://neovim.io) (used for authentication with GitHub Copilot)
<!--
✨ Providing tips, tricks, or other guides for installing or configuring external dependencies can go a long way toward helping your users have a good setup experience:
-->

> To install the current stable version of Node, click the "Recommended for Most Users" button to begin the download. When that completes, double-click the **.pkg** installer to begin installation.

## Installation

The following steps are inspired by Github's Docs. [Head over there for more info.](https://github.com/github/copilot.vim?tab=readme-ov-file#getting-started)

1. Install dependencies:

   ```bash
   brew install neovim node
   ```

2. Clone the Copilot Plugin for Neovim:

   ```bash
   git clone https://github.com/github/copilot.vim.git \
    ~/.config/nvim/pack/github/start/copilot.vim
   ```

3. Start Neovim:

   ```bash
   nvim
   ```

4. Invoke and setup Copilot inside Neovim:

   ```bash
   :Copilot setup
   ```
   
   Follow the prompts, which will ask you to copy a code and press enter. A browser will open and ask you for the code. Enter it. Once the browser says success, close the browser.

If inline suggestions do not appear to be working, invoke `:Copilot status` inside Neovim to verify Copilot is enabled and not experiencing any issues.


## Usage

<!--
🎈 If your extension provides features that are invoked manually, consider describing those options for users:
-->

nova-copilot-lsp runs any time you open a local project with supported file extensions.

### Configuration

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library...** then select nova-copilot-lsp's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

<!--
👋 That's it! Happy developing!

P.S. If you'd like, you can remove these comments before submitting your extension 😉
-->

Copilot Completions should be in the Completion Provider list.
Additionally you can trigger them with `CMD+OPTION+'`.

Have fun.
