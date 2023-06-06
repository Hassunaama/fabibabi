import * as twgl from 'https://twgljs.org/dist/5.x/twgl-full.module.js';
twgl.setDefaults({attribPrefix: "a_"});
const m4 = twgl.m4;
const gl = document.querySelector("#cube").getContext("webgl");

const program = twgl.createProgramFromScripts(gl, ["vs", "fs"]);

const u_lightWorldPosLoc = gl.getUniformLocation(program, "u_lightWorldPos");
const u_lightColorLoc = gl.getUniformLocation(program, "u_lightColor");
const u_ambientLoc = gl.getUniformLocation(program, "u_ambient");
const u_specularLoc = gl.getUniformLocation(program, "u_specular");
const u_shininessLoc = gl.getUniformLocation(program, "u_shininess");
const u_specularFactorLoc = gl.getUniformLocation(program, "u_specularFactor");
const u_diffuseLoc = gl.getUniformLocation(program, "u_diffuse");
const u_worldLoc = gl.getUniformLocation(program, "u_world");
const u_worldInverseTransposeLoc = gl.getUniformLocation(program, "u_worldInverseTranspose");
const u_worldViewProjectionLoc = gl.getUniformLocation(program, "u_worldViewProjection");
const u_viewInverseLoc = gl.getUniformLocation(program, "u_viewInverse");

const positionLoc = gl.getAttribLocation(program, "a_position");
const normalLoc = gl.getAttribLocation(program, "a_normal");
const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");

const positions = [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1];
const normals   = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
const texcoords = [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
const indices   = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
const texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
const indicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


function loadTexture(gl, url) {
   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);
 
   // Because images have to be downloaded over the internet
   // they might take a moment until they are ready.
   // Until then put a single pixel in the texture so we can
   // use it immediately. When the image has finished downloading
   // we'll update the texture with the contents of the image.
   const level = 0;
   const internalFormat = gl.RGBA;
   const width = 1;
   const height = 1;
   const border = 0;
   const srcFormat = gl.RGBA;
   const srcType = gl.UNSIGNED_BYTE;
   const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
   gl.texImage2D(
     gl.TEXTURE_2D,
     level,
     internalFormat,
     width,
     height,
     border,
     srcFormat,
     srcType,
     pixel
   );
 
   const image = new Image();
   image.onload = () => {
     gl.bindTexture(gl.TEXTURE_2D, texture);
     gl.texImage2D(
       gl.TEXTURE_2D,
       level,
       internalFormat,
       srcFormat,
       srcType,
       image
     );
 
     // WebGL1 has different requirements for power of 2 images
     // vs. non power of 2 images so check if the image is a
     // power of 2 in both dimensions.
     if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
     } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     }
   };
   image.src = url;
 
   return texture;
 }
 
 function isPowerOf2(value) {
   return (value & (value - 1)) === 0;
 }

const currentImage = "fabibabi.png";

const tex = loadTexture(gl, currentImage);

function render(time) {
  time *= 0.001;
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projection = m4.perspective(30 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.5, 10);
  const eye = [1, 4, -6];
  const target = [0, 0, 0];
  const up = [0, 1, 0];

  const camera = m4.lookAt(eye, target, up);
  const view = m4.inverse(camera);
  const viewProjection = m4.multiply(projection, view);
  const world = m4.rotationY(time * 20);

  gl.useProgram(program);

  gl.uniform3fv(u_lightWorldPosLoc, [1, 8, -10]);
  //gl.uniform4fv(u_lightColorLoc, [1, 0.8, 0.8, 1]);
  gl.uniform4fv(u_lightColorLoc, [1, 1, 1, 1]);
  gl.uniform4fv(u_ambientLoc, [0, 0, 0, 1]);
  gl.uniform4fv(u_specularLoc, [1, 1, 1, 1]);
  gl.uniform1f(u_shininessLoc, 50);
  gl.uniform1f(u_specularFactorLoc, 1);
  gl.uniform1i(u_diffuseLoc, 0);
  gl.uniformMatrix4fv(u_viewInverseLoc, false, camera);

  gl.uniformMatrix4fv(u_worldLoc, false, world);
  gl.uniformMatrix4fv(u_worldInverseTransposeLoc, false, m4.transpose(m4.inverse(world)));
  gl.uniformMatrix4fv(u_worldViewProjectionLoc, false, m4.multiply(viewProjection, world));

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordLoc);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

  gl.drawElements(gl.TRIANGLES, 6 * 6, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
