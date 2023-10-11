import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js'

THREE.ColorManagement.enabled = false

document.getElementById("colorChoice").addEventListener('click', () => {
    document.querySelector(".colorChoiceList").classList.toggle('hide')
});
const gui = new dat.GUI();

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
// git 
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const textureOffset = { x: 1.025, y: 1.025 };

      // Add the texture offset values to the GUI
      gui.add(textureOffset, 'x', 0, 2).name('Texture Offset X').onChange(updateTextureOffset);
      gui.add(textureOffset, 'y', 0, 2).name('Texture Offset Y').onChange(updateTextureOffset);

      function updateTextureOffset() {
        // Update the texture offset for all the materials
        model.children[0].children[0].children[0].children[0].children.forEach((item) => {
          item.material.map.offset.set(textureOffset.x, textureOffset.y);
        });
      }
function loadTextureAndApply() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/models/apollo.png', (loadedTexture) => {
        // Ensure texture doesn't repeat
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        //  will need to be custom for the user to edit; will need a interface
        const textureScale = new THREE.Vector2(5, 5); // Set the texture scale
        const textureOffset = new THREE.Vector2(.536,.536); // Set the texture offset

        model.children[0].children[0].children[0].children[0].children.forEach((item) => {
            console.log(item)
            item.material.map = loadedTexture;
            item.material.map.repeat.copy(textureScale);
            item.material.map.offset.copy(textureOffset);
        });
        scene.add(model);
    }, undefined, (error) => {
        console.error('An error occurred while loading the texture:', error);
    });
}
/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let model;
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('/models/hoodie/scene.gltf', (gltf) => {
    model = gltf.scene;
    model.position.y = -0.4;
    model.position.z = 0.4;
    model.rotation.x = -0.23;
    loadTextureAndApply()

});




// Create an object to store the position and rotation data
const modelData = {
    positionX: -0.4,
    positionY: 0.4,
    positionZ: 0.4,
    rotationX: -0.23,
};

let currentModel = null; // Store a reference to the currently loaded model

// Function to load the GLTF model (called once at the beginning)
function loadGLTFModel() {
    gltfLoader.load(
        '/models/patch/scene.gltf',
        (gltf) => {
            gltf.scene.scale.set(0.07, 0.07, 0.07);
            gltf.scene.rotation.x = modelData.rotationX;
            scene.add(gltf.scene);
            currentModel = gltf.scene; // Update the reference to the current model
        }
    );
}

// Add a button to load the GLTF model
document.getElementById('graphicButton').addEventListener('click', (e) => {
    // This button can be used for debugging or repositioning the model if needed
    loadGLTFModel();
});

// Create controllers for position and rotation
const modelFolder = gui.addFolder('Model Settings');
const positionX = modelFolder.add(modelData, 'positionX', -1, 3).step(0.01).name('X Position');
const positionY = modelFolder.add(modelData, 'positionY', -1, 3).step(0.01).name('Y Position');
const positionZ = modelFolder.add(modelData, 'positionZ', -1, 1).step(0.01).name('Z Position');
const rotationX = modelFolder.add(modelData, 'rotationX', -Math.PI, Math.PI).step(0.01).name('X Rotation');

// Add event listeners to update the model's position when the values change
positionX.onChange(function (value) {
    if (currentModel) {
        currentModel.position.x = value;
    }
});

positionY.onChange(function (value) {
    if (currentModel) {
        currentModel.position.y = value;
    }
});

positionZ.onChange(function (value) {
    if (currentModel) {
        currentModel.position.z = value;
    }
});

rotationX.onChange(function (value) {
    if (currentModel) {
        currentModel.rotation.x = value;
    }
});
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 3.0)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.3)

directionalLight.position.set(0, 2, 0)
scene.add(directionalLight)


const directionalLightTwo = new THREE.DirectionalLight(0xFFFFFF, 1.3)

directionalLightTwo.position.set(-2, 2, 0)
scene.add(directionalLightTwo)

const directionalLightThree = new THREE.DirectionalLight(0xFFFFFF, 1.3)

directionalLightThree.position.set(2, 2, 0)
scene.add(directionalLightThree)


// 
if (document.querySelector(".colorChoiceListItem")) {
    let t = document.querySelectorAll(".colorChoiceListItem")
    t.forEach((item) => {
        item.addEventListener("click", (e) => {
            t.forEach((item) => {
                item.classList.remove("active")
            })
            e.target.classList.add("active")
            console.log(e.target.id)
            let target = e.target.id;
            if (target === 'yellow') {
                ambientLight.color.setHex(0xFCBA04)
                directionalLight.color.setHex(0xFCBA04)
            } else if (target === 'red') {
                ambientLight.color.setHex(0xA50104)
                directionalLight.color.setHex(0xA50104)
            } else if (target === 'rosewood') {
                ambientLight.color.setHex(0x590004)
                directionalLight.color.setHex(0x590004)
            } else if (target === 'blackBean') {
                ambientLight.color.setHex(0x250001)
                directionalLight.color.setHex(0x250001)
            } else if (target === 'whiteSmoke') {
                ambientLight.color.setHex(0xF3F3F3)
                directionalLight.color.setHex(0xF3F3F3)
            }
        })
    })
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1.5, 1)



scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    renderer.setClearColor(0x000000, 0);

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()