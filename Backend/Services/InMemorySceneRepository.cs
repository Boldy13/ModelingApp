using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    public class InMemorySceneRepository : ISceneRepository
    {
        private readonly ConcurrentDictionary<string, SceneDocument> scenes =
            new ConcurrentDictionary<string, SceneDocument>();

        public InMemorySceneRepository()
        {
            var defaultScene = CreateDefaultScene();
            scenes[defaultScene.Id] = defaultScene;
        }

        public SceneDocument Get(string id)
        {
            return scenes.GetOrAdd(id, CreateDefaultScene);
        }

        public SceneDocument Save(string id, SceneDocument scene)
        {
            scene.Id = string.IsNullOrWhiteSpace(id) ? "default" : id;
            scene.Name = string.IsNullOrWhiteSpace(scene.Name) ? "Untitled Scene" : scene.Name;
            scene.Objects = scene.Objects ?? new List<SceneObject>();
            scene.UpdatedAtUtc = DateTime.UtcNow;

            scenes[scene.Id] = scene;

            return scene;
        }

        private static SceneDocument CreateDefaultScene(string id = "default")
        {
            return new SceneDocument
            {
                Id = string.IsNullOrWhiteSpace(id) ? "default" : id,
                Name = "Starter Scene",
                UpdatedAtUtc = DateTime.UtcNow,
                Objects = new List<SceneObject>
                {
                    new SceneObject
                    {
                        Id = "cube-1",
                        Type = "box",
                        Color = "#f97316",
                        Position = new Vector3 { X = -1.5, Y = 0.5, Z = 0 },
                        Scale = new Vector3 { X = 1, Y = 1, Z = 1 }
                    },
                    new SceneObject
                    {
                        Id = "sphere-1",
                        Type = "sphere",
                        Color = "#0ea5e9",
                        Position = new Vector3 { X = 1.5, Y = 0.75, Z = 0 },
                        Scale = new Vector3 { X = 1.2, Y = 1.2, Z = 1.2 }
                    }
                }
            };
        }
    }
}
