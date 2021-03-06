// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random")
const palettes = require("nice-color-palettes");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("white", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup a material
  const material = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: false
  });
  
  const palette = random.pick(palettes)
  const meshes = [];
  for(let i = 0; i < 45; i++) {
    const width = random.range(0.1, 1)
    const height = random.range(0.1, 1)
    const depth = random.range(0.01, 0.1)
    const z = random.range(0, 6)
    const x = random.range(0, 3)
    const y = random.range(0, 3)
    const seed = random.range(0, 10)

    const dimensions = { width, height, depth }
    const positions = { x, y, z }

    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: random.pick(palette)}));

    mesh.scale.set(0.2, 0.2, 0.2);
    
    scene.add(mesh);
    meshes.push({ mesh, dimensions, positions, seed })
  }

  const light = new THREE.DirectionalLight('white', 1);
  const ambiantLight = new THREE.AmbientLight('hsl(0, 0%, 40%)')
  light.position.set(2, 4, 1)
  scene.add(light)
  scene.add(ambiantLight)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.2;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },

    // Update & render your scene here
    render({ time }) {
      // mesh.rotation.y = time * 0.01
      // controls.update();
      meshes.forEach(mesh => {
        const { width, height, depth } = mesh.dimensions
        let { x, y, z } = mesh.positions
        let computedZ = z + (time * 0.05 * mesh.seed)
        mesh.mesh.scale.set(width + 0.2 * Math.sin(time + mesh.seed), height + 0.4 * Math.cos(time + (mesh.seed - 5.6)), depth)
        mesh.mesh.scale.multiplyScalar(0.5)
        mesh.mesh.position.set(x, y, (computedZ % 10) - 5)
      })
      scalarMultiplier = Math.sin(time)
      renderer.render(scene, camera);
    },

    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
