import { useEffect, useState } from 'react';
import './App.css';
import SceneViewport from './components/SceneViewport';

const DEFAULT_SCENE_ID = 'default';

function createObject(type, index) {
  const palette = {
    box: '#f97316',
    sphere: '#0ea5e9',
  };

  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    color: palette[type] || '#f97316',
    position: { x: index * 1.5, y: type === 'sphere' ? 0.75 : 0.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  };
}

function clampScale(value) {
  return Math.max(0.1, Number(value) || 0);
}

function NumberField({ label, value, onChange, step = '0.1', min }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function App() {
  const [sceneName, setSceneName] = useState('Starter Scene');
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState('Loading default scene...');

  const selectedObject = objects.find((object) => object.id === selectedId) || null;

  useEffect(() => {
    loadScene();
  }, []);

  async function loadScene() {
    setStatus('Loading default scene...');

    try {
      const response = await fetch(`/api/scenes/${DEFAULT_SCENE_ID}`);
      const scene = await response.json();
      setSceneName(scene.name);
      setObjects(scene.objects || []);
      setSelectedId(scene.objects?.[0]?.id || null);
      setStatus(`Loaded ${scene.name}`);
    } catch (error) {
      const fallback = [createObject('box', -1), createObject('sphere', 1)];
      setSceneName('Local Starter Scene');
      setObjects(fallback);
      setSelectedId(fallback[0].id);
      setStatus('Backend unavailable. Using local starter scene.');
    }
  }

  function addObject(type) {
    const nextObject = createObject(type, objects.length);
    setObjects((current) => [...current, nextObject]);
    setSelectedId(nextObject.id);
    setStatus(`Added ${type}`);
  }

  function updateSelected(path, rawValue) {
    if (!selectedObject) {
      return;
    }

    const [group, axis] = path.split('.');
    const parsed = group === 'scale' ? clampScale(rawValue) : Number(rawValue);
    const value = Number.isFinite(parsed) ? parsed : 0;

    setObjects((current) =>
      current.map((object) =>
        object.id === selectedId
          ? {
              ...object,
              [group]: {
                ...object[group],
                [axis]: value,
              },
            }
          : object
      )
    );
  }

  function updateSelectedColor(color) {
    setObjects((current) =>
      current.map((object) =>
        object.id === selectedId
          ? {
              ...object,
              color,
            }
          : object
      )
    );
  }

  function removeSelected() {
    if (!selectedObject) {
      return;
    }

    const nextObjects = objects.filter((object) => object.id !== selectedId);
    setObjects(nextObjects);
    setSelectedId(nextObjects[0]?.id || null);
    setStatus(`Removed ${selectedObject.id}`);
  }

  async function saveScene() {
    setStatus('Saving scene...');

    try {
      const response = await fetch(`/api/scenes/${DEFAULT_SCENE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: DEFAULT_SCENE_ID,
          name: sceneName,
          objects,
        }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      const scene = await response.json();
      setSceneName(scene.name);
      setObjects(scene.objects || []);
      setSelectedId(scene.objects?.[0]?.id || null);
      setStatus(`Saved ${scene.name}`);
    } catch (error) {
      setStatus('Save failed. Check backend availability.');
    }
  }

  return (
    <div className="app-shell">
      <aside className="panel panel-left">
        <div>
          <p className="eyebrow">Modeling App</p>
          <h1>Scene Editor</h1>
        </div>

        <label className="field">
          <span>Scene name</span>
          <input
            type="text"
            value={sceneName}
            onChange={(event) => setSceneName(event.target.value)}
          />
        </label>

        <div className="button-row">
          <button type="button" onClick={() => addObject('box')}>
            Add Cube
          </button>
          <button type="button" onClick={() => addObject('sphere')}>
            Add Sphere
          </button>
        </div>

        <div className="button-row">
          <button type="button" onClick={saveScene}>
            Save Scene
          </button>
          <button type="button" onClick={loadScene}>
            Reload
          </button>
        </div>

        <p className="status" aria-live="polite">
          {status}
        </p>

        <div className="object-list">
          {objects.map((object) => (
            <button
              key={object.id}
              type="button"
              className={`object-card ${object.id === selectedId ? 'selected' : ''}`}
              onClick={() => setSelectedId(object.id)}
            >
              <span>{object.type}</span>
              <span>{object.id}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="viewport">
        <SceneViewport objects={objects} selectedId={selectedId} onSelect={setSelectedId} />
      </main>

      <aside className="panel panel-right">
        <div>
          <p className="eyebrow">Inspector</p>
          <h2>{selectedObject ? selectedObject.id : 'No selection'}</h2>
        </div>

        {selectedObject ? (
          <>
            <div className="field-group">
              <h3>Position</h3>
              <NumberField label="X" value={selectedObject.position.x} onChange={(value) => updateSelected('position.x', value)} />
              <NumberField label="Y" value={selectedObject.position.y} onChange={(value) => updateSelected('position.y', value)} />
              <NumberField label="Z" value={selectedObject.position.z} onChange={(value) => updateSelected('position.z', value)} />
            </div>

            <div className="field-group">
              <h3>Rotation</h3>
              <NumberField label="X" value={selectedObject.rotation.x} onChange={(value) => updateSelected('rotation.x', value)} />
              <NumberField label="Y" value={selectedObject.rotation.y} onChange={(value) => updateSelected('rotation.y', value)} />
              <NumberField label="Z" value={selectedObject.rotation.z} onChange={(value) => updateSelected('rotation.z', value)} />
            </div>

            <div className="field-group">
              <h3>Scale</h3>
              <NumberField label="X" value={selectedObject.scale.x} min="0.1" onChange={(value) => updateSelected('scale.x', value)} />
              <NumberField label="Y" value={selectedObject.scale.y} min="0.1" onChange={(value) => updateSelected('scale.y', value)} />
              <NumberField label="Z" value={selectedObject.scale.z} min="0.1" onChange={(value) => updateSelected('scale.z', value)} />
            </div>

            <label className="field">
              <span>Color</span>
              <input type="color" value={selectedObject.color} onChange={(event) => updateSelectedColor(event.target.value)} />
            </label>

            <button type="button" className="danger" onClick={removeSelected}>
              Delete Object
            </button>
          </>
        ) : (
          <p className="empty-state">Select an object in the viewport or list to edit it.</p>
        )}
      </aside>
    </div>
  );
}

export default App;
