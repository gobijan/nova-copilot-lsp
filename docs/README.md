# Setup

You will use [copilot.vim](https://github.com/github/copilot.vim) to authenticate with Github.

If you have installed node or neovim with things other than homebrew, obviously don't do this step.

1. Install Dependencies

    ```bash
    brew install neovim node
    ```

2. Clone Copilot Vim

    ```bash
    git clone https://github.com/github/copilot.vim.git \
     ~/.config/nvim/pack/github/start/copilot.vim
    ```

3. Start Neovim

    ```bash
    nvim
    ```

4. Invoke and Setup Copilot
   Once inside Neovim, run the following command
    ```bash
    :Copilot setup
    ```
    Follow the prompts, which will ask you to copy the code and press enter.
    A browser will open and ask you for the code. Enter it.
    Once the browser says success, close the browser.

If inline suggestions do not appear to be working, invoke `:Copilot status` to verify Copilot is enabled and not experiencing any issues.

Clone the Copilot Plugin for Neovim: Open the Terminal and run the following command to clone the copilot.vim repository to the proper directory for Neovim:
bash
Copy code
git clone https://github.com/github/copilot.vim.git \
 ~/.config/nvim/pack/github/start/copilot.vim
Start Neovim: Run the following command to start Neovim:
bash
Copy code
nvim
Invoke Copilot Setup: Once inside Neovim, enter the following command to start the Copilot setup:
vim
Copy code
:Copilot setup
Follow any additional prompts or instructions that may appear.
Using Copilot: Once set up, you should be able to see suggestions displayed inline as you code within Neovim. You can accept these suggestions by pressing the tab key.
Accessing Help: If you need more information on how to use Copilot within Neovim, you can run the following command inside Neovim for help:
vim
Copy code
:help copilot

brew install neovim node

Getting started
Install Neovim or the latest patch of Vim (9.0.0185 or newer).

Install Node.js.

Install github/copilot.vim using vim-plug, packer.nvim, or any other plugin manager. Or to install manually, run one of the following commands:

Vim, Linux/macOS:

git clone https://github.com/github/copilot.vim.git \
 ~/.vim/pack/github/start/copilot.vim
Neovim, Linux/macOS:

git clone https://github.com/github/copilot.vim.git \
 ~/.config/nvim/pack/github/start/copilot.vim
Vim, Windows (PowerShell command):

git clone https://github.com/github/copilot.vim.git `
$HOME/vimfiles/pack/github/start/copilot.vim
Neovim, Windows (PowerShell command):

git clone https://github.com/github/copilot.vim.git `
$HOME/AppData/Local/nvim/pack/github/start/copilot.vim
Start Neovim and invoke :Copilot setup.

Suggestions are displayed inline and can be accepted by pressing the tab key. See :help copilot for more information.

```bash
bhensel-ca@Bentleys-MacBook-Pro ~ % which node
/usr/local/bin/node
bhensel-ca@Bentleys-MacBook-Pro ~ % node --version
v20.5.1
bhensel-ca@Bentleys-MacBook-Pro ~ % npm --version

9.8.0


```

bhensel-ca@Bentleys-MacBook-Pro Meta % brew install neovim

==> Downloading https://formulae.brew.sh/api/formula.jws.json
############################################################################################################# 100.0%
==> Downloading https://formulae.brew.sh/api/cask.jws.json
############################################################################################################# 100.0%
==> Fetching dependencies for neovim: unibilium, libtermkey, libvterm, luajit, luv and msgpack
==> Fetching unibilium
==> Downloading https://ghcr.io/v2/homebrew/core/unibilium/manifests/2.1.1-1
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/unibilium/blobs/sha256:f7105a9bffd1de736ef229c6079bd2d535516ebb9bf7
############################################################################################################# 100.0%
==> Fetching libtermkey
==> Downloading https://ghcr.io/v2/homebrew/core/libtermkey/manifests/0.22-1
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/libtermkey/blobs/sha256:78d8398b5a79c26bf5b6cb85d71293309ed5533abd6
############################################################################################################# 100.0%
==> Fetching libvterm
==> Downloading https://ghcr.io/v2/homebrew/core/libvterm/manifests/0.3.2
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/libvterm/blobs/sha256:94719fc8256bdfc148d7e8652a03d3289d92d5820883c
############################################################################################################# 100.0%
==> Fetching luajit
==> Downloading https://ghcr.io/v2/homebrew/core/luajit/manifests/2.1.0-beta3-20230813.2
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/luajit/blobs/sha256:7703055988274d4d9acd8e04b28a937db7a3e5d31531d8f
############################################################################################################# 100.0%
==> Fetching luv
==> Downloading https://ghcr.io/v2/homebrew/core/luv/manifests/1.45.0-0
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/luv/blobs/sha256:c00db5a8ec11d0c36eb1052da3f44959f0f14378bb2a0737de
############################################################################################################# 100.0%
==> Fetching msgpack
==> Downloading https://ghcr.io/v2/homebrew/core/msgpack/manifests/6.0.0
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/msgpack/blobs/sha256:7abad795d8f0b89d7927db89147ba2a5273e04cdfdcda3
############################################################################################################# 100.0%
==> Fetching neovim
==> Downloading https://ghcr.io/v2/homebrew/core/neovim/manifests/0.9.1
############################################################################################################# 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/neovim/blobs/sha256:70888c68b7413575337a00a044b17a1a06e8948b6b3fa33
############################################################################################################# 100.0%
==> Installing dependencies for neovim: unibilium, libtermkey, libvterm, luajit, luv and msgpack
==> Installing neovim dependency: unibilium
==> Pouring unibilium--2.1.1.ventura.bottle.1.tar.gz
🍺 /usr/local/Cellar/unibilium/2.1.1: 63 files, 279.9KB
==> Installing neovim dependency: libtermkey
==> Pouring libtermkey--0.22.ventura.bottle.1.tar.gz
🍺 /usr/local/Cellar/libtermkey/0.22: 33 files, 141.5KB
==> Installing neovim dependency: libvterm
==> Pouring libvterm--0.3.2.ventura.bottle.tar.gz
🍺 /usr/local/Cellar/libvterm/0.3.2: 12 files, 322.0KB
==> Installing neovim dependency: luajit
==> Pouring luajit--2.1.0-beta3-20230813.2.ventura.bottle.tar.gz
🍺 /usr/local/Cellar/luajit/2.1.0-beta3-20230813.2: 57 files, 1.9MB
==> Installing neovim dependency: luv
==> Pouring luv--1.45.0-0.ventura.bottle.tar.gz
🍺 /usr/local/Cellar/luv/1.45.0-0: 15 files, 742.9KB
==> Installing neovim dependency: msgpack
==> Pouring msgpack--6.0.0.ventura.bottle.tar.gz
🍺 /usr/local/Cellar/msgpack/6.0.0: 38 files, 202.4KB
==> Installing neovim
==> Pouring neovim--0.9.1.ventura.bottle.tar.gz
🍺 /usr/local/Cellar/neovim/0.9.1: 1,736 files, 25.5MB
==> Running `brew cleanup neovim`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
bhensel-ca@Bentleys-MacBook-Pro Meta % nvim --version

NVIM v0.9.1
Build type: Release
LuaJIT 2.1.0-beta3

system vimrc file: "$VIM/sysinit.vim"
fall-back for $VIM: "/usr/local/Cellar/neovim/0.9.1/share/nvim"

Run :checkhealth for more info
bhensel-ca@Bentleys-MacBook-Pro Meta % git clone https://github.com/github/copilot.vim.git \
 ~/.config/nvim/pack/github/start/copilot.vim

Cloning into '/Users/bhensel-ca/.config/nvim/pack/github/start/copilot.vim'...
remote: Enumerating objects: 485, done.
remote: Counting objects: 100% (169/169), done.
remote: Compressing objects: 100% (81/81), done.
remote: Total 485 (delta 111), reused 127 (delta 79), pack-reused 316
Receiving objects: 100% (485/485), 11.69 MiB | 23.56 MiB/s, done.
Resolving deltas: 100% (255/255), done.
bhensel-ca@Bentleys-MacBook-Pro Meta % nvim

bhensel-ca@Bentleys-MacBook-Pro Meta % ls
bhensel-ca@Bentleys-MacBook-Pro Meta % nvim
bhensel-ca@Bentleys-MacBook-Pro Meta %
