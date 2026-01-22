// 1. SCENE: Dette er beholderen for alt i 3D-verdenen
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // En enkel himmelfarge

// 2. KAMERA: PerspectiveCamera simulerer menneskelig syn
const camera = new THREE.PerspectiveCamera(
    75, // Synsfelt (FOV)
    window.innerWidth / window.innerHeight, // Aspektforhold
    0.1, // Near clipping plane
    2000 // Far clipping plane (hvor langt vi ser)
);

// 3. RENDERER: Bruker iPad-ens GPU via WebGL
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Viktig for skarp grafikk på iPad Retina-skjermer
document.body.appendChild(renderer.domElement);

// 4. LYS: Vi trenger lys for å se 3D-objektene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Generelt lys
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
sunLight.position.set(50, 100, 50);
scene.add(sunLight);

// BAKKEN: En enorm flate
const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222, 
    roughness: 0.8 
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Legg den flatt
scene.add(ground);

// Enkel representasjon av bilen (før vi legger til en ekte 3D-modell)
const carGroup = new THREE.Group(); // Samler karosseri og hjul
const bodyGeo = new THREE.BoxGeometry(2, 1, 4);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf7931a });
const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
carGroup.add(bodyMesh);

scene.add(carGroup);

function updateCamera() {
    // Definer hvor kameraet skal være i forhold til bilen
    const relativeCameraOffset = new THREE.Vector3(0, 5, 12);
    
    // Transformer offset basert på bilens rotasjon
    const cameraOffset = relativeCameraOffset.applyMatrix4(carGroup.matrixWorld);

    // Myk bevegelse (Interpolasjon)
    camera.position.lerp(cameraOffset, 0.1);
    camera.lookAt(carGroup.position);
}
