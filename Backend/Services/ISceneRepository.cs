using Backend.Models;

namespace Backend.Services
{
    public interface ISceneRepository
    {
        SceneDocument Get(string id);

        SceneDocument Save(string id, SceneDocument scene);
    }
}
