# Tax Tracker Pro - Desktop Application

A standalone desktop application for tracking dual-country (US/UK) self-employment taxes.

## 🌟 Features

- 🏠 **Completely Private**: All data stored locally on your computer
- 🌍 **Dual Country Support**: Handles both US and UK tax requirements
- 💱 **Multi-Currency**: Supports USD and GBP transactions
- 📊 **Smart Allocation**: Automatically allocates transactions to correct tax forms
- 📁 **Export Ready**: Export data as CSV for accountants or tax software
- 🔒 **Secure**: No internet connection required after installation

## 🚀 Quick Start

### Download Pre-built App

1. Go to the [Releases](../../releases) section
2. Download the appropriate file for your operating system:
   - **Windows**: `Tax-Tracker-Pro-Setup-x.x.x.exe`
   - **macOS**: `Tax-Tracker-Pro-x.x.x.dmg`
   - **Linux**: `Tax-Tracker-Pro-x.x.x.AppImage`
3. Install and run the application

### Build from Source

1. Make sure you have Node.js installed (version 16 or higher)
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the desktop app:
   ```bash
   npm run dist
   ```
5. Find your built app in the `dist-electron` folder

## 💡 How It Works

### Currency Logic
- **GBP Income/Expenses**: Automatically appear on both US and UK tax forms
- **USD Income/Expenses**: Only appear on US tax forms
- **US Tax Requirement**: Must report worldwide income (including UK earnings)
- **UK Tax Requirement**: Only report UK-sourced income

### Data Storage
All your tax data is stored locally in your computer's application data folder:
- **Windows**: `%APPDATA%/Tax Tracker Pro`
- **macOS**: `~/Library/Application Support/Tax Tracker Pro`
- **Linux**: `~/.config/Tax Tracker Pro`

### Export Options
Export your data as CSV files that can be:
- Imported into Google Sheets or Excel
- Sent directly to your accountant
- Used with tax preparation software

## 📅 Tax Year Support

- **US Tax Years**: Calendar year (Jan 1 - Dec 31)
- **UK Tax Years**: April 6 - April 5 of following year
- **Automatic Detection**: Current tax year is automatically selected
- **Historical Data**: Track up to 5 years of tax data

## 🔒 Security & Privacy

- ✅ No data sent to external servers
- ✅ No internet connection required after installation
- ✅ All data encrypted and stored locally
- ✅ No tracking or analytics
- ✅ Open source - you can verify the code

## 🛠️ Development

To run the app in development mode:

```bash
npm run electron-dev
```

This will start both the web server and the Electron app with hot reloading.

## 📄 License

MIT License - Feel free to modify and distribute.

## 🆘 Support

This is a self-contained application designed for freelancers and contractors who need to file taxes in both the US and UK.

For technical issues, check the logs in your application data folder.