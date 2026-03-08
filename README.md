# ModelingApp

ModelingApp is an early-stage 3D scene editor built with a React frontend and an ASP.NET Core backend.

Backend development now targets the .NET 9 SDK.

The current vertical slice supports:

- loading a default scene from the backend
- rendering simple 3D primitives through a dedicated Three.js viewport
- selecting objects from the viewport or object list
- editing position, rotation, scale, and color
- saving the scene back to the backend

## Project Structure

`Backend/`

- ASP.NET Core Web API
- exposes scene endpoints under `/api/scenes`
- currently uses in-memory storage

`frontend/`

- React application created with Create React App
- uses `three`, `@react-three/fiber`, and `@react-three/drei`
- keeps editor state in `src/App.js` and scene rendering in `src/components/SceneViewport.js`
- proxies API calls to `http://localhost:5000`

## Current Architecture

The backend provides a minimal scene document model:

- scene id
- scene name
- updated timestamp
- a list of scene objects

Each scene object contains:

- id
- type (`box` or `sphere`)
- position
- rotation
- scale
- color

The frontend loads `/api/scenes/default`, renders the scene, and lets you edit and save it.

The viewport is driven by React Three Fiber on top of Three.js and currently includes:

- orbit camera controls
- environment and directional lighting
- ground grid, fog, and shadow plane
- selected-object highlighting
- axes helper for spatial orientation

## Running Locally

Start the backend first, then the frontend.

### Backend

From the repository root:

```powershell
dotnet run --project Backend\Backend.csproj
```

The backend runs on:

- `http://localhost:5000`
- `https://localhost:5001`

### Frontend

From the `frontend` folder:

```powershell
npm install
npm start
```

The frontend runs on:

- `http://localhost:3000`

Because `frontend/package.json` defines a proxy, API requests to `/api/...` are forwarded to the backend running on port `5000`.

If both servers are running, open:

- `http://localhost:3000`

## Useful Commands

From the repo root:

```powershell
dotnet build Backend\Backend.csproj
```

From `frontend/`:

```powershell
npm test -- --watchAll=false --runInBand
npm run build
```

## API

### Get a scene

```http
GET /api/scenes/{id}
```

### Save a scene

```http
POST /api/scenes/{id}
Content-Type: application/json
```

Example payload:

```json
{
  "id": "default",
  "name": "Starter Scene",
  "objects": [
    {
      "id": "cube-1",
      "type": "box",
      "position": { "x": 0, "y": 0.5, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 },
      "color": "#f97316"
    }
  ]
}
```

## Next Steps

Good next features for this project:

- transform gizmos for direct manipulation
- undo/redo
- persistent storage with a database
- scene import/export
- more primitive and material types
- camera presets and viewport tools
- richer material and environment controls
