import * as twgl from 'https://twgljs.org/dist/6.x/twgl-full.module.js';
twgl.setDefaults({attribPrefix: "a_"});
const m4 = twgl.m4;
const cube = document.querySelector("#cube");
const video = document.querySelector("#realcube");
const gl = cube.getContext("webgl");

const programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

const bufferInfo = twgl.primitives.createCubeBufferInfo(gl, 2);

const currentImage = "fabibabi.png";

const tex = twgl.createTexture(gl, {
  min: gl.NEAREST,
  mag: gl.NEAREST,
  src: currentImage
});

const uniforms = {
  u_lightWorldPos: [1, 8, -10],
  u_lightColor: [1, 1, 1, 1],
  u_ambient: [0, 0, 0, 1],
  u_specular: [1, 1, 1, 1],
  u_shininess: 50,
  u_specularFactor: 1,
  u_diffuse: tex,
};

window.relatime = false;

function render(time) {
      //time *= 1000
      if (window.relatime === true) {
        time *= 0.001;
      }
      twgl.resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const fov = 30 * Math.PI / 180;
      const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      const zNear = 0.5;
      const zFar = 10;
      const projection = m4.perspective(fov, aspect, zNear, zFar);
      const eye = [1, 4, -6];
      const target = [0, 0, 0];
      const up = [0, 1, 0];

      const camera = m4.lookAt(eye, target, up);
      const view = m4.inverse(camera);
      const viewProjection = m4.multiply(projection, view);
      const world = m4.rotationY(time * 2);

      uniforms.u_viewInverse = camera;
      uniforms.u_world = world;
      uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
      uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.setUniforms(programInfo, uniforms);
      gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

      //console.log(audio);
      if (window.relatime === true) {
        requestAnimationFrame(render);
      } else {
        const audio = document.getElementById("audiio");
        requestAnimationFrame(() => render(audio.currentTime));
      }
}

window.isStarted = false;

document.querySelector("#funky").addEventListener("click", (e) => {
  if (!isStarted) {
    const audio = document.getElementById("audiio");
    console.log(audio)
    //audio.addEventListener("loadeddata", () => {
      audio.play()
      audio.loop = true;
      audio.playbackRate = 1;
      document.getElementById("ratelimiteeri").value = audio.playbackRate;
      document.getElementById("relatime").checked = false;
      // The duration variable now holds the duration (in seconds) of the audio clip
    //});
    video.style.display = "block";
    e.currentTarget.style.display = "none";
    document.getElementById("toshow").style.display = "block"
    requestAnimationFrame(() => render(audio.currentTime));
    var stream = cube.captureStream();
    // Set the source of the <video> element to be the stream from the <canvas>.
    video.srcObject = stream;
    video.play();
  }
  isStarted = true;
});

document.getElementById("ratelimiteeri").addEventListener("change", (e) => {
  console.log(e.currentTarget.value);

  document.getElementById("audiio").playbackRate = e.currentTarget.value;
})

document.getElementById("relatime").addEventListener("change", (e) => {
  console.log(e.currentTarget.checked);

  window.relatime = e.currentTarget.checked;
})

window.addEventListener("resize", () => {
  cube.width = 1280;
  cube.height = 720;
  
  video.width = 1280;
  video.height = 720;
})

document.getElementById("audiio").addEventListener("ratechange", (e) => {
  console.log(e.currentTarget.playbackRate);
  
  document.getElementById("ratelimiteeri").value = e.currentTarget.playbackRate
})

document.getElementById("hide").addEventListener("click", () => {
  document.getElementById("tohide").style.display = "none"
})
