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

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

gltfLoader.load(
    '/models/hoodie/scene.gltf',
    (gltf) => {
        gltf.scene.position.y = -0.4
        gltf.scene.position.z = 0.4
        gltf.scene.rotation.x=-.23
        scene.add(gltf.scene)
    }
)


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
// 
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