# AGENTS.md

## Project Overview

This repository is a small full-stack 3D scene editor.

- `Backend/` is an ASP.NET Core Web API targeting `.NET 9`
- `frontend/` is a Create React App application using React 19, Three.js, `@react-three/fiber`, and `@react-three/drei`
- The frontend talks to the backend through `/api/scenes` and proxies requests to `http://localhost:5000`

The current product is a single-scene editor vertical slice:

- load the default scene
- render primitive objects in a 3D viewport
- select objects from the viewport or list
- edit transforms and color
- save the scene back to the backend

## Source Of Truth

Before changing behavior, inspect the current code paths instead of assuming architecture.

- Frontend editor state lives primarily in `frontend/src/App.js`
- Frontend viewport rendering lives in `frontend/src/components/SceneViewport.js`
- Backend scene API lives in `Backend/Controllers/ScenesController.cs`
- Backend scene models live in `Backend/Models/SceneModels.cs`
- Backend storage behavior lives in `Backend/Services/`

## Working Rules

- Make the smallest coherent change that solves the requested problem
- Preserve the existing vertical-slice architecture unless the task explicitly asks for refactoring
- Keep frontend and backend contracts aligned when changing scene payloads
- Do not rewrite unrelated files just to match a preferred style
- Avoid introducing new dependencies unless they are clearly justified
- Prefer fixing the underlying behavior over adding workaround code

## Frontend Guidance

- Keep editor-state changes centralized in `frontend/src/App.js` unless there is a clear reason to extract logic
- Treat selection, object editing, loading, and saving as user-critical flows; do not regress them
- When changing `SceneViewport`, preserve object selection behavior, camera controls, and basic scene readability
- Prefer straightforward React patterns that fit the existing codebase over premature abstraction
- Keep styling changes consistent with the current visual language unless a redesign is requested

## Backend Guidance

- Keep API routes under `/api/scenes` unless the task explicitly changes the API surface
- Preserve existing response shapes unless corresponding frontend updates are included
- Validate request data when adding new write paths
- Keep repository behavior simple; this backend currently uses in-memory storage

## Files And Directories To Treat Carefully

- Do not edit generated or dependency folders unless the task explicitly requires it:
  - `frontend/node_modules/`
  - `frontend/build/`
  - `Backend/bin/`
  - `Backend/obj/`
- Prefer editing source files and letting build tools regenerate outputs

## Local Validation

Use the narrowest validation that matches the change.

From the repo root:

```powershell
dotnet build Backend\Backend.csproj
```

From `frontend/`:

```powershell
npm test -- --watchAll=false --runInBand
npm run build
```

For end-to-end manual verification, run both apps:

```powershell
dotnet run --project Backend\Backend.csproj
```

```powershell
npm start
```

Then verify:

- the frontend loads the default scene
- selecting an object updates the inspector
- editing transform or color updates the viewport
- saving and reloading preserves scene changes

## Preferred Change Pattern

When implementing a feature or fix:

1. Identify whether the change is frontend-only, backend-only, or contract-affecting.
2. Update the smallest relevant source files.
3. Run targeted validation.
4. Summarize user-visible behavior changes and any remaining risks.

## If Requirements Are Ambiguous

- Prefer preserving current behavior over speculative expansion
- If a change could break the frontend-backend scene contract, call that out explicitly
- If a request implies a larger architectural shift, propose it before executing a broad rewrite
