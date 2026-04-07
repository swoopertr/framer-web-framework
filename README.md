# Framer

The simplest and no-deps web framework ever.

## Overview

Framer is a lightweight, minimalist web framework for Node.js that draws inspiration from ASP.NET MVC architecture. Build REST APIs, HTTP sites, or both with zero configuration required.

## Installation

```bash
npm install
```

## Quick Start

```bash
npm start
```

Visit `http://localhost:8080` (or your configured port)

## Project Structure

```
framer-web-framework/
├── index.js                    # Server bootstrap
├── src/
│   ├── Core.js                 # Core utilities
│   ├── route.js                # Route handling
│   ├── Util.js                 # Utilities (JWT, OAuth)
│   ├── Config/
│   │   ├── setting.js          # Configuration
│   │   └── Routes.json         # Route definitions
│   ├── Controller/             # Your controllers
│   ├── Bussiness/              # Business logic
│   ├── Middleware/             # Middleware components
│   ├── Data/                   # Data layer
│   └── Helper/                 # Helper utilities
└── Presentation/
    ├── assets/                 # Static assets (css, js)
    ├── Pages/                  # Templates and views
    └── Download/               # File upload storage
```

## Features

| Feature                 | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| **MVC Architecture**    | ASP.NET MVC-like structure with Controllers, Views, and business logic separation |
| **Dynamic Routing**     | Routes defined in JSON with runtime hot-reload                                    |
| **Template Engine**     | Custom `.tht` templates with embedded JavaScript (`<% %>`)                        |
| **Session Management**  | Cookie-based session handling                                                     |
| **Cookie Support**      | Full cookie get/set/remove functionality                                          |
| **File Uploads**        | Formidable-based multipart file upload handling                                   |
| **Rate Limiting**       | Built-in DDoS protection with configurable limits                                 |
| **JWT Authentication**  | Token validation and generation utilities                                         |
| **Google OAuth**        | Ready-to-use Google authentication helpers                                        |
| **PostgreSQL Support**  | Database connection and query helpers                                             |
| **Cluster Mode**        | Multi-process server for multi-CPU utilization                                    |
| **Static File Serving** | Virtual path mapping for assets                                                   |
| **Caching System**      | In-memory caching with TTL support                                                |
| **View Partials**       | Reusable HTML partials and master layouts                                         |

## Configuration

### Routes (`src/Config/Routes.json`)

Define your routes in JSON format. Changes to this file are reloaded automatically.

```json
{
  "path": "/home",
  "method": "get",
  "controller": "home",
  "function": "main",
  "isCached": false
}
```

Route options:

- `path` - URL path
- `method` - HTTP method (get, post, put, delete)
- `controller` - Controller filename (without .js)
- `function` - Exported function name
- `isCached` - Enable view caching
- `file` - Enable file upload handling
- `security` - Enable token authentication (boolean or object)

### Settings (`src/Config/setting.js`)

Configure your environment:

```javascript
exports.cpuCount = 0; // 0 = auto-detect CPU cores
exports.ServerPort = 8080; // Port (also reads PORT env var)
exports.root = "/Presentation/";
exports.viewFolder = "/Presentation/Pages/";
exports.allViewFolder = "/Presentation/Pages/views/";
exports.controllerFolder = "./src/Controller/";
exports.jsonPath = "/src/Config/Routes.json";
exports.errorController = "./src/Controller/error";
exports.downloadFolder = "./Presentation/Download/";
exports.virtualRootPath = "/virt/";
exports.tokenExpireTimeLimit = "24h";
```

## Template Engine

Framer uses `.tht` template files with embedded JavaScript:

```html
<html>
  <head>
    <title><%= this.title %></title>
  </head>
  <body>
    <h1><%= this.message %></h1>

    <% for (let i = 0; i < this.items.length; i++) { %>
    <li><%= this.items[i] %></li>
    <% } %> <%%partialName%%>
    <!-- Include partial -->
  </body>
</html>
```

## Controller Example

```javascript
// src/Controller/home.js
exports.main = function (req, res) {
  res.render("home/main", {
    title: "Welcome",
    message: "Hello from Framer!",
  });
};
```

## Middleware

Middleware runs in order:

1. Rate Limiter
2. Cache
3. Session
4. Cookie
5. Header
6. MIME Filter
7. Route Handler

## Scripts

```bash
npm start          # Start production server
npm run debug      # Start in debug mode
npm run format     # Format code with Prettier
npm run build_image   # Build Docker image
npm run run_image     # Run Docker container
```
