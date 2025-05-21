# Weaver Mobile

A Tauri-based mobile application for the Weaver Tools suite. This application provides a native mobile interface for Weaver functionality, built using Tauri's mobile capabilities.

## Project Structure

### Frontend (UI)
The user interface is implemented as a web application that runs in a WebView, following strict JavaScript standards and a component-based architecture:

```
/src/
├── features/       # Feature-based components
│   └── greeting/   # Greeting feature component
│       └── index.js
├── managers/       # Application-wide services
│   └── view-manager.js
├── index.html      # Minimal HTML structure
├── main.js         # Application initialization
└── assets/         # Static assets (images, fonts, etc.)
```

The UI follows these key principles:

1. **Component Lifecycle Pattern**
   - Each component implements `init()`, `render()`, and `cleanup()`
   - Components manage their own state and DOM manipulation
   - Clean separation of concerns and proper resource management

2. **Direct DOM Manipulation**
   - No external CSS files or inline styles
   - All styling handled through JavaScript
   - Uses pico.css variables for consistent theming
   - Unique IDs for all HTML elements

3. **Global State Management**
   - Centralized state through `window.tibr` global object
   - Manager pattern for application-wide services
   - Clear component state isolation

4. **View Management**
   - Dynamic component loading
   - Proper view lifecycle handling
   - Managed transitions between views

To modify the user interface:
- Add new features in `/features/{feature-name}/`
- Update component lifecycle methods in feature components
- Add managers for new application-wide services
- Modify `main.js` for initialization changes

### Backend (Native)
Native functionality is implemented in Rust within the `src-tauri` directory:
```
/src-tauri/
├── src/
│   ├── lib.rs      # Native functionality and Tauri commands
│   └── main.rs     # Application entry point and setup
├── Cargo.toml      # Rust dependencies and configuration
└── tauri.conf.json # Tauri configuration
```

The Rust code handles:
- Native API integrations
- System-level operations
- Mobile platform-specific features
- Heavy computation tasks

### Communication Flow
Frontend and backend communicate through Tauri's IPC (Inter-Process Communication) system:

1. **Frontend → Backend**
   ```javascript
   // In main.js
   await invoke('rust_command_name', { arg1: 'value' });
   ```

2. **Backend → Frontend**
   ```rust
   // In lib.rs
   #[tauri::command]
   fn rust_command_name(arg1: String) -> Result<String, String> {
       // Native code here
   }
   ```

3. **Events**
   - Backend can emit events that frontend listens to
   - Useful for async operations and real-time updates
   - Handled through Tauri's event system

The application runs in a WebView on mobile devices, combining web UI capabilities with native performance where needed.

## Current State

- Basic Tauri mobile application setup
- Android deployment configured
- Ready for feature development
- Package name: `com.weaver.mobile.app`

## Prerequisites

- Node.js and npm
- Android SDK with NDK installed
- Android device with USB debugging enabled
- Tauri CLI

### Required Environment Variables

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Android configuration:
```bash
npm run tauri android init
```

## Development Workflow

### First-time Setup

Create a keystore (only needed once):
```bash
keytool -genkey -v -keystore weaver.keystore -alias weaver -keyalg RSA -keysize 2048 -validity 10000
```

### Quick Deployment to Physical Device

One-command deployment (requires existing keystore):
```bash
# From project root
npm run tauri android build && \
"$ANDROID_HOME/build-tools/34.0.0/zipalign" -f -v 4 app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk app-aligned.apk && \
"$ANDROID_HOME/build-tools/34.0.0/apksigner" sign --ks weaver.keystore --ks-key-alias weaver app-aligned.apk && \
adb install app-aligned.apk && \
adb shell am start -n com.weaver.mobile.app/.MainActivity
```

This command sequence:
1. Builds the Android APK
2. Aligns the APK for optimal performance
3. Signs it with your keystore
4. Installs on the connected device
5. Launches the app

### Development Tips

1. Device Connection
   ```bash
   # Verify device connection
   adb devices
   
   # Check if app is installed
   adb shell pm list packages | grep weaver
   
   # Launch app manually
   adb shell am start -n com.weaver.mobile.app/.MainActivity
   ```

2. Clean Build
   ```bash
   # Clean up build artifacts
   cd src-tauri && cargo clean && rm -rf target/ && rm -rf gen/android/.gradle/
   ```

## Troubleshooting

1. **NDK not found**
   - Verify NDK_HOME points to a valid NDK installation
   - Default path: `$ANDROID_HOME/ndk/26.1.10909125`

2. **Device not detected**
   - Enable USB debugging on your device
   - Check USB connection
   - Verify with `adb devices`

3. **Build space issues**
   - Run the clean build command above
   - Ensure adequate disk space for Android builds
