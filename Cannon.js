// Lag fysikk-verdenen
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Standard jord-tyngdekraft
world.broadphase = new CANNON.NaiveBroadphase(); // Enkel kollisjonsdeteksjon
world.solver.iterations = 10; // Hvor nøyaktig fysikken skal være

// Bilens fysiske form (2m bred, 1m høy, 4m lang)
const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
const chassisBody = new CANNON.Body({ mass: 1500 }); // 1500kg som en vanlig personbil
chassisBody.addShape(chassisShape);
chassisBody.position.set(0, 5, 0); // Start litt over bakken

// Forhindre at bilen velter for lett (senke tyngdepunktet)
const centerOfMassOffset = new CANNON.Vec3(0, -0.5, 0);

const vehicle = new CANNON.RaycastVehicle({
    chassisBody: chassisBody,
    indexRightAxis: 0, // X-akse
    indexUpAxis: 1,    // Y-akse
    indexForwardAxis: 2 // Z-akse
});

// Innstillinger for dekkene (Grep, fjæring, friksjon)
const wheelOptions = {
    radius: 0.5,
    directionLocal: new CANNON.Vec3(0, -1, 0), // Nedover
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    frictionSlip: 5, // Dette styrer "drifting" - høy verdi = mye grep
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    rollInfluence: 0.01 // Hindrer bilen fra å tippe i svinger
};

// Legg til 4 hjul
vehicle.addWheel({ ...wheelOptions, chassisConnectionPointLocal: new CANNON.Vec3(1, 0, 1.5), isFrontWheel: true });
vehicle.addWheel({ ...wheelOptions, chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1.5), isFrontWheel: true });
vehicle.addWheel({ ...wheelOptions, chassisConnectionPointLocal: new CANNON.Vec3(1, 0, -1.5), isFrontWheel: false });
vehicle.addWheel({ ...wheelOptions, chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, -1.5), isFrontWheel: false });

vehicle.addToWorld(world);

function updatePhysics() {
    world.step(1/60); // Kjør fysikken i 60 FPS

    // Flytt 3D-karosseriet til der fysikk-kroppen er
    carGroup.position.copy(chassisBody.position);
    carGroup.quaternion.copy(chassisBody.quaternion);
    
    // Oppdater hjul-posisjoner (Visuals)
    for (let i = 0; i < vehicle.wheelInfos.length; i++) {
        vehicle.updateWheelTransform(i);
        const t = vehicle.wheelInfos[i].worldTransform;
        wheelMeshes[i].position.copy(t.position);
        wheelMeshes[i].rotation.copy(t.quaternion);
    }
}
