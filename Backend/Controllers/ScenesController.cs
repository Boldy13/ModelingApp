using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/scenes")]
    [ApiController]
    public class ScenesController : ControllerBase
    {
        private readonly ISceneRepository sceneRepository;

        public ScenesController(ISceneRepository sceneRepository)
        {
            this.sceneRepository = sceneRepository;
        }

        [HttpGet("{id}")]
        public ActionResult<SceneDocument> Get(string id)
        {
            return Ok(sceneRepository.Get(id));
        }

        [HttpPost("{id}")]
        public ActionResult<SceneDocument> Save(string id, [FromBody] SceneDocument scene)
        {
            if (scene == null)
            {
                return BadRequest();
            }

            return Ok(sceneRepository.Save(id, scene));
        }
    }
}
