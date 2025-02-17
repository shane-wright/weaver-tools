# Tauri + Vanilla

This template should help get you started developing with Tauri in vanilla HTML, CSS and Javascript.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Setup

1. Ensure Rust and Cargo are installed: Follow the instructions at [rustup.rs](https://rustup.rs/) to install Rust and Cargo.
2. Install Tauri CLI:
    ```sh
    cargo install tauri-cli --version ^2.0.0
    ```

## Build

To build the Tauri application:
```sh
cargo tauri build
```

## Run

To run the Tauri application:
```sh
cargo tauri dev
```

## Deploy

After building, you can find the distributable package in the `src-tauri/target/release/bundle` directory. Deploy the files following Tauri's guidelines for your specific platform needs.
