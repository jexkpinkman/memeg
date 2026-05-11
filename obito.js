// OBITO 3D ANIMATION
// Kamui Vortex + Sharingan + Particles

(function() {
    'use strict';

    // Check Three.js loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded!');
        document.body.innerHTML += '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:red;font-size:20px;z-index:99999;">Three.js not loaded. Check internet connection.</div>';
        return;
    }

    console.log('Three.js loaded, version:', THREE.REVISION);

    const canvas = document.getElementById('obitoCanvas');
    if (!canvas) {
        console.error('Canvas #obitoCanvas not found!');
        return;
    }

    console.log('Canvas found, initializing scene...');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0000);
    scene.fog = new THREE.FogExp2(0x1a0505, 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: false,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ============================================
    // 1. KAMUI VORTEX - Multiple spiral arms
    // ============================================
    const vortexGroup = new THREE.Group();

    for (let s = 0; s < 3; s++) {
        const points = [];
        const colors = [];
        const turns = 6;
        const particlesPerSpiral = 1500;

        for (let i = 0; i < particlesPerSpiral; i++) {
            const t = i / particlesPerSpiral;
            const angle = t * turns * Math.PI * 2 + (s * (Math.PI * 2 / 3));
            const radius = 0.3 + t * 5;
            const y = (t - 0.5) * 12;

            points.push(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );

            // Bright red/orange colors
            const r = 0.9 + Math.random() * 0.1;
            const g = 0.1 + t * 0.4;
            const b = 0.0;
            colors.push(r, g, b);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const spiral = new THREE.Points(geometry, material);
        spiral.userData = { 
            rotationSpeed: (0.15 + s * 0.08) * (s % 2 === 0 ? 1 : -1)
        };
        vortexGroup.add(spiral);
    }
    scene.add(vortexGroup);

    // ============================================
    // 2. SHARINGAN 3D
    // ============================================
    const sharinganGroup = new THREE.Group();
    sharinganGroup.position.set(0, 0, -1);

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(1.0, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
    });
    sharinganGroup.add(new THREE.Mesh(ringGeo, ringMat));

    // Inner ring
    const innerRingGeo = new THREE.TorusGeometry(0.65, 0.025, 16, 100);
    const innerRingMat = new THREE.MeshBasicMaterial({ 
        color: 0xff3333,
        transparent: true,
        opacity: 0.5
    });
    sharinganGroup.add(new THREE.Mesh(innerRingGeo, innerRingMat));

    // 3 Tomoe
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const tomoeGroup = new THREE.Group();

        // Main body
        const bodyGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const bodyMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        tomoeGroup.add(new THREE.Mesh(bodyGeo, bodyMat));

        // Tail
        const tailGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const tailMat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
        const tail = new THREE.Mesh(tailGeo, tailMat);
        tail.position.x = 0.18;
        tail.scale.set(2.5, 1, 1);
        tomoeGroup.add(tail);

        const radius = 0.82;
        tomoeGroup.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );
        tomoeGroup.rotation.z = angle + Math.PI / 2;
        tomoeGroup.userData = { baseAngle: angle, radius: radius };

        sharinganGroup.add(tomoeGroup);
    }

    // Center pupil
    const pupilGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    sharinganGroup.add(new THREE.Mesh(pupilGeo, pupilMat));

    // Glow
    const glowGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
    });
    sharinganGroup.add(new THREE.Mesh(glowGeo, glowMat));

    scene.add(sharinganGroup);

    // ============================================
    // 3. FLOATING PARTICLES
    // ============================================
    const particleCount = 600;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = [];
    const pColors = [];

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 2 + Math.random() * 8;

        pPositions.push(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );

        const colorType = Math.random();
        if (colorType < 0.5) {
            pColors.push(1.0, 0.1, 0.05);
        } else if (colorType < 0.8) {
            pColors.push(1.0, 0.35, 0.05);
        } else {
            pColors.push(0.3, 0.05, 0.05);
        }
    }

    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.Float32BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ============================================
    // 4. SPIRAL RINGS
    // ============================================
    const ringGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const geo = new THREE.TorusGeometry(1.5 + i * 0.9, 0.015, 8, 100);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xff2200,
            transparent: true,
            opacity: 0.2 - i * 0.03,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.x = Math.PI / 2;
        ring.userData = { speed: 0.04 + i * 0.02 };
        ringGroup.add(ring);
    }
    scene.add(ringGroup);

    // ============================================
    // 5. MASK FRAGMENTS
    // ============================================
    const fragGroup = new THREE.Group();
    for (let i = 0; i < 10; i++) {
        const geo = new THREE.PlaneGeometry(0.15 + Math.random() * 0.2, 0.15 + Math.random() * 0.2);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide
        });
        const frag = new THREE.Mesh(geo, mat);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 3 + Math.random() * 4;

        frag.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        frag.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        frag.userData = {
            rx: (Math.random() - 0.5) * 0.008,
            ry: (Math.random() - 0.5) * 0.008,
            rz: (Math.random() - 0.5) * 0.008,
            floatSpeed: 0.4 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };

        fragGroup.add(frag);
    }
    scene.add(fragGroup);

    // ============================================
    // LIGHTING
    // ============================================
    scene.add(new THREE.AmbientLight(0x330000, 0.6));

    const pl1 = new THREE.PointLight(0xff3300, 1.2, 100);
    pl1.position.set(0, 0, 5);
    scene.add(pl1);

    const pl2 = new THREE.PointLight(0xff0000, 0.8, 50);
    pl2.position.set(5, 3, 0);
    scene.add(pl2);

    // ============================================
    // ANIMATION LOOP
    // ============================================
    const clock = new THREE.Clock();
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        mouseX += (targetX - mouseX) * 0.02;
        mouseY += (targetY - mouseY) * 0.02;

        // Vortex rotation
        vortexGroup.children.forEach((spiral, i) => {
            spiral.rotation.y += spiral.userData.rotationSpeed * 0.01;
            spiral.rotation.x = Math.sin(elapsed * 0.3 + i) * 0.1;
        });
        vortexGroup.rotation.z = elapsed * 0.04;

        // Sharingan
        sharinganGroup.rotation.z -= 0.015;
        sharinganGroup.rotation.x = mouseY * 0.3;
        sharinganGroup.rotation.y = mouseX * 0.3;

        const pulse = 1 + Math.sin(elapsed * 2) * 0.06;
        sharinganGroup.scale.set(pulse, pulse, pulse);

        sharinganGroup.children.forEach((child) => {
            if (child.userData && child.userData.baseAngle !== undefined) {
                const newAngle = child.userData.baseAngle + elapsed * 0.5;
                const r = child.userData.radius;
                child.position.x = Math.cos(newAngle) * r;
                child.position.y = Math.sin(newAngle) * r;
                child.rotation.z = newAngle + Math.PI / 2;
            }
        });

        // Particles
        particles.rotation.y = elapsed * 0.015;
        particles.rotation.x = Math.sin(elapsed * 0.08) * 0.08;

        // Rings
        ringGroup.children.forEach((ring) => {
            ring.rotation.z += ring.userData.speed;
        });

        // Fragments
        fragGroup.children.forEach(frag => {
            frag.rotation.x += frag.userData.rx;
            frag.rotation.y += frag.userData.ry;
            frag.rotation.z += frag.userData.rz;
            frag.position.y += Math.sin(elapsed * frag.userData.floatSpeed + frag.userData.floatOffset) * 0.003;
        });
        fragGroup.rotation.y = elapsed * 0.04;

        // Camera
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.01;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();
    console.log('Obito 3D animation started!');

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Toggle Kamui
    window.toggleKamui = function() {
        document.body.classList.toggle('kamui-active');
    };

    const toggleBtn = document.getElementById('toggleEffect');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', window.toggleKamui);
    }
})();
