import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function OrbitalParticles() {
    const mesh = useRef<THREE.Points>(null!);

    const particles = Array.from({ length: 1000 }, () => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 1.5 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 2;
        return new THREE.Vector3(x, y, z);
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(particles);
    const material = new THREE.PointsMaterial({
        color: "#ffffff",       // Change to white
        size: 0.1,               // Increase size
        transparent: false,     // Remove opacity
        depthWrite: false,      // Improve rendering priority
    });


    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.0005;
            mesh.current.rotation.x += 0.0002;
        }
    });

    return <points ref={mesh} geometry={geometry} material={material} />;
}

export default function OrbitalCanvas() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{
                width: "100vw",
                height: "100vh",
                background: "limegreen", // TEMP: should make background lime green
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
            }}
        >
            <mesh rotation={[1, 1, 1]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        </Canvas>

    );
}
