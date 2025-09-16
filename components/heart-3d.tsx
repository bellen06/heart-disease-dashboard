"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Text3D } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Mesh } from "three"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function HeartGeometry({
  riskLevel = "low",
  isBeating = true,
}: { riskLevel?: "low" | "medium" | "high"; isBeating?: boolean }) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Heart shape using mathematical formula
  const heartShape = () => {
    const shape = new THREE.Shape()
    const x = 0,
      y = 0
    shape.moveTo(x + 5, y + 5)
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
    shape.bezierCurveTo(x - 6, y, x - 6, y + 3.5, x - 6, y + 3.5)
    shape.bezierCurveTo(x - 6, y + 5.5, x - 4, y + 7.7, x, y + 10)
    shape.bezierCurveTo(x + 4, y + 7.7, x + 6, y + 5.5, x + 6, y + 3.5)
    shape.bezierCurveTo(x + 6, y + 3.5, x + 6, y, x, y)
    shape.bezierCurveTo(x + 4, y, x + 5, y + 5, x + 5, y + 5)
    return shape
  }

  // Animation for heartbeat
  useFrame((state) => {
    if (meshRef.current && isBeating) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      meshRef.current.scale.setScalar(scale)
    }
  })

  // Color based on risk level
  const getHeartColor = () => {
    switch (riskLevel) {
      case "high":
        return "#e63946"
      case "medium":
        return "#f9c74f"
      case "low":
        return "#43aa8b"
      default:
        return "#f9c74f"
    }
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <extrudeGeometry args={[heartShape(), { depth: 2, bevelEnabled: true, bevelThickness: 0.5 }]} />
        <meshStandardMaterial
          color={getHeartColor()}
          metalness={0.3}
          roughness={0.4}
          emissive={getHeartColor()}
          emissiveIntensity={hovered ? 0.2 : 0.1}
        />
      </mesh>
    </Float>
  )
}

interface Heart3DProps {
  riskLevel?: "low" | "medium" | "high"
  isBeating?: boolean
  showRiskLabel?: boolean
  className?: string
}

export default function Heart3D({
  riskLevel = "low",
  isBeating = true,
  showRiskLabel = true,
  className = "w-full h-64",
}: Heart3DProps) {
  const getRiskText = () => {
    switch (riskLevel) {
      case "high":
        return "High Risk"
      case "medium":
        return "Medium Risk"
      case "low":
        return "Low Risk"
      default:
        return "Assessment"
    }
  }

  const getRiskColor = () => {
    switch (riskLevel) {
      case "high":
        return "#e63946"
      case "medium":
        return "#f9c74f"
      case "low":
        return "#43aa8b"
      default:
        return "#f9c74f"
    }
  }

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <HeartGeometry riskLevel={riskLevel} isBeating={isBeating} />

        {showRiskLabel && (
          <Text3D font="/fonts/Geist_Bold.json" size={1.5} height={0.2} position={[0, -8, 0]} curveSegments={12}>
            {getRiskText()}
            <meshStandardMaterial color={getRiskColor()} />
          </Text3D>
        )}

        <Environment preset="studio" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
