# 🚗 Logity - AI-Powered Automotive Log Analysis

An AI-powered tool that analyzes automotive logs (CAN, DoIP, DLT), detects faults, and delivers plain-language explanations and fixes—streamlining debugging for engineers.

## 🏗️ Project Structure (Monorepo)

```
logity/
├── backend/                    # Python FastAPI + AI processing
├── frontend/
│   ├── desktop/               # 🖥️ Tauri desktop application
│   │   ├── src-tauri/         # Rust/Tauri backend
│   │   ├── src/               # SvelteKit frontend
│   │   └── package.json       # Desktop app dependencies
│   ├── web/                   # 🌐 Landing page & web app
│   │   ├── index.html         # Landing page
│   │   ├── src/               # CSS & JavaScript
│   │   └── package.json       # Web app dependencies
│   └── shared/                # 🤝 Shared utilities & components
│       ├── config/            # Environment configuration
│       ├── utils/             # File handling, API client
│       └── components/        # Reusable UI components (future)
├── docs/                      # Documentation
├── scripts/                   # Setup and build scripts
├── data/                      # Sample data and databases
├── pnpm-workspace.yaml        # Monorepo workspace configuration
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher [Download](https://nodejs.org/)
- **pnpm**: Package manager `npm install -g pnpm` [Installation](https://pnpm.io/installation)
- **Rust**: For desktop app only [Installation](https://rustup.rs/)
- **Python**: 3.9+ for backend [Download](https://python.org/)
- **Platform-specific dependencies** (for desktop app):
  - Windows: Microsoft Visual Studio C++ Build Tools
  - macOS: Xcode Command Line Tools
  - Linux: Various dependencies (see [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

### 1. Clone and Setup

```powershell
# Clone the repository
git clone https://github.com/yourusername/logity.git
cd logity

# Install all dependencies (from project root)
pnpm install
```

### 2. Quick Commands (Workspace)

```powershell
# Start web development server
pnpm dev

# Start desktop application
pnpm dev:desktop

# Start backend API server
pnpm dev:backend

# Build all packages
pnpm build

# Clean all packages
pnpm clean
```

### 3. Detailed Setup (Optional)

For detailed setup instructions for each component, see the package-specific READMEs:

- **Desktop App**: [frontend/desktop/README.md](frontend/desktop/README.md)
- **Web App**: [frontend/web/README.md](frontend/web/README.md)
- **Backend API**: [backend/README.md](backend/README.md)
- **Shared Utilities**: [frontend/shared/README.md](frontend/shared/README.md)

#### Quick Individual Setup

**Desktop Application:**

```powershell
cd frontend\desktop
pnpm install
pnpm run tauri  # Starts SvelteKit + Tauri app
```

**Web Landing Page:**

```powershell
cd frontend\web
pnpm install
pnpm dev  # Available at http://localhost:3000
```

**Backend API:**

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py  # Available at http://localhost:8000
```

## 🛠️ Development Workflow

### Workspace Management

This project uses pnpm workspaces for efficient monorepo management:

```powershell
# Install dependencies for all packages
pnpm install

# Run command in specific package
pnpm --filter logity-landing dev
pnpm --filter frontend tauri

# Run command in all packages
pnpm --recursive build
pnpm --recursive lint
pnpm --recursive test

# Clean all packages
pnpm clean
```

### Package-Specific Development

**Desktop App Development:**

```powershell
cd frontend\desktop
pnpm run tauri      # Development mode (hot reload)
pnpm run check      # SvelteKit type checking
pnpm run lint       # ESLint + Prettier
pnpm run build      # Production build
```

**Web App Development:**

```powershell
cd frontend\web
pnpm dev           # Development server
pnpm build         # Production build
pnpm preview       # Preview production build
```

**Backend Development:**

```powershell
cd backend
python main.py     # Development server with auto-reload
pytest            # Run tests
black app/         # Format code
```

### Working with Shared Utilities

The `frontend/shared/` directory contains reusable code:

```typescript
// Import shared configuration
import { getConfig, isFeatureEnabled } from "@logity/shared/config";

// Import file utilities
import { validateFile, formatFileSize } from "@logity/shared/utils";

// Import API client
import { createApiClient } from "@logity/shared/utils/api-client";
```

## 📦 Building for Production

### Desktop Application

```powershell
cd frontend\desktop
pnpm run build          # Build SvelteKit frontend
pnpm run tauri build    # Build Tauri application
```

Outputs:

- Windows: `.msi` installer in `src-tauri/target/release/bundle/msi/`
- macOS: `.dmg` and `.app` in `src-tauri/target/release/bundle/`
- Linux: `.deb`, `.AppImage` in `src-tauri/target/release/bundle/`

### Web Landing Page

```powershell
cd frontend\web
pnpm build
```

Output: Static files in `dist/` directory, ready for deployment to:

- Vercel, Netlify, Cloudflare Pages
- Any static hosting service

## 🔧 Tech Stack

### Frontend (Desktop)

- **Tauri**: Native desktop application framework
- **SvelteKit**: Modern web framework for the UI
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Monaco Editor**: Code editor for log viewing
- **React Flow**: Network diagrams (as Web Component)

### Frontend (Web)

- **Vite**: Fast build tool and dev server
- **HTML5/CSS3**: Modern web standards
- **Vanilla JavaScript**: Lightweight interactions
- **Responsive Design**: Mobile-friendly layout

### Backend

- **Python FastAPI**: High-performance web framework
- **LLMs**: OpenAI API or local models for AI analysis
- **Apache Arrow**: In-memory data processing
- **PostgreSQL**: Configuration and user data
- **FAISS**: Vector database for similarity search

### Parser Engine

- **Rust**: High-performance log parsing
- **socketcan**: CAN bus protocol support
- **pcap**: Network packet analysis
- **Custom DoIP parser**: Automotive diagnostics

## 🐛 Troubleshooting

### Desktop App Issues

```powershell
# Clear all caches and reinstall
cd frontend\desktop
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
Remove-Item -Recurse -Force src-tauri\target
pnpm install
pnpm run tauri
```

### Windows Rust Toolchain Issues (dlltool.exe Error)

If you encounter the error `Error calling dlltool 'dlltool.exe': program not found` when building the Tauri app on Windows:

**Root Cause:** You're using the GNU toolchain which requires MinGW-w64 tools that aren't installed.

**Solution:**

```powershell
# 1. Switch to MSVC toolchain (recommended for Windows)
rustup default stable-x86_64-pc-windows-msvc

# 2. Clean previous build artifacts
cd frontend\desktop\src-tauri
cargo clean

# 3. Try building again
cargo build
```

**Why This Works:**

- The MSVC toolchain uses Microsoft's native Windows build tools
- It doesn't require additional MinGW-w64 dependencies like `dlltool.exe`
- It's the recommended toolchain for Windows Tauri development

**Alternative Solution (if you need GNU toolchain):**
Install MinGW-w64 via MSYS2 or similar package manager.

**Prevention:**
Add a `rust-toolchain.toml` file to your project root:

```toml
[toolchain]
channel = "stable"
targets = ["x86_64-pc-windows-msvc"]
```

### Web App Issues

```powershell
# Clear cache and reinstall
cd frontend\web
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml
pnpm install
pnpm dev
```

### Common Path Issues

If you encounter path-related errors after moving files:

1. Clear all `node_modules` directories
2. Delete all `pnpm-lock.yaml` files
3. Clear Rust build cache: `cargo clean` in `src-tauri/`
4. Reinstall: `pnpm install` from project root

## 📊 Database Parser

This tool parses various types of diagnostic data from CarCom reports into structured JSON or JSONL format.

### Generating Reports from CarCom

To generate the required reports from CarCom:

1. Open CarCom and navigate to the desired Software Component (e.g., "BCMA 32333544 AK")
2. Right-click on the component and select:
   - Report
   - Create Diagnostic Report
   - All Reports
   - Click OK
3. Save the generated report with the name of the ECU (e.g., "BCMA.xlsx")

### Available Parsers

- **ControlRoutineParser**: Extracts control routine information
- **DIDParser**: Extracts Diagnostic Identifier (DID) information
- **DTCParser**: Extracts Diagnostic Trouble Code (DTC) information
- **DatabaseParser**: Combines all parsers for comprehensive ECU data

### Usage Examples

```python
from scripts.database_parser import DatabaseParser

# Create a parser instance
parser = DatabaseParser()

# Process a single file
data = parser.process_excel_file("path/to/excel.xlsx")
parser.save_to_json(data, "path/to/excel.xlsx")  # Save as JSON
parser.save_to_jsonl(data, "path/to/excel.xlsx") # Save as JSONL

# Process all Excel files in a directory and create a consolidated database
parser.process_excel_directory("path/to/excel/files")
```

### Output Formats

- **JSON**: Structured JSON file with arrays of control routines, DIDs, and DTCs
- **JSONL**: Each object stored on a separate line for efficient processing
- **Output Locations**:
  - Individual files: `data/work-in-progress/{filename}.json`
  - Consolidated database: `data/ecu-database.jsonl`

## 🎯 Supported Protocols

- **CAN Bus**: Controller Area Network protocol
- **DoIP**: Diagnostics over Internet Protocol
- **DLT**: Diagnostic Log and Trace
- **PCAP**: Packet capture files
- **LIN**: Local Interconnect Network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes in the appropriate directory:
   - Desktop app: `frontend/desktop/`
   - Web app: `frontend/web/`
   - Shared utilities: `frontend/shared/`
   - Backend: `backend/`
4. Test your changes thoroughly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the [Logity Repository License](./LICENSE.md). Please read and acknowledge the license before contributing.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

---

**Made with ❤️ for automotive engineers who demand precision in their debugging workflow.**
