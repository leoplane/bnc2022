// import * as dat from 'lil-gui'
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js";
// // Debug
// const gui = new dat.GUI({
//     width: 400
// })

// Change the title to the project
document.title = "Brave New China 2022";

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Set the background color of the scene
const backgroundColor = new THREE.Color(0x6E2F2D);
scene.background = backgroundColor;

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('../static/draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const textures = []
const textureFiles = ['bus.jpg', 'bbq.jpg', 'ambulance.jpg', 
                     'apartment.jpg', 'last.jpg', 'lock.jpg','paper.jpg', 'phone.jpg', 'room.jpg', 'buns.jpg']
for (const textureFile of textureFiles) {
    const texture = textureLoader.load('static/' + textureFile)
    texture.flipY = false
    texture.encoding = THREE.sRGBEncoding
    textures.push(texture)
}

/**
 * Materials
 */
const materials = []
for (const texture of textures) {
    const material = new THREE.MeshBasicMaterial({ map: texture })
    materials.push(material)
}

/**
 * Models
 */
const models = []
const modelFiles = ['bus.glb', 'bbq.glb', 'ambulance.glb', 
                     'apartment.glb', 'last.glb', 'lock.glb', 'paper.glb', 'phone.glb', 'room.glb', 'buns.glb']
for (let i = 0; i < modelFiles.length; i++) {
    const modelFile = 'static/' + modelFiles[i]
    const material = materials[i]
    gltfLoader.load(
        modelFile,
        (gltf) => {
            // Wait for the model to finish loading
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    // Look for the baked mesh and set its material
                    child.material = material

            // Apply a rotation to the mesh's matrix
            const rotation = new THREE.Matrix4().makeRotationY(Math.PI / 2)
            child.applyMatrix4(rotation)
                }
            })
            
            // //Rotate the loaded scene
            // gltf.scene.rotation.y = Math.PI / 2;
           
            // Add the model to the scene
            scene.add(gltf.scene)
            models.push(gltf.scene);
        },
        undefined,
        (error) => {
            console.error(error)
        }
    )
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(30, 10, 30)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
// Disable user interaction with the object
controls.enabled = true
controls.enableDamping = false
controls.rotateSpeed = 0.3; // Adjust rotation speed
controls.zoomSpeed = 0.1; // Adjust zoom speed

// Set limits for the orbit controls
controls.minPolarAngle = 0; // minimum polar angle (vertical angle) the camera can be at
controls.maxPolarAngle = Math.PI/2; // maximum polar angle (vertical angle) the camera can be at
controls.minAzimuthAngle = 0; // minimum azimuth angle (horizontal angle) the camera can be at
controls.maxAzimuthAngle = Math.PI /2 ; // maximum azimuth angle (horizontal angle) the camera can be at
controls.minDistance = 12; // minimum distance the camera can be from the target
controls.maxDistance = 35; // maximum distance the camera can be from the target

controls.enablePan = false;

// Disable pan for mobile devices
//if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
{

}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(0, 1, 1)
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(0, 2, 0)
scene.add(pointLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// /**
//  * Animate
//  */
// const clock = new THREE.Clock()

// const tick = () =>
// {
//     const elapsedTime = clock.getElapsedTime()

//     models.forEach(model => {
//         model.rotation.y += Math.PI / 2 * clock.getDelta();
//     });

//     controls.update()

//     renderer.render(scene, camera)

//     window.requestAnimationFrame(tick)

// }

// tick()

const clock = new THREE.Clock()
const fixedTimeStep = 1 / 60 // Update the scene at 60 fps

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Calculate the time since the last frame
  const deltaTime = clock.getDelta()

  // Update the OrbitControls
  controls.update(deltaTime)

  // Update the objects in the scene
  models.forEach(model => {
    model.rotation.y += Math.PI / 2 * deltaTime
  })

  // Render the scene
  renderer.render(scene, camera)

  // Request the next frame at a fixed rate
  window.requestAnimationFrame(tick)
}

// Start the animation loop
tick()

