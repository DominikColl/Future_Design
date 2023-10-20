// Tool selection for arms is needed.
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
import mergeImages from 'merge-images';
THREE.ColorManagement.enabled = false

const gui = new dat.GUI();


const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const textureOffset = {
    x: 1.025,
    y: 1.025
};

// Add the texture offset values to the GUI
gui.add(textureOffset, 'x', 0, 8).name('Texture Offset X').onChange(updateTextureOffset);
gui.add(textureOffset, 'y', -20, 2).name('Texture Offset Y').onChange(updateTextureOffset);

function updateTextureOffset() {
    // Update the texture offset for all the materials
    model.children[0].children[0].children[0].children[0].children.forEach((item) => {
        item.material.map.offset.set(textureOffset.x, textureOffset.y);
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
// 

// Create an object to hold the model's position
const modelPosition = {
    x: 0,
    y: -0.4,
    z: 0.7
};
let layer;
// Load the 3D model
// Create controls for moving the model's position in dat.gui
function moveScale() {
    document.querySelectorAll(".scaleTool").forEach(item => {
        item.addEventListener("click", (e) => {
            console.log(model.children[0].children[0].children[0].children[0].children[0].material.map.repeat);
            if (e.target.id == "plusWidth") {
                model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.x--
                model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.y--
            } else if (e.target.id == "minusWidth") {
                model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.y++
                model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.x++
            } else if (e.target.id == "plusHeight") {

            } else if (e.target.id == "minusHeight") {

            }
        })
    })
}
// 
gltfLoader.load('/models/untitled.gltf', (gltf) => {
    model = gltf.scene;
    model.position.y = -0.4;
    model.position.z = 0.4;
    model.rotation.x = -0.23;
    scene.add(model);
})

gltfLoader.load('/models/base.gltf', (gltf) => {
    let Tmodel = gltf.scene;
    Tmodel.position.y = -0.4;
    Tmodel.position.z = 0.4;
    Tmodel.rotation.x = -0.23;

    scene.add(Tmodel)
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


// Color choice button
document.getElementById("colorChoice").addEventListener('click', () => {
    document.querySelector(".colorChoiceList").classList.toggle('hide')
});
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
// Logo Upload
let logoUpload;
document.getElementById("logoImg").addEventListener('change', (e) => {
    var files = e.target.files;
    console.log(model);
    scene.remove(model);
    let fr = new FileReader();
    fr.onload = function () {
        let inputImage = new Image();
        inputImage.src = fr.result;

        inputImage.onload = function () {
            // Calculate the desired width and height for the input image
            const desiredWidth = 50; // Set your desired width
            const desiredHeight = 50; // Set your desired height

            // Resize the input image to the desired dimensions
            const canvas = document.createElement('canvas');
            canvas.width = desiredWidth;
            canvas.height = desiredHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(inputImage, 0, 0, desiredWidth, desiredHeight);
            const resizedImage = canvas.toDataURL('image/jpeg'); // You can specify the desired image format

            mergeImages([{src:'/models/whiteBackground.PNG',x:0,y:0}, {src:resizedImage,x:25,y:25}], {
                width: 100,
                height: 100
            })
            .then(b64 => document.querySelector("#img").src = b64);

            // Use the resizedImage for applying to the 3D model
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(resizedImage, () => {
                // The rest of your code for applying the texture to the 3D model

            }, undefined, (error) => {
                console.error('An error occurred while loading the texture:', error);
            });

            // Logo Placement buttons appear once user uploads file
            if (resizedImage) {
                document.querySelector(".logoPlace").classList.toggle('hide')
            }
            document.getElementById("logoPlacementButton").addEventListener('click', () => {
                console.log()
                document.querySelector(".logoPlacement").classList.toggle('hide')
            });

            // Event listeners for each logo placement button
            document.getElementById("left-sleeve-placement").addEventListener('click', () => {
                console.log("left")
            });
            document.getElementById("right-sleeve-placement").addEventListener('click', () => {
                console.log("right")
            });
            document.getElementById("back-placement").addEventListener('click', () => {
                console.log("back")
            });
            document.getElementById("front-placement").addEventListener('click', () => {
                console.log("front")
            });
        }
        gltfLoader.load('/models/untitled.gltf', (gltf) => {
            model = gltf.scene;
            model.position.y = -0.4;
            model.position.z = 0.4;
            model.rotation.x = -0.23;
            // before loading texture call function to throw white background on image 
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(document.querySelector("#img").src, (loadedTexture) => {
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;

                const textureScale = new THREE.Vector2(8, 8);
                const textureOffset = new THREE.Vector2(1.008, -1.034);

                let r = model.children[0].children[0].children[0].children[0].children;
                console.log(r)
                r[0].material.map = loadedTexture;
                r[0].material.map.repeat = textureScale;
                r[0].material.map.offset = textureOffset;

                let textureHeight = model.children[0].children[0].children[0].children[0].children[0].material.map.source.data.naturalHeight;
                let textureWidth = model.children[0].children[0].children[0].children[0].children[0].material.map.source.data.naturalWidth;
                document.getElementById("logoWidth").innerHTML = `${textureWidth / 8}px `;
                moveScale();
                scene.add(model);
            }, undefined, (error) => {
                console.error('An error occurred while loading the texture:', error);
            });
        })
    }
    fr.readAsDataURL(files[0]);
});

// Tools button
document.getElementById("toolChoice").addEventListener('click', () => {
    console.log()
    document.querySelector(".toolList").classList.toggle('hide')
});
document.getElementById("logoChoice").addEventListener('click', () => {
    console.log()
    document.querySelector(".logoDiv").classList.toggle('hide')
});

document.getElementById("sizeChoice").addEventListener('click', () => {
    console.log()
    document.querySelector(".sizeChoiceList").classList.toggle('hide')
});
if (document.querySelector(".toolListItem")) {
    let t = document.querySelectorAll(".toolListItem")
    t.forEach((item) => {
        item.addEventListener("click", (e) => {
            t.forEach((item) => {
                item.classList.remove("toolActive")
            })
            e.target.classList.add("toolActive")
            // console.log(e.target.id)
            let target = e.target.id;
            if (target === 'left') {
                // console.log(model);
                let textureX = model.children[0].children[0].children[0].children[0].children[0].material.map.offset.x;
                textureX += .1;
                model.children[0].children[0].children[0].children[0].children[0].material.map.offset.x = textureX;
            } else if (target === 'right') {
                let textureX = model.children[0].children[0].children[0].children[0].children[0].material.map.offset.x;
                textureX -= .1;
                model.children[0].children[0].children[0].children[0].children[0].material.map.offset.x = textureX;
            } else if (target === 'up') {
                let textureY = model.children[0].children[0].children[0].children[0].children[0].material.map.offset.y;
                textureY -= .1;
                model.children[0].children[0].children[0].children[0].children[0].material.map.offset.y = textureY;
            } else if (target === 'down') {
                let textureY = model.children[0].children[0].children[0].children[0].children[0].material.map.offset.y;
                textureY += .1;
                model.children[0].children[0].children[0].children[0].children[0].material.map.offset.y = textureY;

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