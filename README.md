# FileBud Frontend

FileBud is a React, Vite, Redux Toolkit, and Tailwind CSS frontend for a cloud storage application with authenticated file and folder management. It provides the browser UI for signing in, navigating a hierarchical drive, creating folders, uploading files, previewing supported media, downloading signed files, and viewing account storage usage returned by the backend.

This repository contains the frontend only. It expects the FileBud backend API to handle authentication, folder hierarchy, uploads, signed Cloudinary media delivery, thumbnails, video stream URLs, recursive deletion, and quota accounting.

**Status:** The frontend MVP implements the current file-management UI scope. Production hardening, stronger validation, automated testing, accessibility review, and large-folder UX improvements remain in progress.

## Live Demo

- Frontend: [https://file-bud-frontend.vercel.app/](https://file-bud-frontend.vercel.app/)
- Backend API: Deployed on Render

## Highlights

- React 18 single-page application built with Vite
- Route-based public and authenticated pages with React Router
- Client-side auth guard for drive routes
- Redux Toolkit state for authenticated user, root folder, and storage usage
- Axios API modules configured for credentialed cookie requests
- Root drive view backed by the authenticated user's root folder
- Nested folder navigation through `/folders/:folderId`
- Folder creation inside the active folder
- Single-file multipart upload into the active folder
- Image and video thumbnails loaded through the backend thumbnail endpoint
- Signed image preview and signed file download flows
- Video playback through backend-provided stream URLs using Vidstack
- File deletion with confirmation
- Compact storage used/max storage display in the authenticated header
- Vercel SPA rewrite for direct client-route navigation

## Features

### Authentication

- Register users with full name, email, and password
- Login with email and password
- Login as a guest using hard-coded demo credentials
- Fetch the current authenticated user on app load
- Store authenticated user, root folder ID, and storage values in Redux
- Redirect unauthenticated users away from drive routes
- Redirect authenticated users away from login and registration pages
- Logout through the header

Authentication is cookie-based from the frontend perspective. Axios sets `withCredentials = true`, and the frontend does not store access or refresh tokens in local storage.

### File Manager

- Display the root folder as "My Drive"
- Fetch one folder at a time from the backend
- Render direct subfolders and direct files returned by the folder fetch response
- Navigate into folders by route ID
- Use mobile click and desktop double-click behavior for opening folders/files
- Show loading spinners while folder data is loading
- Show empty states for empty root and nested folders

The frontend does not currently maintain a full folder-tree cache, breadcrumb trail, sorting, filtering, or search.

### Files

- Upload one file at a time with `FormData`
- Associate uploads with the active folder ID
- Display file cards with type icons and thumbnails
- Preview images through signed access URLs returned by the backend
- Play videos through signed stream URLs returned by the backend
- Download files through signed attachment URLs returned by the backend
- Delete files with a confirmation dialog
- Display file details such as name, type, format, size, and duration when available

Unsupported preview types show a basic alert instead of a document viewer or fallback preview screen.

### Folders

- Create child folders under the active folder
- Display folder cards with folder icons and titles
- Navigate into nested folders through `/folders/:folderId`
- Delete folders from the folder options menu

Folder deletion does not currently show a confirmation dialog or recursive-delete warning in the frontend.

### Storage Usage

- Read `storageUsed` and `maxStorage` from authenticated user responses
- Show used/max storage in GB in the authenticated header
- Increment displayed storage usage after a successful upload

The frontend does not currently block uploads before submission based on quota, and it does not immediately decrement the storage display after deletion.

### Media Delivery

- Load image and video thumbnails from `/api/v1/files/thumbnail/:fileId`
- Request signed image access URLs from `/api/v1/files/fetch`
- Request signed download URLs from `/api/v1/files/download`
- Request signed video stream URLs from `/api/v1/files/stream`
- Render video playback with `@vidstack/react`

The `hls.js` package is installed, but the current player component does not directly configure HLS.js. Playback is delegated to Vidstack and browser/player support for the returned stream URL.

## Tech Stack

| Area | Technology |
| --- | --- |
| UI framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router DOM 6 |
| State management | Redux Toolkit and React Redux |
| HTTP client | Axios |
| Styling | Tailwind CSS |
| Headless UI components | `@headlessui/react` |
| Video playback | `@vidstack/react` |
| HLS support package | `hls.js` |
| Loading indicators | `react-loader-spinner` |
| Formatting | Prettier |
| Linting | ESLint |
| Deployment routing | Vercel SPA rewrite |

## Architecture

The implementation keeps page-level orchestration in React pages and component-level interaction logic in focused UI components. There is no separate frontend domain/service layer beyond the Axios API modules.

```text
Browser
  -> Vite React SPA
  -> React Router routes
  -> page components
  -> feature components
  -> Redux user/storage state and local UI state
  -> Axios service modules
  -> FileBud backend API
  -> Cloudinary signed URLs returned or redirected by the backend
```

### Folder View Flow

```text
Authenticated route
  -> read rootFolderId or folderId route param
  -> fetch /api/v1/folders/fetch/:folderId
  -> store folder, files, and subfolders in local page state
  -> render folder cards and file cards
  -> refetch current folder after create/upload/delete operations
```

### Upload Flow

```text
Upload dialog
  -> user selects one file
  -> create FormData with file and folderId
  -> POST /api/v1/files/upload
  -> increment Redux storageUsed by uploaded size
  -> close dialog
  -> refetch current folder contents
```

### Preview and Download Flow

```text
File card action
  -> image: request signed access URL and open image modal
  -> video: request signed stream URL and open Vidstack player
  -> download: request signed download URL and trigger browser download
```

## Project Structure

```text
.
|-- .env.sample                         Example frontend environment variable
|-- FileBud_Frontend_Technical_Documentation.md
|-- index.html                          Vite HTML entry
|-- package.json                        Dependencies and npm scripts
|-- tailwind.config.js                  Tailwind content paths and theme colors
|-- vercel.json                         SPA fallback rewrite
|-- vite.config.js                      Vite React plugin setup
|-- public/
|   `-- LogoIcon.svg                    Public logo asset
`-- src/
    |-- App.jsx                         Shared app shell and current-user fetch
    |-- App.css                         Global font imports and scrollbar style
    |-- index.css                       Tailwind imports
    |-- main.jsx                        Router and Redux provider setup
    |-- assets/                         UI icons and image assets
    |-- components/
    |   |-- AuthLayout.jsx              Client-side route protection
    |   |-- CreateFolder.jsx            Folder creation dialog
    |   |-- FileCard.jsx                File thumbnail, preview, download, delete
    |   |-- FolderCard.jsx              Folder display, navigation, delete
    |   |-- Player.jsx                  Vidstack video player wrapper
    |   |-- TypeMenu.jsx                Unused type menu placeholder
    |   |-- buttons/                    Reusable buttons and options menu
    |   |-- container/                  Shared layout container
    |   `-- header/                     Header, logo, account badge, search placeholder
    |-- pages/
    |   |-- ErrorPage.jsx               Router error page
    |   |-- FolderPage.jsx              Nested folder file manager
    |   |-- Home.jsx                    Root drive file manager
    |   |-- LandingPage.jsx             Public landing page
    |   |-- Login.jsx                   Login and guest login
    |   `-- Register.jsx                Registration
    |-- services/
    |   |-- file.service.js             File upload, delivery, stream, deletion calls
    |   |-- folder.service.js           Folder fetch, create, deletion calls
    |   `-- user.service.js             Auth and current-user calls
    `-- store/
        |-- folderSlice.js              Folder thunk/reducer, not used by pages
        |-- fileSlice.js                Empty placeholder
        |-- store.js                    Redux store setup
        `-- userSlice.js                User, auth, and storage state
```

## Route Overview

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public-only client redirect | Login and guest login |
| `/register` | Public-only client redirect | Account registration |
| `/home` | Auth-only client redirect | Root drive view |
| `/folders/:folderId` | Auth-only client redirect | Nested folder view |

Route protection is client-side only. Backend API authorization is still required for protected data access.

## API Overview

All API calls use `VITE_API_URL` as the backend origin. The service modules append `/api/v1/...` paths.

| Area | Method | Route | Frontend usage |
| --- | --- | --- | --- |
| Users | `POST` | `/api/v1/users/register` | Register from the registration page |
| Users | `POST` | `/api/v1/users/login` | Login from login or guest-login flow |
| Users | `POST` | `/api/v1/users/logout` | Logout from the header |
| Users | `GET` | `/api/v1/users/getUser` | Restore current user on app load |
| Folders | `POST` | `/api/v1/folders/create` | Create child folder in active folder |
| Folders | `GET` | `/api/v1/folders/fetch/:folderId` | Fetch root or nested folder contents |
| Folders | `DELETE` | `/api/v1/folders/delete` | Delete selected folder |
| Files | `POST` | `/api/v1/files/upload` | Upload multipart field `file` with `folderId` |
| Files | `GET` | `/api/v1/files/fetch?fileId=...` | Get signed image access URL |
| Files | `GET` | `/api/v1/files/download?fileId=...` | Get signed download URL |
| Files | `DELETE` | `/api/v1/files/delete` | Delete selected file |
| Files | `GET` | `/api/v1/files/thumbnail/:fileId` | Load image/video thumbnail |
| Files | `GET` | `/api/v1/files/stream?fileId=...` | Get video stream URL |

The backend also exposes `/api/v1/files/awake`, but the current frontend does not call it.

## Key Frontend Design Decisions

- Use Vite for a simple static SPA deployment model.
- Keep route definitions centralized in `src/main.jsx`.
- Use `AuthLayout` as a client-side route guard instead of route middleware.
- Store authenticated user and storage values in Redux.
- Keep active folder contents in page-local state rather than a normalized global cache.
- Isolate backend calls in small Axios service modules.
- Refetch the active folder after create, upload, and delete operations instead of applying optimistic updates.
- Use backend-generated signed URLs instead of exposing Cloudinary URLs directly in source code.
- Use Headless UI dialogs and menus for modal and options-menu interactions.
- Use Tailwind theme colors for the dark FileBud visual style.

## Local Development

### Prerequisites

- Node.js and npm
- A running FileBud backend API
- Backend CORS configured for the frontend origin
- Backend cookies configured for credentialed browser requests

### Setup

```bash
git clone <your-repository-url>
cd file-bud-frontend
npm install
```

Create a `.env` file from `.env.sample` and set the backend URL:

```bash
VITE_API_URL=http://localhost:8000
```

Run the development server:

```bash
npm run dev
```

Vite commonly serves the app at `http://localhost:5173`.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Public backend API origin used before `/api/v1/...` routes |

`VITE_` variables are exposed to browser code by Vite. Do not store secrets in frontend environment variables.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Vite development server |
| `npm run build` | Build the production static assets |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for JavaScript and JSX files |

The repository does not currently define a test script.

## Production Notes

- Set `VITE_API_URL` to the deployed backend origin.
- Configure the backend `CORS_ORIGIN` to match the deployed frontend origin.
- Ensure backend cookie settings work for the chosen frontend/backend origins.
- Keep `.env` files out of version control.
- Deploy the Vite `dist/` output as static assets.
- Preserve the SPA fallback rewrite so direct visits to `/home` and `/folders/:folderId` load the React app.
- Review browser console logging before production polish.
- Add automated tests for auth redirects, folder rendering, uploads, previews, downloads, and deletion flows.
- Add a consistent user-facing notification system for API failures.
- Add an accessibility pass for dialogs, menus, focus behavior, keyboard navigation, and file-manager interactions.

## Current Scope and Limitations

- Route protection is client-side only.
- No frontend refresh-token flow or token-expiry recovery is implemented.
- No search, sorting, filtering, rename, move, sharing, restore, or bulk-operation UI is present.
- No breadcrumb trail or parent-folder back control is present.
- Upload is single-file only.
- No drag-and-drop upload, resumable upload, chunked upload, retry, cancellation, or progress percentage is present.
- No client-side file size/type validation is performed before upload.
- No quota pre-check blocks oversized uploads before submission.
- Storage usage is incremented after upload but not immediately decremented after file or folder deletion.
- Folder deletion has no confirmation modal or recursive-delete warning.
- No pagination, infinite scrolling, or virtualization is implemented for large folders.
- Nested folder file rendering is capped to the first 20 files in `FolderPage.jsx`.
- Error handling is inconsistent and sometimes console-only.
- No global error boundary, toast system, or offline handling is included.
- No automated test suite is included.
- No accessibility audit has been completed.
- `TypeMenu`, `SearchBar`, and `fileSlice.js` exist as placeholders or unused code paths.

## Technical Documentation

For a deeper implementation-level breakdown, see:

[FileBud_Frontend_Technical_Documentation.md](./FileBud_Frontend_Technical_Documentation.md)

## License

No license file is currently included in this repository. The project is developed for educational and portfolio purposes.
