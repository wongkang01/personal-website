"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { experiences, projects } from '@/content/data';

type MountainAscentGameProps = {
    onComplete?: () => void;
};

export default function MountainAscentGame({ onComplete }: MountainAscentGameProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [storyText, setStoryText] = useState<string>("The ascent begins. Every step is a lesson.");
    const [storyOpacity, setStoryOpacity] = useState(0);
    const [controlsOpacity, setControlsOpacity] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Refs to access latest state inside useEffect without triggering re-runs
    const isPlayingRef = useRef(isPlaying);
    const onCompleteRef = useRef(onComplete);
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
        if (controlsRef.current) {
            controlsRef.current.enabled = isPlaying;
        }
    }, [isPlaying]);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear any existing children to prevent duplicates
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // --- Configuration ---
        const COLORS = {
            sky: 0xdbebf0,
            sunriseSky: 0xffa07a,
            sunriseFog: 0xffd700,
            mountainGrass: 0x4CAF50,
            mountainSnow: 0xFFFFFF,
            platform: 0xd4b483,
            platformDark: 0x8b5a2b,
            treeDark: 0x2E7D32,
            treeLight: 0x66BB6A,
            shirt: 0xe63946,
            skin: 0xffccaa,
            cloud: 0xf0f0f0,
            sunlightStart: 0xfff0dd,
            sunlightEnd: 0xffaa00,
            hemisphereSky: 0xdbebf0,
            hemisphereGround: 0x4CAF50,
            hemisphereSunriseSky: 0xffe0a0,
            hemisphereSunriseGround: 0xffa07a
        };

        const MOUNTAIN_CONFIG = {
            height: 22,
            bottomRadius: 14,
            topRadius: 0.5,
            platformsPerTurn: 5,
            turns: 3.0,
            platformSize: { width: 2.2, depth: 1.0, height: 0.2 }
        };

        // --- State ---
        const playerState = {
            currentPlatformIndex: 0,
            platformPositions: [] as THREE.Vector3[],
            playerTargetPosition: new THREE.Vector3(),
            playerMoving: false,
            moveStartTime: 0,
            moveDuration: 0.3,
            hasWon: false,
            movingUp: true,
            sunriseActive: false,
            sunriseProgress: 0
        };

        let sunMesh: THREE.Mesh;
        let characterGroup: THREE.Group;
        const charParts: { [key: string]: THREE.Mesh } = {};
        let rainSystem: { mesh: THREE.Points; update: (dt: number, playerY: number) => void };

        // --- Helper Math ---
        const rng = (min: number, max: number) => Math.random() * (max - min) + min;

        // --- Scene Setup ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(COLORS.sky);
        scene.fog = new THREE.Fog(COLORS.sky, 20, 70);

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(20, 15, 20);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enabled = isPlayingRef.current;
        controls.minDistance = 5;
        controls.maxDistance = 40;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        controls.enablePan = true;
        controlsRef.current = controls;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(COLORS.sunlightStart, 1.2);
        sunLight.position.set(10, 30, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);

        const hemisphereLight = new THREE.HemisphereLight(
            COLORS.hemisphereSky,
            COLORS.hemisphereGround,
            0.5
        );
        scene.add(hemisphereLight);

        // --- 1. Procedural Mountain ---
        function createMountain() {
            const height = MOUNTAIN_CONFIG.height;
            const radius = MOUNTAIN_CONFIG.bottomRadius;
            const segments = 9;

            const geometry = new THREE.ConeGeometry(radius, height, segments, 6);
            const posAttribute = geometry.attributes.position;
            const vertex = new THREE.Vector3();

            for (let i = 0; i < posAttribute.count; i++) {
                vertex.fromBufferAttribute(posAttribute, i);
                if (vertex.y > -height / 2 + 0.5) {
                    const noise = 0.8;
                    vertex.x += rng(-noise, noise);
                    vertex.z += rng(-noise, noise);
                    vertex.y += rng(-0.3, 0.3);
                }
                posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }

            geometry.computeVertexNormals();
            const nonIndexedGeo = geometry.toNonIndexed();
            const pos = nonIndexedGeo.attributes.position;
            const count = pos.count;
            const colors: number[] = [];

            const colorGrass = new THREE.Color(COLORS.mountainGrass);
            const colorSnow = new THREE.Color(COLORS.mountainSnow);

            for (let i = 0; i < count; i++) {
                const y = pos.getY(i);
                const hNormalized = (y + height / 2) / height;
                const mixColor = new THREE.Color();
                let snowThreshold = 0.55;
                let snowFactor = Math.max(0, Math.min(1, (hNormalized - snowThreshold) / (1 - snowThreshold - 0.1)));

                mixColor.copy(colorGrass);
                mixColor.lerp(colorSnow, snowFactor);
                mixColor.multiplyScalar(rng(0.98, 1.02));
                colors.push(mixColor.r, mixColor.g, mixColor.b);
            }

            nonIndexedGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            const mat = new THREE.MeshStandardMaterial({
                vertexColors: true,
                flatShading: true,
                roughness: 0.8
            });

            const mesh = new THREE.Mesh(nonIndexedGeo, mat);
            mesh.position.y = height / 2;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            scene.add(mesh);
        }

        // --- 2. Objects ---
        function addPlatforms() {
            const totalPlatforms = Math.floor(MOUNTAIN_CONFIG.turns * MOUNTAIN_CONFIG.platformsPerTurn);
            const platformGeo = new THREE.BoxGeometry(
                MOUNTAIN_CONFIG.platformSize.width,
                MOUNTAIN_CONFIG.platformSize.height,
                MOUNTAIN_CONFIG.platformSize.depth
            );
            const supportGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
            const platformMat = new THREE.MeshStandardMaterial({ color: COLORS.platform, flatShading: true });
            const supportMat = new THREE.MeshStandardMaterial({ color: COLORS.platformDark, flatShading: true });

            for (let i = 0; i <= totalPlatforms; i++) {
                const t = i / totalPlatforms;
                let angle = t * MOUNTAIN_CONFIG.turns * Math.PI * 2;
                angle += rng(-0.2, 0.2);

                const mountainY = MOUNTAIN_CONFIG.height * t;
                let currentRadius = MOUNTAIN_CONFIG.bottomRadius * (1 - t) + MOUNTAIN_CONFIG.topRadius * t;
                currentRadius += rng(-0.6, 0.0); // Bias inwards to ensure contact

                const group = new THREE.Group();
                const mesh = new THREE.Mesh(platformGeo, platformMat);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                group.add(mesh);

                const support = new THREE.Mesh(supportGeo, supportMat);
                support.position.set(-0.5, -0.5, 0);
                support.rotation.z = Math.PI / 4;
                group.add(support);

                // Remove outward offset to keep platform centered on/inside mountain surface
                const offsetRadius = currentRadius;
                let platformY = mountainY + MOUNTAIN_CONFIG.platformSize.height / 2;
                platformY += rng(-0.1, 0.1);

                group.position.set(Math.cos(angle) * offsetRadius, platformY, Math.sin(angle) * offsetRadius);
                group.rotation.y = angle + Math.PI / 2;
                scene.add(group);

                playerState.platformPositions.push(group.position.clone());
            }
        }

        function createSun() {
            const geometry = new THREE.SphereGeometry(5, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            sunMesh = new THREE.Mesh(geometry, material);
            sunMesh.position.set(50, -15, -50);
            scene.add(sunMesh);
        }

        function createRain() {
            const particleCount = 1500;
            const geom = new THREE.BufferGeometry();
            const positions: number[] = [];

            for (let i = 0; i < particleCount; i++) {
                positions.push(rng(-30, 30), rng(0, 30), rng(-30, 30));
            }

            geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            const mat = new THREE.PointsMaterial({
                color: 0xaaddff,
                size: 0.15,
                transparent: true,
                opacity: 0.6
            });

            const system = new THREE.Points(geom, mat);
            scene.add(system);

            return {
                mesh: system,
                update: (dt: number, playerY: number) => {
                    const positions = system.geometry.attributes.position.array as Float32Array;
                    for (let i = 1; i < positions.length; i += 3) {
                        positions[i] -= 15 * dt;
                        if (positions[i] < -2) {
                            positions[i] = 30;
                        }
                    }
                    system.geometry.attributes.position.needsUpdate = true;
                    const fadeHeight = 12;
                    let opacity = 0.6 * (1 - Math.max(0, Math.min(1, playerY / fadeHeight)));
                    system.material.opacity = opacity;
                }
            };
        }

        function createEnvironment() {
            const ground = new THREE.Mesh(
                new THREE.CylinderGeometry(30, 30, 2, 32),
                new THREE.MeshStandardMaterial({ color: COLORS.mountainGrass, flatShading: true })
            );
            ground.position.y = -1;
            ground.receiveShadow = true;
            scene.add(ground);

            const treeGeo = new THREE.Group();
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 0.8, 5), new THREE.MeshStandardMaterial({ color: 0x5c4033, flatShading: true }));
            trunk.position.y = 0.4;
            trunk.castShadow = true;
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 5), new THREE.MeshStandardMaterial({ color: COLORS.treeDark, flatShading: true }));
            leaves.position.y = 1.5;
            leaves.castShadow = true;
            treeGeo.add(trunk);
            treeGeo.add(leaves);

            for (let i = 0; i < 60; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = rng(16, 28);
                const tree = treeGeo.clone();
                tree.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
                tree.scale.setScalar(rng(0.6, 1.2));
                scene.add(tree);
            }
        }

        function createCloud() {
            const cloudGeo = new THREE.DodecahedronGeometry(1, 0);
            const cloudMat = new THREE.MeshStandardMaterial({
                color: COLORS.cloud,
                flatShading: true,
                transparent: true,
                opacity: 0.9
            });

            const cloudGroup = new THREE.Group();
            const puffs = [
                { x: 0, y: 0, z: 0, s: 1.5 },
                { x: 1.2, y: 0.2, z: 0, s: 1.2 },
                { x: -1.2, y: 0.1, z: 0, s: 1.3 },
                { x: 0.5, y: 0.8, z: 0.5, s: 1.0 },
                { x: -0.5, y: 0.6, z: -0.5, s: 1.1 },
            ];

            puffs.forEach(p => {
                const mesh = new THREE.Mesh(cloudGeo, cloudMat);
                mesh.position.set(p.x, p.y, p.z);
                mesh.scale.set(p.s, p.s, p.s);
                cloudGroup.add(mesh);
            });

            cloudGroup.position.set(rng(-25, 25), rng(25, 35), rng(-25, 25));
            scene.add(cloudGroup);
        }

        function createCharacter() {
            const group = new THREE.Group();
            const shirtMat = new THREE.MeshStandardMaterial({ color: COLORS.shirt, flatShading: true });
            const skinMat = new THREE.MeshStandardMaterial({ color: COLORS.skin, flatShading: true });
            const pantsMat = new THREE.MeshStandardMaterial({ color: 0x333333, flatShading: true });

            charParts.torso = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.25), shirtMat);
            charParts.torso.position.y = 0.75;
            charParts.torso.castShadow = true;
            group.add(charParts.torso);

            charParts.head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2), skinMat);
            charParts.head.position.y = 1.15;
            charParts.head.castShadow = true;
            group.add(charParts.head);

            charParts.leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), pantsMat);
            charParts.leftLeg.position.set(-0.1, 0.25, 0);
            charParts.leftLeg.castShadow = true;
            group.add(charParts.leftLeg);

            charParts.rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), pantsMat);
            charParts.rightLeg.position.set(0.1, 0.25, 0);
            charParts.rightLeg.castShadow = true;
            group.add(charParts.rightLeg);

            charParts.leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), skinMat);
            charParts.leftArm.position.set(-0.3, 0.7, 0);
            charParts.leftArm.rotation.z = 0.2;
            group.add(charParts.leftArm);

            charParts.rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), skinMat);
            charParts.rightArm.position.set(0.3, 0.7, 0);
            charParts.rightArm.rotation.z = -0.2;
            group.add(charParts.rightArm);

            scene.add(group);
            return group;
        }

        function createFlag() {
            const group = new THREE.Group();
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), new THREE.MeshStandardMaterial({ color: 0x888888 }));
            pole.position.y = 1;
            group.add(pole);
            const flag = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.05), new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
            flag.position.set(0.4, 1.5, 0);
            group.add(flag);

            if (playerState.platformPositions.length > 0) {
                const lastPlatformPos = playerState.platformPositions[playerState.platformPositions.length - 1];
                group.position.copy(lastPlatformPos);
                group.position.y += MOUNTAIN_CONFIG.platformSize.height / 2;
                group.position.x += 0.5;
            }
            scene.add(group);
        }

        // --- Init ---
        createMountain();
        addPlatforms();
        createEnvironment();
        characterGroup = createCharacter();
        createFlag();
        for (let i = 0; i < 3; i++) createCloud();
        rainSystem = createRain();
        createSun();

        if (playerState.platformPositions.length > 0) {
            const startPlatform = playerState.platformPositions[0];
            const platformHalfHeight = MOUNTAIN_CONFIG.platformSize.height / 2;
            characterGroup.position.set(
                startPlatform.x,
                startPlatform.y + platformHalfHeight,
                startPlatform.z
            );
            playerState.playerTargetPosition.copy(characterGroup.position);
            characterGroup.lookAt(0, characterGroup.position.y, 0);
        }

        const clock = new THREE.Clock();
        const CHAR_CENTER_OFFSET = 0.75;

        function startPlayerMove() {
            playerState.playerMoving = true;
            playerState.moveStartTime = clock.getElapsedTime();
            const targetPlatform = playerState.platformPositions[playerState.currentPlatformIndex];
            const platformHalfHeight = MOUNTAIN_CONFIG.platformSize.height / 2;

            playerState.playerTargetPosition.set(
                targetPlatform.x,
                targetPlatform.y + platformHalfHeight,
                targetPlatform.z
            );
        }

        // --- Story Logic ---
        const totalPlatforms = playerState.platformPositions.length;

        // 9 Story Points distributed across the climb
        const milestones = [
            {
                threshold: Math.floor(totalPlatforms * 0.05),
                text: "It started with a fascination for tech products—how they shape the way we live and interact.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.15),
                text: "That curiosity evolved into a drive to build complex systems and understand the financial engines behind them.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.25),
                text: "I chose Computer Science to bridge the gap between product vision and technical reality.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.35),
                text: "Summer 2022. That's when I wrote my first lines of code.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.45),
                text: "In Nov 2024, I built machine learning models with Python to predict crop yields, learning how data drives sustainability.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.55),
                text: "In early 2025, I delved into Android development, building Wandr which won the Singtel InfoSys Award.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.65),
                text: "At AI Singapore, I engineered multi-agent systems using LangGraph and Gemini to automate complex workflows.",
            },
            {
                threshold: Math.floor(totalPlatforms * 0.75),
                text: "Now, I'm diving deep into Web3 and Finance, exploring the future of value.",
            },
            {
                threshold: totalPlatforms - 3,
                text: "My aspiration? To keep learning, keep building, and keep climbing mountains.",
            }
        ];

        function updateStory() {
            const currentIdx = playerState.currentPlatformIndex;
            const activeMilestone = milestones.slice().reverse().find(m => currentIdx >= m.threshold);

            if (activeMilestone) {
                setStoryText(activeMilestone.text);
                setStoryOpacity(1);
            }
        }

        function updatePlayer() {
            if (playerState.hasWon) return;

            const sunriseStartPlatformIndex = playerState.platformPositions.length - 4;
            if (playerState.currentPlatformIndex >= sunriseStartPlatformIndex && !playerState.hasWon) {
                playerState.sunriseActive = true;
                const platformsInZone = playerState.platformPositions.length - sunriseStartPlatformIndex;
                playerState.sunriseProgress = Math.min(1, (playerState.currentPlatformIndex - sunriseStartPlatformIndex + 1) / platformsInZone);
            } else if (playerState.currentPlatformIndex < sunriseStartPlatformIndex && playerState.sunriseActive) {
                playerState.sunriseProgress = Math.max(0, playerState.sunriseProgress - 0.05);
                if (playerState.sunriseProgress === 0) {
                    playerState.sunriseActive = false;
                }
            }

            if (playerState.playerMoving) {
                const elapsed = clock.getElapsedTime() - playerState.moveStartTime;
                const progress = Math.min(1, elapsed / playerState.moveDuration);

                characterGroup.position.lerpVectors(characterGroup.position, playerState.playerTargetPosition, 0.15);
                characterGroup.position.y += Math.sin(progress * Math.PI) * 0.1;

                let lookAtPos;
                if (playerState.currentPlatformIndex < playerState.platformPositions.length - 1 && playerState.currentPlatformIndex > 0) {
                    let lookAtIdx = playerState.movingUp ? playerState.currentPlatformIndex + 1 : playerState.currentPlatformIndex - 1;
                    lookAtIdx = Math.max(0, Math.min(lookAtIdx, playerState.platformPositions.length - 1));
                    lookAtPos = playerState.platformPositions[lookAtIdx];
                } else {
                    lookAtPos = new THREE.Vector3(0, characterGroup.position.y, 0);
                }
                characterGroup.lookAt(lookAtPos.x, characterGroup.position.y, lookAtPos.z);

                const freq = 20;
                charParts.leftLeg.rotation.x = Math.sin(elapsed * freq) * 0.5;
                charParts.rightLeg.rotation.x = -Math.sin(elapsed * freq) * 0.5;
                charParts.leftArm.rotation.x = -Math.sin(elapsed * freq) * 0.5;
                charParts.rightArm.rotation.x = Math.sin(elapsed * freq) * 0.5;

                if (characterGroup.position.distanceTo(playerState.playerTargetPosition) < 0.1) {
                    playerState.playerMoving = false;
                    characterGroup.position.copy(playerState.playerTargetPosition);
                    updateStory(); // Check story update on arrival

                    if (playerState.currentPlatformIndex === playerState.platformPositions.length - 1) {
                        playerState.hasWon = true;
                        setControlsOpacity(0);
                        setStoryOpacity(0);
                        setTimeout(() => {
                            if (onComplete) onComplete();
                        }, 2000);
                    }
                }
            } else {
                const t = clock.elapsedTime;
                charParts.torso.position.y = CHAR_CENTER_OFFSET + Math.sin(t * 3) * 0.02;
                charParts.leftLeg.rotation.x = 0;
                charParts.rightLeg.rotation.x = 0;
                charParts.leftArm.rotation.x = 0;
                charParts.rightArm.rotation.x = 0;
            }
        }

        function updateSunrise(dt: number) {
            if (playerState.sunriseActive || playerState.sunriseProgress > 0) {
                const progress = playerState.sunriseProgress;

                scene.background = new THREE.Color().lerpColors(
                    new THREE.Color(COLORS.sky),
                    new THREE.Color(COLORS.sunriseSky),
                    progress
                );
                scene.fog!.color.lerpColors(
                    new THREE.Color(COLORS.sky),
                    new THREE.Color(COLORS.sunriseFog),
                    progress
                );

                const sunY = THREE.MathUtils.lerp(-15, 35, progress);
                const sunX = 50;
                const sunZ = -50;

                if (sunMesh) {
                    sunMesh.position.set(sunX, sunY, sunZ);
                }
                sunLight.position.set(sunX, sunY, sunZ);

                sunLight.color.lerpColors(
                    new THREE.Color(COLORS.sunlightStart),
                    new THREE.Color(COLORS.sunlightEnd),
                    progress
                );
                sunLight.intensity = THREE.MathUtils.lerp(1.2, 2.0, progress);

                hemisphereLight.color.lerpColors(
                    new THREE.Color(COLORS.hemisphereSky),
                    new THREE.Color(COLORS.hemisphereSunriseSky),
                    progress
                );
                hemisphereLight.groundColor.lerpColors(
                    new THREE.Color(COLORS.hemisphereGround),
                    new THREE.Color(COLORS.hemisphereSunriseGround),
                    progress
                );
                hemisphereLight.intensity = THREE.MathUtils.lerp(0.5, 1.0, progress);
            }
        }

        let animationId: number;
        function animate() {
            animationId = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.1);

            updatePlayer();
            updateSunrise(dt);

            if (rainSystem && characterGroup) {
                rainSystem.update(dt, characterGroup.position.y);
            }

            if (characterGroup) {
                const targetPos = new THREE.Vector3().copy(characterGroup.position);
                targetPos.y += 2;
                controls.target.lerp(targetPos, 0.05);
                controls.enabled = isPlayingRef.current; // Ensure controls stay synced with state
                controls.update();
            }

            renderer.render(scene, camera);
        }

        // Initial story fade in
        setTimeout(() => setStoryOpacity(1), 1000);

        animate();

        // --- Event Listeners ---
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlayingRef.current || playerState.hasWon) return;

            // Prevent default scrolling for game keys
            if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (playerState.playerMoving) return;

            if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
                if (playerState.currentPlatformIndex < playerState.platformPositions.length - 1) {
                    playerState.currentPlatformIndex++;
                    playerState.movingUp = true;
                    startPlayerMove();
                }
            } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
                if (playerState.currentPlatformIndex > 0) {
                    playerState.currentPlatformIndex--;
                    playerState.movingUp = false;
                    startPlayerMove();
                }
            }
        };

        const wrapper = wrapperRef.current;
        if (wrapper) {
            wrapper.addEventListener('keydown', handleKeyDown);
        }

        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(containerRef.current);

        // Cleanup
        return () => {
            if (wrapper) {
                wrapper.removeEventListener('keydown', handleKeyDown);
            }
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []); // Run only once on mount

    const handleStart = () => {
        setIsPlaying(true);
        setHasInteracted(true);
        wrapperRef.current?.focus();
    };

    return (
        <div 
            ref={wrapperRef}
            tabIndex={0}
            className="relative w-full h-full overflow-hidden bg-[#dbebf0] font-sans select-none outline-none"
        >
            <div ref={containerRef} className="w-full h-full block" />

            {/* Story Overlay - Bottom Center */}
            <div
                className="absolute bottom-12 left-0 w-full flex justify-center pointer-events-none transition-opacity duration-1000"
                style={{ opacity: storyOpacity }}
            >
                <div className="bg-white/90 backdrop-blur-md text-gray-900 px-8 py-4 rounded-xl max-w-3xl text-center shadow-xl border border-white/20 mx-4">
                    <p className="text-lg md:text-xl font-medium leading-relaxed tracking-wide">
                        {storyText}
                    </p>
                </div>
            </div>

            {/* Controls Hint - Bottom Left (Shifted up slightly to avoid overlap if needed, or keep as is) */}
            <div
                className="absolute bottom-8 left-8 pointer-events-none transition-opacity duration-500 hidden md:block"
                style={{ opacity: controlsOpacity }}
            >
                <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-white/40 text-gray-700 scale-90 origin-bottom-left">
                    <div className="flex items-center gap-3 text-xs font-semibold">
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono shadow-sm">W</span>
                            <span className="text-[9px] uppercase tracking-wider opacity-70">Up</span>
                        </div>
                        <div className="h-6 w-px bg-gray-300/50"></div>
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono shadow-sm">S</span>
                            <span className="text-[9px] uppercase tracking-wider opacity-70">Down</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Start Overlay */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-500 cursor-pointer hover:bg-black/30"
                    onClick={handleStart}
                >
                    <div className="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-transform duration-300 hover:scale-105">
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                            My Story
                        </h1>
                        <p className="text-white/90 text-lg font-medium tracking-wide">
                            {hasInteracted ? "Click to Resume" : "Click to Start Journey"}
                        </p>
                        <div className="mt-2 px-6 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold uppercase tracking-widest transition-colors group-hover:bg-white/30">
                            Play
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
