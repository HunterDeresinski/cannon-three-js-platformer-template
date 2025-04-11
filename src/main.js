import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import SceneInit from './lib/SceneInit';
import physics_world from './physics_world_config.js';
import Player from './Player.js';

// Handle Basic Three.js Configuration
const test = new SceneInit('myThreeJsCanvas');
test.initialize();
test.animate();
const axesHelper = new THREE.AxesHelper(8);
test.scene.add(axesHelper);

physics_world.setup_debugger(test.scene);

// add bodies to the physics scene
const plane = physics_world.add_body('platform-1', {});
const staticBlockBody1 = physics_world.add_body('static-box-1', { position: new CANNON.Vec3(3, 1, 3) });
const boxBody = physics_world.add_body('dynamic-box-1', { position: new CANNON.Vec3(1, 10, 0) });
const sphereBody = physics_world.add_body('sphere-1', { position: new CANNON.Vec3(0, 7, 0) });

// Add Three.js shapes to render
// Create a grey plane in Three.js
const planeGeometry = new THREE.PlaneGeometry(20, 20); // Adjust size as needed
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
test.scene.add(planeMesh);

// Set the plane's position and rotation to match Cannon.js
planeMesh.position.copy(plane.position);
planeMesh.quaternion.copy(plane.quaternion);

const b1Geometry = new THREE.BoxGeometry(2, 2, 2);
const b1Material = new THREE.MeshNormalMaterial();
const b1Mesh = new THREE.Mesh(b1Geometry, b1Material);
test.scene.add(b1Mesh);

const b2Geometry = new THREE.BoxGeometry(2, 2, 2);
const b2Material = new THREE.MeshNormalMaterial();
const b2Mesh = new THREE.Mesh(b2Geometry, b2Material);
test.scene.add(b2Mesh);

const geometry = new THREE.SphereGeometry(1);
const material = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(geometry, material);
test.scene.add(sphereMesh);

// // Initialize the player
const player = new Player(physics_world, test.camera);

// Create player mesh (visual representation)
const playerGeometry = new THREE.BoxGeometry(2, 2, 2);
const playerMeshMaterial = new THREE.MeshNormalMaterial();
const playerMesh = new THREE.Mesh(playerGeometry, playerMeshMaterial);
test.scene.add(playerMesh);
playerMesh.position.copy(player.body.position);
playerMesh.quaternion.copy(player.body.quaternion);

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (event) => {
  if (event.key == ' ') {
    keys['Space'] = true;
  } else {
    keys[event.key] = true;
  }
});
window.addEventListener('keyup', (event) => {
  if (event.key == ' ') {
    keys['Space'] = false;
  } else {
    keys[event.key] = false;
  }
});

// Animate and update
const animate = () => {
  physics_world.update();
  physics_world.debugger.update();

  // Player movement and rotation
  if (keys['ArrowLeft']) {
    player.rotate(-1);
  }
  if (keys['ArrowRight']) {
    player.rotate(1);
  }
  if (keys['w'] || keys['W']) {
    player.moveForward();
  }
  if (keys['s'] || keys['S']) {
    player.moveBackward();
  }
  if (keys['a'] || keys['A']) {
    player.moveLeft();
  }
  if (keys['d'] || keys['D']) {
    player.moveRight();
  }

  if (keys['Space']) {
    player.jump();
  }

  // NEW: Update the player each frame so we can switch damping for air / ground
  player.update();

  // Update physics world
  playerMesh.position.copy(player.body.position);
  playerMesh.quaternion.copy(player.body.quaternion);

  // Sync Three.js shapes with Cannon.js bodies
  b1Mesh.position.copy(boxBody.position);
  b1Mesh.quaternion.copy(boxBody.quaternion);
  b2Mesh.position.copy(staticBlockBody1.position);
  b2Mesh.quaternion.copy(staticBlockBody1.quaternion);
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  window.requestAnimationFrame(animate);
};
animate();
