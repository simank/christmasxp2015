function PhysicsRenderer(t,e,s){this.checkCompatibility(s),this.renderer=s,this.size=t||128,this.s2=t*t,this.renderer=s,this.clock=new THREE.Clock,this.resolution=new THREE.Vector2(this.size,this.size),this.rt_1=new THREE.WebGLRenderTarget(this.size,this.size,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,format:THREE.RGBAFormat,type:THREE.FloatType,stencilBuffer:!1}),this.rt_2=this.rt_1.clone(),this.rt_3=this.rt_1.clone(),this.counter=0,this.debugScene=this.createDebugScene(),this.texturePassProgram=this.createTexturePassProgram(),this.simulation=this.createSimulationProgram(e),this.material=this.simulation,this.boundTextures=[],this.camera=new THREE.OrthographicCamera(-.5,.5,.5,-.5,0,1),this.scene=new THREE.Scene,this.mesh=new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1)),this.scene.add(this.mesh)}PhysicsRenderer.prototype.checkCompatibility=function(t){var e=t.context;return null===e.getExtension("OES_texture_float")?void this.onError("No Float Textures"):0===e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)?void this.onError("Vert Shader Textures don't work"):void 0},PhysicsRenderer.prototype.onError=function(t){console.log(t)},PhysicsRenderer.prototype.createDebugScene=function(){var t=new THREE.Object3D;t.position.z=0;var e=new THREE.PlaneBufferGeometry(100,100),s=new THREE.Mesh(e,new THREE.MeshBasicMaterial({map:this.rt_1}));s.position.set(-105,0,0),t.add(s);var s=new THREE.Mesh(e,new THREE.MeshBasicMaterial({map:this.rt_2}));s.position.set(0,0,0),t.add(s);var s=new THREE.Mesh(e,new THREE.MeshBasicMaterial({map:this.rt_3}));return s.position.set(105,0,0),t.add(s),t},PhysicsRenderer.prototype.removeDebugScene=function(t){t.remove(this.debugScene)},PhysicsRenderer.prototype.addDebugScene=function(t){t.add(this.debugScene)},PhysicsRenderer.prototype.createTexturePassProgram=function(){var t={texture:{type:"t",value:null}},e=new THREE.ShaderMaterial({uniforms:t,vertexShader:this.VSPass,fragmentShader:this.FSPass});return e},PhysicsRenderer.prototype.createSimulationProgram=function(t){this.simulationUniforms={t_oPos:{type:"t",value:null},t_pos:{type:"t",value:null},resolution:{type:"v2",value:this.resolution}};var e=new THREE.ShaderMaterial({uniforms:this.simulationUniforms,vertexShader:this.VSPass,fragmentShader:t});return e},PhysicsRenderer.prototype.VSPass=["varying vec2 vUv;","void main() {","  vUv = uv;","  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),PhysicsRenderer.prototype.FSPass=["uniform sampler2D texture;","varying vec2 vUv;","void main() {","  vec4 c = texture2D( texture , vUv );","  gl_FragColor = c ;","}"].join("\n"),PhysicsRenderer.prototype.update=function(){var t=this.counter%3;0==t?(this.simulation.uniforms.t_oPos.value=this.rt_1,this.simulation.uniforms.t_pos.value=this.rt_2,this.pass(this.simulation,this.rt_3),this.ooOutput=this.rt_1,this.oOutput=this.rt_2,this.output=this.rt_3):1==t?(this.simulation.uniforms.t_oPos.value=this.rt_2,this.simulation.uniforms.t_pos.value=this.rt_3,this.pass(this.simulation,this.rt_1),this.ooOutput=this.rt_2,this.oOutput=this.rt_3,this.output=this.rt_1):2==t&&(this.simulation.uniforms.t_oPos.value=this.rt_3,this.simulation.uniforms.t_pos.value=this.rt_1,this.pass(this.simulation,this.rt_2),this.ooOutput=this.rt_3,this.oOutput=this.rt_1,this.output=this.rt_2),this.counter++,this.bindTextures()},PhysicsRenderer.prototype.render=function(t,e,s){renderer.render(t,e,s,!1)},PhysicsRenderer.prototype.pass=function(t,e){this.mesh.material=t,this.renderer.render(this.scene,this.camera,e,!1)},PhysicsRenderer.prototype.out=function(t){this.mesh.material=t.material,this.renderer.render(this.scene,this.camera)},PhysicsRenderer.prototype.setUniforms=function(t){for(var e in t)this.simulation.uniforms[e]=t[e];this.simulation.uniforms.t_pos={type:"t",value:null},this.simulation.uniforms.t_oPos={type:"t",value:null},this.simulation.uniforms.resolution={type:"v2",value:this.resolution},console.log(this.simulation.uniforms)},PhysicsRenderer.prototype.setUniform=function(t,e){this.simulation.uniforms[t]=e},PhysicsRenderer.prototype.reset=function(t){this.texture=t,this.texturePassProgram.uniforms.texture.value=t,this.pass(this.texturePassProgram,this.rt_1),this.pass(this.texturePassProgram,this.rt_2),this.pass(this.texturePassProgram,this.rt_3)},PhysicsRenderer.prototype.passTexture=function(t,e){this.texturePassProgram.uniforms.texture.value=t,this.pass(this.texturePassProgram,e)},PhysicsRenderer.prototype.resetRand=function(t,e){for(var t=t||100,s=new Float32Array(4*this.s2),r=0;r<s.length;r++)s[r]=(Math.random()-.5)*t,e&&r%4===3&&(s[r]=0);var i=new THREE.DataTexture(s,this.size,this.size,THREE.RGBAFormat,THREE.FloatType);i.minFilter=THREE.NearestFilter,i.magFilter=THREE.NearestFilter,i.needsUpdate=!0,this.reset(i)},PhysicsRenderer.prototype.addBoundTexture=function(t,e){this.boundTextures.push([t,e])},PhysicsRenderer.prototype.bindTextures=function(){for(var t=0;t<this.boundTextures.length;t++){var e=this.boundTextures[t][0],s=this.boundTextures[t][1];e.value=this[s]}};