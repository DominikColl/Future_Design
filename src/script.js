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
let Tmodel;
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
// Create controls for changing the model's size in dat.gui
let sizeSlider = document.getElementById('sizeRange');
sizeSlider.addEventListener('input', (e) => {
    console.log(e.target.value);
    model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.x = e.target.value * 0.14;
    model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.y = e.target.value * 0.14;
    console.log(model.children[0].children[0].children[0].children[0].children[0].material.map.repeat);
})

// function moveScale() {
//     document.querySelectorAll(".sizeRange").forEach(item => {
//         item.addEventListener("click", (e) => {
//             console.log(model.children[0].children[0].children[0].children[0].children[0].material.map.repeat);
//             if (e.target.id == "plusWidth") {
//                 model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.x--
//                 model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.y--
//             } else if (e.target.id == "minusWidth") {
//                 model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.y++
//                 model.children[0].children[0].children[0].children[0].children[0].material.map.repeat.x++
//             } else if (e.target.id == "plusHeight") {

//             } else if (e.target.id == "minusHeight") {

//             }
//         })
//     })
// }
// 
gltfLoader.load('/models/untitled.gltf', (gltf) => {
    model = gltf.scene;
    model.position.y = -0.4;
    model.position.z = 0.4;
    model.rotation.x = -0.23;
    scene.add(model);
})

gltfLoader.load('/models/base.gltf', (gltf) => {
    Tmodel = gltf.scene;
    Tmodel.position.y = -0.4;
    Tmodel.position.z = 0.4;
    Tmodel.rotation.x = -0.23;

    scene.add(Tmodel)
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.2)

directionalLight.position.set(0, 2, 0)
scene.add(directionalLight)


const directionalLightTwo = new THREE.DirectionalLight(0xFFFFFF, 0.71)

directionalLightTwo.position.set(-2, 2, 0)
scene.add(directionalLightTwo)

const directionalLightThree = new THREE.DirectionalLight(0xFFFFFF, 0.85)

directionalLightThree.position.set(2, 2, 0)
scene.add(directionalLightThree)

// 
function addDirectionalLightControls(light, folderName) {
    const folder = gui.addFolder(folderName);
    folder.add(light, 'intensity', 0, 10);
    folder.addColor(light, 'color');

}

addDirectionalLightControls(ambientLight, 'tester')
addDirectionalLightControls(directionalLight, 'tester0')
addDirectionalLightControls(directionalLightTwo, 'tester1')
addDirectionalLightControls(directionalLightThree, 'tester2')



// 

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

            mergeImages([{ src: '/models/whiteBackground.PNG', x: 0, y: 0 }, { src: resizedImage, x: 25, y: 25 }], {
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


        }
        gltfLoader.load('/models/untitled.gltf', (gltf) => {
            var color = { r: 0.9, g: 0.9, b: 0.9 };
            var colorFolder = gui.addFolder('RGB Color');
            colorFolder.add(color, 'r', 0, 1).step(0.01).name('Red').onChange(updateColor);
            colorFolder.add(color, 'g', 0, 1).step(0.01).name('Green').onChange(updateColor);
            colorFolder.add(color, 'b', 0, 1).step(0.01).name('Blue').onChange(updateColor);
            function updateColor() {
                r[0].material.color.setRGB(color.r, color.g, color.b);
            }
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
                let rTwo = r[0].material.clone();
                console.log(rTwo)
                // increments of .1 rgb
                // rTwo.color.setRGB(.2,.2,0);
                console.log(rTwo)
                r[0].material = rTwo;
                // r[0].material.color.copy(new THREE.Color("#FF0000"))
                let textureHeight = model.children[0].children[0].children[0].children[0].children[0].material.map.source.data.naturalHeight;
                let textureWidth = model.children[0].children[0].children[0].children[0].children[0].material.map.source.data.naturalWidth;
                document.getElementById("sizeRange").innerHTML = `${textureWidth / 8}px `;
                //moveScale();
                scene.add(model);
            }, undefined, (error) => {
                console.error('An error occurred while loading the texture:', error);
            });
        })
    }
    fr.readAsDataURL(files[0]);
});

// Un-hide buttons
document.getElementById("toolChoice").addEventListener('click', () => {
    console.log()
    document.querySelector(".toolListSlider").classList.toggle('hide')
    document.querySelector(".toolListHorizontal").classList.toggle('hide')
});
document.getElementById("logoChoice").addEventListener('click', () => {
    console.log()
    document.querySelector(".logoDiv").classList.toggle('hide')
});

document.getElementById("sizeChoice").addEventListener('click', () => {
    console.log()
    document.querySelector(".sizeChoiceList").classList.toggle('hide')
});

// Vertical positioning controls with up and down buttons.
if (document.querySelector(".toolListItem2")) {
    let t = document.querySelectorAll(".toolListItem2")
    t.forEach((item) => {
        item.addEventListener("click", (e) => {
            t.forEach((item) => {
                item.classList.remove("toolActive")
            })
            e.target.classList.add("toolActive")
            // console.log(e.target.id)
            let target = e.target.id;
            if (target === 'left') {
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
// 
let t = document.querySelectorAll(".colorChoiceListItem");
t.forEach((item) => {
    item.addEventListener("click", (e) => {
        // Remove 'active' class from all items
        t.forEach((item) => {
            item.classList.remove("active");
        });
        // Add 'active' class to the clicked item
        e.target.classList.add("active");
        console.log(e.target.id);
        let targetColor = e.target.id;

        // Assuming the path to your mesh material is correct
        let meshMaterial = model.children[0].children[0].children[0].children[0].children[0].material;
        let baseMaterial = Tmodel.children[0].children[0].children[0].children[0].children[0].material
        // Change the color based on the selected option
        if (targetColor === 'yellow') {
            console.log(Tmodel)
            baseMaterial.color.set(0xFFFF00);
            meshMaterial.color.set(0xFFFF00); // Hex for yellow
        } else if (targetColor === 'red') {
            baseMaterial.color.set(0xFF0000);
            meshMaterial.color.set(0xFF0000); // Hex for red
        } else if (targetColor === 'rosewood') {
            baseMaterial.color.set(0x65000B);
            meshMaterial.color.set(0x65000B); // Hex for rosewood, adjust as needed
        } else if (targetColor === 'blackBean') {
            baseMaterial.color.set(0x3D0C02);
            meshMaterial.color.set(0x3D0C02); // Hex for black bean, adjust as needed
        } else if (targetColor === 'whiteSmoke') {
            baseMaterial.color.set(0xF5F5F5);
            meshMaterial.color.set(0xF5F5F5); // Hex for white smoke
        }
    });
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