# Browse Buddy

## Install

```bash
npm i
```

## Start

# Requirements

- Required chromium
- Extract .zip files and copy the folder to the resources path project
- Download for [Windows](https://download-chromium.appspot.com/dl/Win_x64?type=snapshots)
- Download for [Linux](https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots)

### Linux users

```bash
npm run dev
```

### Windows users

- Change settings in the .env file

From EXEC=./resources/chrome-linux/chrome to EXEC=./resources/chrome-win/chrome.exe

```bash
npm run dev
```

# Build

## Build on Windows

```bash
npm run build-win
```

portable mode

```bash
npm run build-win-portable
```

## Build on Linux

```bash
npm run build-linux
```

## Author

- Charles Lana

## Frameworks

- Vite
- Vue3
- Electron
- Typescript
- Puppeteer
