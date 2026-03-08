using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class SceneDocument
    {
        public string Id { get; set; } = "default";

        public string Name { get; set; } = "Starter Scene";

        public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

        public List<SceneObject> Objects { get; set; } = new List<SceneObject>();
    }

    public class SceneObject
    {
        public string Id { get; set; }

        public string Type { get; set; }

        public Vector3 Position { get; set; } = new Vector3();

        public Vector3 Rotation { get; set; } = new Vector3();

        public Vector3 Scale { get; set; } = new Vector3
        {
            X = 1,
            Y = 1,
            Z = 1
        };

        public string Color { get; set; } = "#f97316";
    }

    public class Vector3
    {
        public double X { get; set; }

        public double Y { get; set; }

        public double Z { get; set; }
    }
}
