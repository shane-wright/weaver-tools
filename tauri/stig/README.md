# STIG AI CHAT

## rust

Install <a href="https://www.rust-lang.org/tools/install">rust</a>

## tauri

Install tauri-cli via cargo

```
cargo install tauri-cli
```

## ollama

Install <a href="https://ollama.com/">ollama</a>

Pull granite3.1-dense:2b

```
ollama pull granite3.1-dense:2b
```

## weaver-tools

```
cd ~/workspace/weaver-tools
git pull
```

## dev

```
cd ~/workspace/weaver-tools/tauri/stig
cargo tauri dev
```

## build/install

```
cd ~/workspace/weaver-tools/tauri/stig
cargo tauri build
```

## Setup

### Linux Setup

You will need:

- Pandoc

This guide is based on Ubuntu, for other OS, use their package manager instead.

```
sudo apt install pandoc -y
```

- pdflatex and font, get it from textlive

```
sudo apt-get -y install texlive-latex-recommended \
  texlive-pictures texlive-latex-extra texlive-fonts-recommended
```

### Mac Setup

You will need:

- Pandoc

Install via Homebrew:

```
brew install pandoc
```

- brew install basictex

After installation, update tlmgr and install additional packages:

```
sudo tlmgr update --self
sudo tlmgr install latexmk
sudo tlmgr install collection-latexrecommended
sudo tlmgr install collection-fontsrecommended
sudo tlmgr install texliveonfly
```

## Windows Setup

### Microsoft C++ Build Tools

Download the <a href="https://visualstudio.microsoft.com/visual-cpp-build-tools/">Microsoft C++ Build Tools</a> installer and open it to begin installation.
During installation check the “Desktop development with C++” option.

### choco

Install <a href="https://chocolatey.org/install">Chocolatey</a>

You will need:

- Pandoc
- basictex
- After installation, update tlmgr and install additional packages:

```
tlmgr update --self
tlmgr install latexmk
tlmgr install collection-latexrecommended
tlmgr install collection-fontsrecommended
tlmgr install texliveonfly
```
