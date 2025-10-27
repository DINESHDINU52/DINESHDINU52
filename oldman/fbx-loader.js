// FBX 3D Model Loader for The Book of Two Sorcerers
// This script loads and displays FBX 3D models using Three.js

(function() {
    'use strict';

    // Configuration
    const config = {
        // Path to your FBX file - replace with your actual FBX file path
        fbxPath: 'base.fbx',
        // Fallback to external URL if local file doesn't exist
        //fallbackUrl: 'https://dineshdinu52.github.io/DINESHDINU52/3dmodel/index.html',
        // Enable auto-rotation
        autoRotate: true,
        // Rotation speed
        rotationSpeed: 1.0
    };

    // Container element
    const container = document.getElementById('fbx-loader-container');
    if (!container) return;

    let scene, camera, renderer, controls, model;
    let animationMixer, clock;
    
    // Check if required libraries are loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded. Using fallback iframe.');
        loadFallbackIframe();
        return;
    }

    // Initialize the FBX loader
    function initFBXLoader() {
        try {
            // Set up scene with magical dark background
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a0a);
            scene.fog = new THREE.FogExp2(0x0a0a0a, 0.002);

            // Camera setup
            const aspect = container.offsetWidth / container.offsetHeight || 1;
            camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
            camera.position.set(0, 3, 10);
            camera.lookAt(0, 0, 0);

            // Renderer setup
            const width = container.offsetWidth || 500;
            const height = container.offsetHeight || 500;

            renderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance"
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Style the renderer
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.display = 'block';
            
            container.appendChild(renderer.domElement);

            // Enhanced magical lighting
            const ambientLight = new THREE.AmbientLight(0xd4af37, 0.8);
            scene.add(ambientLight);

            const directionalLight1 = new THREE.DirectionalLight(0xffd700, 1.5);
            directionalLight1.position.set(10, 15, 10);
            directionalLight1.castShadow = true;
            scene.add(directionalLight1);

            const directionalLight2 = new THREE.DirectionalLight(0xd4af37, 0.8);
            directionalLight2.position.set(-10, 10, -10);
            scene.add(directionalLight2);

            const pointLight = new THREE.PointLight(0xd4af37, 1.2, 100);
            pointLight.position.set(0, 10, 10);
            scene.add(pointLight);

            const spotLight = new THREE.SpotLight(0xffc371, 2, 100, Math.PI / 4, 0.3);
            spotLight.position.set(0, 20, 0);
            spotLight.target.position.set(0, 0, 0);
            scene.add(spotLight);
            scene.add(spotLight.target);

            // Create magical particles background
            createParticles();

            // Controls with auto-rotation
            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.enableZoom = true;
                controls.enablePan = false;
                controls.maxPolarAngle = Math.PI / 1.5;
                controls.minPolarAngle = Math.PI / 3;
                
                if (config.autoRotate) {
                    controls.autoRotate = true;
                    controls.autoRotateSpeed = config.rotationSpeed;
                }
            } else {
                console.log('OrbitControls not available');
            }

            // Initialize mixer and clock for animations
            clock = new THREE.Clock();
            animationMixer = null;

            // Load the FBX model
            loadFBXModel();

        } catch (error) {
            console.error('Error initializing FBX loader:', error);
            loadFallbackIframe();
        }
    }

    // Create magical particle effects
    function createParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );

            // Golden magical color
            colors.push(0xd4af37, 0xffd700, 0xffc371);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Animate particles
        function animateParticles() {
            const positions = particles.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        setInterval(animateParticles, 50);
    }

    // Load FBX model
    function loadFBXModel() {
        try {
            const loader = new THREE.FBXLoader();
            
            loader.load(
                config.fbxPath,
                // onSuccess
                function(fbx) {
                    console.log('✨ FBX model loaded successfully!');
                    
                    model = fbx;
                    scene.add(model);

                    // Scale and position the model
                    model.scale.set(0.1, 0.1, 0.1);
                    model.position.set(0, 0, 0);

                    // Traverse the model and enable shadows
                    model.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Enhance material if it exists
                            if (child.material) {
                                child.material.needsUpdate = true;
                                // Add magical emissive glow
                                if (child.material.emissive) {
                                    child.material.emissive.setHex(0xd4af37);
                                    child.material.emissiveIntensity = 0.3;
                                }
                            }
                        }
                    });

                    // If model has animations, set up animation mixer
                    if (fbx.animations && fbx.animations.length > 0) {
                        console.log('Animations found:', fbx.animations.length);
                        animationMixer = new THREE.AnimationMixer(model);
                        fbx.animations.forEach((clip) => {
                            animationMixer.clipAction(clip).play();
                        });
                    }

                    // Center the model
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    
                    model.position.sub(center);
                    
                    // Adjust camera to fit model
                    const maxDim = Math.max(size.x, size.y, size.z);
                    camera.position.z = maxDim * 2;
                    camera.lookAt(0, 0, 0);

                    // Start animation loop
                    animate();
                },
                // onProgress
                function(xhr) {
                    if (xhr.lengthComputable) {
                        const percentComplete = xhr.loaded / xhr.total * 100;
                        console.log('Loading FBX: ' + Math.round(percentComplete) + '%');
                        // You can add a loading bar here if needed
                    }
                },
                // onError
                function(error) {
                    console.error('❌ Error loading FBX model:', error);
                    console.log('Falling back to iframe...');
                    loadFallbackIframe();
                }
            );
        } catch (error) {
            console.error('FBXLoader error:', error);
            loadFallbackIframe();
        }
    }

    // Fallback to iframe if FBX loading fails
    function loadFallbackIframe() {
        container.innerHTML = `
            <iframe 
                src="${config.fallbackUrl}" 
                frameborder="0" 
                scrolling="no"
                style="width: 100%; height: 100%; border: none;">
            </iframe>
        `;
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Update animation mixer if it exists
        if (animationMixer) {
            animationMixer.update(delta);
        }

        // Update controls
        if (controls) {
            controls.update();
        }

        // Render
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    // Handle window resize
    function onWindowResize() {
        if (!camera || !renderer) return;

        const width = container.offsetWidth || 500;
        const height = container.offsetHeight || 500;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', () => {
        initFBXLoader();
    });

    window.addEventListener('resize', onWindowResize);

})();


