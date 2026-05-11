/**
 * OBITO 3D ANIMATION
 * Kamui Vortex + Sharingan + Particle Effects
 * Pure Three.js - No external models needed
 */

class ObitoScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true, 
            antialias: true 
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        // Fog merah tua (Kamui dimension feel)
        this.scene.fog = new THREE.FogExp2(0x1a0505, 0.02);

        this.createKamuiVortex();
        this.createSharingan();
        this.createObitoParticles();
        this.createMaskFragments();
        this.createSpiralRings();
        this.createLighting();

        this.camera.position.z = 5;

        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        this.animate();

        window.addEventListener('resize', () => this.onResize());
    }

    // Kamui Vortex - Spiral distortion effect
    createKamuiVortex() {
        const vortexGroup = new THREE.Group();
        const spiralCount = 3;

        for (let s = 0; s < spiralCount; s++) {
            const points = [];
            const turns = 8;
            const height = 15;
            const particlesPerSpiral = 2000;

            for (let i = 0; i < particlesPerSpiral; i++) {
                const t = i / particlesPerSpiral;
                const angle = t * turns * Math.PI * 2 + (s * (Math.PI * 2 / spiralCount));
                const radius = 0.5 + t * 4;
                const y = (t - 0.5) * height;

                points.push(
                    Math.cos(angle) * radius,
                    y,
                    Math.sin(angle) * radius
                );
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

            // Warna gradasi dari merah gelap ke orange
            const colors = [];
            for (let i = 0; i < particlesPerSpiral; i++) {
                const t = i / particlesPerSpiral;
                const r = 0.8 + t * 0.2;
                const g = 0.1 + t * 0.3;
                const b = 0.05;
                colors.push(r, g, b);
            }
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.04,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const spiral = new THREE.Points(geometry, material);
            spiral.userData = { 
                rotationSpeed: 0.2 + s * 0.1,
                direction: s % 2 === 0 ? 1 : -1
            };
            vortexGroup.add(spiral);
        }

        this.vortex = vortexGroup;
        this.scene.add(vortexGroup);
    }

    // Sharingan 3D - Three tomoe rotating
    createSharingan() {
        const sharinganGroup = new THREE.Group();

        // Outer ring
        const ringGeo = new THREE.TorusGeometry(1.2, 0.03, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        sharinganGroup.add(ring);

        // Inner ring
        const innerRingGeo = new THREE.TorusGeometry(0.8, 0.02, 16, 100);
        const innerRing = new THREE.Mesh(innerRingGeo, ringMat.clone());
        innerRing.material.opacity = 0.4;
        sharinganGroup.add(innerRing);

        // Tomoe (3 comma shapes) - simplified as small spheres with trails
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const tomoeGroup = new THREE.Group();

            // Tomoe body
            const tomoeGeo = new THREE.SphereGeometry(0.12, 16, 16);
            const tomoeMat = new THREE.MeshBasicMaterial({ 
                color: 0xff1a1a,
                transparent: true,
                opacity: 0.9
            });
            const tomoe = new THREE.Mesh(tomoeGeo, tomoeMat);

            // Tomoe trail (elongated)
            const trailGeo = new THREE.SphereGeometry(0.06, 8, 8);
            const trail = new THREE.Mesh(trailGeo, tomoeMat.clone());
            trail.position.x = 0.15;
            trail.scale.set(2, 1, 1);

            tomoeGroup.add(tomoe);
            tomoeGroup.add(trail);

            // Position on ring
            const radius = 1.0;
            tomoeGroup.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );
            tomoeGroup.rotation.z = angle + Math.PI / 2;

            tomoeGroup.userData = { 
                baseAngle: angle,
                radius: radius
            };

            sharinganGroup.add(tomoeGroup);
        }

        // Center pupil
        const pupilGeo = new THREE.SphereGeometry(0.25, 32, 32);
        const pupilMat = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        sharinganGroup.add(pupil);

        // Glow effect
        const glowGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.05,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        sharinganGroup.add(glow);

        sharinganGroup.position.set(0, 0, -2);
        this.sharingan = sharinganGroup;
        this.scene.add(sharinganGroup);
    }

    // Obito-themed particles
    createObitoParticles() {
        const particleCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];

        for (let i = 0; i < particleCount; i++) {
            // Random position in sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 3 + Math.random() * 7;

            positions.push(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );

            // Colors: merah, orange, hitam
            const colorType = Math.random();
            if (colorType < 0.5) {
                colors.push(0.9, 0.1, 0.05); // Red
            } else if (colorType < 0.8) {
                colors.push(0.9, 0.4, 0.05); // Orange
            } else {
                colors.push(0.1, 0.05, 0.05); // Dark
            }

            sizes.push(Math.random() * 0.08 + 0.02);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    // Mask fragments floating (Obito's broken mask reference)
    createMaskFragments() {
        const fragmentGroup = new THREE.Group();
        const fragmentCount = 12;

        for (let i = 0; i < fragmentCount; i++) {
            // Create angular fragments using custom shape
            const shape = new THREE.Shape();
            const size = 0.1 + Math.random() * 0.2;

            shape.moveTo(0, 0);
            shape.lineTo(size, size * 0.5);
            shape.lineTo(size * 0.8, -size * 0.3);
            shape.lineTo(-size * 0.2, -size * 0.5);
            shape.closePath();

            const geo = new THREE.ShapeGeometry(shape);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xdddddd,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });

            const fragment = new THREE.Mesh(geo, mat);

            // Random position
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = 4 + Math.random() * 3;

            fragment.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );

            fragment.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            fragment.userData = {
                rotSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatOffset: Math.random() * Math.PI * 2
            };

            fragmentGroup.add(fragment);
        }

        this.maskFragments = fragmentGroup;
        this.scene.add(fragmentGroup);
    }

    // Spiral rings (Kamui distortion rings)
    createSpiralRings() {
        const ringGroup = new THREE.Group();
        const ringCount = 5;

        for (let i = 0; i < ringCount; i++) {
            const geo = new THREE.TorusGeometry(2 + i * 0.8, 0.01, 8, 100);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xff3300,
                transparent: true,
                opacity: 0.15 - i * 0.02,
                blending: THREE.AdditiveBlending
            });

            const ring = new THREE.Mesh(geo, mat);
            ring.rotation.x = Math.PI / 2;
            ring.userData = {
                rotationSpeed: 0.05 + i * 0.02,
                pulseSpeed: 1 + i * 0.3,
                baseScale: 1
            };

            ringGroup.add(ring);
        }

        this.spiralRings = ringGroup;
        this.scene.add(ringGroup);
    }

    createLighting() {
        const ambientLight = new THREE.AmbientLight(0x220000, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff3300, 1, 100);
        pointLight.position.set(0, 0, 5);
        this.scene.add(pointLight);

        const redLight = new THREE.PointLight(0xff0000, 0.8, 50);
        redLight.position.set(5, 5, 0);
        this.scene.add(redLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.02;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.02;

        // Animate vortex
        if (this.vortex) {
            this.vortex.children.forEach((spiral, i) => {
                spiral.rotation.y += spiral.userData.rotationSpeed * spiral.userData.direction * 0.01;
                spiral.rotation.x = Math.sin(elapsed * 0.3 + i) * 0.1;
            });
            this.vortex.rotation.z = elapsed * 0.05;
        }

        // Animate Sharingan
        if (this.sharingan) {
            this.sharingan.rotation.z -= 0.02;
            this.sharingan.rotation.x = this.mouse.y * 0.3;
            this.sharingan.rotation.y = this.mouse.x * 0.3;

            // Pulse effect
            const pulse = 1 + Math.sin(elapsed * 2) * 0.05;
            this.sharingan.scale.set(pulse, pulse, pulse);

            // Tomoe orbit
            this.sharingan.children.forEach((child, i) => {
                if (child.userData && child.userData.baseAngle !== undefined) {
                    const newAngle = child.userData.baseAngle + elapsed * 0.5;
                    const r = child.userData.radius;
                    child.position.x = Math.cos(newAngle) * r;
                    child.position.y = Math.sin(newAngle) * r;
                    child.rotation.z = newAngle + Math.PI / 2;
                }
            });
        }

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y = elapsed * 0.02;
            this.particles.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsed + positions[i]) * 0.002;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate mask fragments
        if (this.maskFragments) {
            this.maskFragments.children.forEach(fragment => {
                fragment.rotation.x += fragment.userData.rotSpeed.x;
                fragment.rotation.y += fragment.userData.rotSpeed.y;
                fragment.rotation.z += fragment.userData.rotSpeed.z;

                fragment.position.y += Math.sin(
                    elapsed * fragment.userData.floatSpeed + fragment.userData.floatOffset
                ) * 0.003;
            });
            this.maskFragments.rotation.y = elapsed * 0.05;
        }

        // Animate spiral rings
        if (this.spiralRings) {
            this.spiralRings.children.forEach((ring, i) => {
                ring.rotation.z += ring.userData.rotationSpeed;
                const scale = ring.userData.baseScale + Math.sin(elapsed * ring.userData.pulseSpeed) * 0.1;
                ring.scale.set(scale, scale, scale);
            });
        }

        // Camera subtle movement
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.01;
        this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.01;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const obitoCanvas = document.getElementById('obitoCanvas');
    if (obitoCanvas && typeof THREE !== 'undefined') {
        window.obitoScene = new ObitoScene('obitoCanvas');
    }
});