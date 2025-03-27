import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import SceneInit from './lib/SceneInit';
import physics_world from './physics_world_config.js';

// Handle Basic Three.js Configuration
const test = new SceneInit('myThreeJsCanvas');
test.initialize();
test.animate();
const axesHelper = new THREE.AxesHelper(8);
test.scene.add(axesHelper);

physics_world.setup_debugger(test.scene);

// add bodies to the physics scene
const plane = physics_world.add_body('platform-1', {});
const boxBody = physics_world.add_body('dynamic-box-1', { position: new CANNON.Vec3(1, 10, 0) });
const sphereBody = physics_world.add_body('sphere-1', { position: new CANNON.Vec3(0, 7, 0) });

// Add Three.js shapes to render
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
test.scene.add(boxMesh);

const geometry = new THREE.SphereGeometry(1);
const material = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(geometry, material);
test.scene.add(sphereMesh);

// // 1. Setup Physics World
// const physicsWorld = new CANNON.World({
//   gravity: new CANNON.Vec3(0, -9.82, 0),
// });
// // Setup cannon debugger for testing
// const cannonDebugger = new CannonDebugger(test.scene, physicsWorld, {
//   color: 0xff0000,
// });

// // Configure Materials with default properties
// // these are used in collisions if a special contact-material is
// // not created
// const playerMaterial = new CANNON.Material();
// playerMaterial.friction = 0.1;
// playerMaterial.restitution = 0;

// const groundMaterial = new CANNON.Material();
// groundMaterial.friction = 0.1;  // Low friction for the ground as well
// playerMaterial.restitution = 0;

// // Configure Groups (for collisions)
// const BLOCK_GROUP = 1;
// const PLAYER_GROUP = 2;

// const playerBlockContactMaterial = new CANNON.ContactMaterial(playerMaterial, groundMaterial, {
//   friction: 0.1,
//   restitution: 0,
// });
// physicsWorld.addContactMaterial(playerBlockContactMaterial);


// // Infinite plane
// const groundBody = new CANNON.Body({
//   type: CANNON.Body.STATIC,
//   shape: new CANNON.Plane(),
// });
// groundBody.material = groundMaterial;
// groundBody.collisionFilterGroup = BLOCK_GROUP;
// groundBody.collisionFilterMask = PLAYER_GROUP;
// groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
// physicsWorld.addBody(groundBody);

// // Create a sphere and set it at y=10
// const radius = 1;
// const sphereBody = new CANNON.Body({
//   mass: 5,
//   shape: new CANNON.Sphere(radius),
// });
// sphereBody.position.set(0, 7, 0);
// physicsWorld.addBody(sphereBody);

// // Part 3 - Combine the Three.js game world with the physics world
// const geometry = new THREE.SphereGeometry(radius);
// const material = new THREE.MeshNormalMaterial();
// const sphereMesh = new THREE.Mesh(geometry, material);
// test.scene.add(sphereMesh);

// // Part 4 - Add a box object
// const boxBody = new CANNON.Body({
//   mass: 5,
//   shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
// });
// boxBody.position.set(1, 10, 0);
// boxBody.angularDamping = 1;
// physicsWorld.addBody(boxBody);

// const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
// const boxMaterial = new THREE.MeshNormalMaterial();
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// test.scene.add(boxMesh);

// Player Class to handle movement and rotation
// class Player {
//   constructor(physicsWorld, camera, accSpeed = 500, maxSpeed = 10) {
//     this.physicsWorld = physicsWorld;
//     this.camera = camera;
//     this.accelerationSpeed = accSpeed;
//     this.maxSpeed = maxSpeed;
//     this.jumpStrength = 8;
//     this.rotationSpeed = Math.PI / 60; // speed for rotation in radians per frame

//     // Player body (this will control the player's position and rotation)
//     this.body = new CANNON.Body({
//       mass: 5,
//       position: new CANNON.Vec3(0, 5, 0),
//     });
//     this.body.angularDamping = 1;
//     this.body.material = playerMaterial;
//     this.body.collisionFilterGroup = PLAYER_GROUP;  // Player belongs to PLAYER_GROUP
//     this.body.collisionFilterMask = ~PLAYER_GROUP;  // Mask so it doesn't collide with other players
//     this.body.linearDamping = 0.1;
//     this.body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
//     this.physicsWorld.addBody(this.body);

//     // Create player mesh (visual representation)
//     const playerGeometry = new THREE.BoxGeometry(2, 2, 2);
//     const playerMeshMaterial = new THREE.MeshNormalMaterial();
//     this.mesh = new THREE.Mesh(playerGeometry, playerMeshMaterial);
//     test.scene.add(this.mesh);

//     this.mesh.position.copy(this.body.position);
//     this.mesh.quaternion.copy(this.body.quaternion);

//     this.onGround = false;
//     this.t = 0;

//     // Add event listener for collisions
//     this.body.addEventListener('collide', this.handleCollision.bind(this));
//   }

//   handleCollision(event) {
//     const otherBody = event.body;  // Get the other body in the collision
//     if (otherBody.collisionFilterGroup === BLOCK_GROUP) {
//       const contact = event.contact;

//       const collisionNormal = contact.ni;

//       if (collisionNormal && collisionNormal.y > 0) {
//         this.onGround = true;
//       }
//     }
//   }


//   // Update player's physics and mesh position
//   update() {
//     this.mesh.position.copy(this.body.position);
//     this.mesh.quaternion.copy(this.body.quaternion);
//   }

//   // Rotate the player around the Y-axis (left/right arrow keys)
//   rotate(direction) {
//     const quaternion = new CANNON.Quaternion();
//     const angle = this.rotationSpeed * -direction;

//     // Create a quaternion that rotates around the Y-axis
//     quaternion.setFromEuler(0, angle, 0); // rotate around the Y-axis

//     // Multiply the existing quaternion with the new rotation quaternion
//     this.body.quaternion = this.body.quaternion.mult(quaternion);  // Correct method for multiplying quaternions
//   }

//   // Move the player based on its rotation (WASD keys) with forces and velocity control
//   applyForce(direction) {
//     let force = new CANNON.Vec3(0, 0, 0); // Zero out the force initially

//     // Calculate the force based on direction
//     switch (direction) {
//       case 'forward':
//         force = new CANNON.Vec3(0, 0, -1); // Local forward direction (along Z-axis)
//         break;
//       case 'backward':
//         force = new CANNON.Vec3(0, 0, 1); // Local backward direction (along Z-axis)
//         break;
//       case 'left':
//         force = new CANNON.Vec3(-1, 0, 0); // Local left direction (along X-axis)
//         break;
//       case 'right':
//         force = new CANNON.Vec3(1, 0, 0); // Local right direction (along X-axis)
//         break;
//     }

//     // Apply the player's rotation to the force direction
//     force = this.body.quaternion.vmult(force);

//     // Scale the force to the desired speed
//     force = force.scale(this.accelerationSpeed);

//     // Apply the force to the player's body
//     this.body.applyForce(force, new CANNON.Vec3(0, 0, 0));
//   }

//   // Methods for movement (WASD)
//   moveForward() {
//     if (this.body.velocity.length() < this.maxSpeed) {
//       this.applyForce('forward');
//     }
//   }

//   moveBackward() {
//     if (this.body.velocity.length() < this.maxSpeed) {
//       this.applyForce('backward');
//     }
//   }

//   moveLeft() {
//     if (this.body.velocity.length() < this.maxSpeed) {
//       this.applyForce('left');
//     }
//   }

//   moveRight() {
//     if (this.body.velocity.length() < this.maxSpeed) {
//       this.applyForce('right');
//     }
//   }

//   jump() {
//     if (this.onGround) {
//       // Directly set the y-velocity for the jump (no need to apply force)
//       this.body.velocity.y = this.jumpStrength;
//       this.onGround = false;
//     }

//     if (++this.t > 5) {
//       this.onGround = false;
//     }
//   }
// }

// // Initialize the player
// const player = new Player(physicsWorld, test.camera);

// // Handle keyboard input
// const keys = {};
// window.addEventListener('keydown', (event) => {
//   if (event.key == ' ') {
//     keys['Space'] = true;
//   } else {
//     keys[event.key] = true;
//   }
// });
// window.addEventListener('keyup', (event) => {
//   if (event.key == ' ') {
//     keys['Space'] = false;
//   } else {
//     keys[event.key] = false;
//   }
// });

// Animate and update
const animate = () => {
  physics_world.update();
  physics_world.debugger.update();

  // Player movement and rotation
  // if (keys['ArrowLeft']) {
  //   player.rotate(-1);
  // }
  // if (keys['ArrowRight']) {
  //   player.rotate(1);
  // }
  // if (keys['w'] || keys['W']) {
  //   player.moveForward();
  // }
  // if (keys['s'] || keys['S']) {
  //   player.moveBackward();
  // }
  // if (keys['a'] || keys['A']) {
  //   player.moveLeft();
  // }
  // if (keys['d'] || keys['D']) {
  //   player.moveRight();
  // }

  // if (keys['Space']) {
  //   player.jump();
  // }

  // // Update the player mesh and physics world
  // player.update();

  // Sync other objects
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  window.requestAnimationFrame(animate);
};
animate();
