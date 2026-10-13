'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface TeacherCanvas3DProps {
  mood?: 'greeting' | 'explaining' | 'pointing' | 'encouraging' | 'celebrating'
  isSpeaking?: boolean
  onWebGLError?: () => void
}

export default function TeacherCanvas3D({
  mood = 'explaining',
  isSpeaking = false,
  onWebGLError,
}: TeacherCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isSpeakingRef = useRef(isSpeaking)
  const moodRef = useRef(mood)

  useEffect(() => {
    isSpeakingRef.current = isSpeaking
    moodRef.current = mood
  }, [isSpeaking, mood])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 360
    const height = container.clientHeight || 420

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(renderer.domElement)
    } catch {
      onWebGLError?.()
      return
    }

    // Scene and Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0, 1.35, 3.4)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xe0e7ff, 1.4)
    mainLight.position.set(2, 4, 3)
    mainLight.castShadow = true
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.8)
    rimLight.position.set(-3, 2, -2)
    scene.add(rimLight)

    const warmLight = new THREE.PointLight(0xfef3c7, 0.5, 6)
    warmLight.position.set(0, 1, 1.5)
    scene.add(warmLight)

    // Avatar Master Group
    const avatarGroup = new THREE.Group()
    avatarGroup.position.set(0, -0.4, 0)
    scene.add(avatarGroup)

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf5d0b5,
      roughness: 0.6,
      metalness: 0.05,
    })
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.8,
    })
    const suitMat = new THREE.MeshStandardMaterial({
      color: 0x312e81,
      roughness: 0.5,
    })
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
    })
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
    })
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.2,
    })

    // Torso / Body
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.8, 16)
    const torso = new THREE.Mesh(torsoGeo, suitMat)
    torso.position.y = 0.95
    torso.castShadow = true
    avatarGroup.add(torso)

    // Shirt collar
    const collarGeo = new THREE.ConeGeometry(0.2, 0.25, 4)
    const collar = new THREE.Mesh(collarGeo, shirtMat)
    collar.position.set(0, 1.25, 0.16)
    collar.rotation.x = Math.PI
    avatarGroup.add(collar)

    // Tie
    const tieGeo = new THREE.BoxGeometry(0.07, 0.35, 0.03)
    const tie = new THREE.Mesh(tieGeo, tieMat)
    tie.position.set(0, 1.05, 0.28)
    avatarGroup.add(tie)

    // Head Neck Group
    const headGroup = new THREE.Group()
    headGroup.position.set(0, 1.48, 0)
    avatarGroup.add(headGroup)

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.16, 12)
    const neck = new THREE.Mesh(neckGeo, skinMat)
    neck.position.y = -0.06
    headGroup.add(neck)

    // Head Sphere
    const headGeo = new THREE.SphereGeometry(0.24, 24, 24)
    const head = new THREE.Mesh(headGeo, skinMat)
    head.castShadow = true
    headGroup.add(head)

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.25, 20, 20)
    const hair = new THREE.Mesh(hairGeo, hairMat)
    hair.position.set(0, 0.06, -0.03)
    hair.scale.set(1.02, 1.08, 1.02)
    headGroup.add(hair)

    // Hair Swoop Top
    const hairTopGeo = new THREE.BoxGeometry(0.38, 0.12, 0.36)
    const hairTop = new THREE.Mesh(hairTopGeo, hairMat)
    hairTop.position.set(0, 0.22, 0.02)
    headGroup.add(hairTop)

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a })
    const eyeGeo = new THREE.SphereGeometry(0.032, 12, 12)

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
    leftEye.position.set(-0.08, 0.02, 0.22)
    headGroup.add(leftEye)

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
    rightEye.position.set(0.08, 0.02, 0.22)
    headGroup.add(rightEye)

    // Glasses
    const glassesMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.8,
      roughness: 0.2,
    })
    const frameGeo = new THREE.TorusGeometry(0.05, 0.008, 8, 20)

    const leftLens = new THREE.Mesh(frameGeo, glassesMat)
    leftLens.position.set(-0.08, 0.02, 0.24)
    headGroup.add(leftLens)

    const rightLens = new THREE.Mesh(frameGeo, glassesMat)
    rightLens.position.set(0.08, 0.02, 0.24)
    headGroup.add(rightLens)

    const bridgeGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.06, 6)
    const bridge = new THREE.Mesh(bridgeGeo, glassesMat)
    bridge.position.set(0, 0.02, 0.245)
    bridge.rotation.z = Math.PI / 2
    headGroup.add(bridge)

    // Mouth
    const mouthGeo = new THREE.BoxGeometry(0.06, 0.015, 0.02)
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe123c })
    const mouth = new THREE.Mesh(mouthGeo, mouthMat)
    mouth.position.set(0, -0.1, 0.22)
    headGroup.add(mouth)

    // Right Arm (Pointing Arm toward whiteboard)
    const rightArmGroup = new THREE.Group()
    rightArmGroup.position.set(0.38, 1.25, 0)
    avatarGroup.add(rightArmGroup)

    const rightArmGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.45, 12)
    const rightArm = new THREE.Mesh(rightArmGeo, suitMat)
    rightArm.position.y = -0.2
    rightArmGroup.add(rightArm)

    const rightHandGeo = new THREE.SphereGeometry(0.065, 12, 12)
    const rightHand = new THREE.Mesh(rightHandGeo, skinMat)
    rightHand.position.y = -0.44
    rightArmGroup.add(rightHand)

    // Left Arm (Relaxed / Podium Arm)
    const leftArmGroup = new THREE.Group()
    leftArmGroup.position.set(-0.38, 1.25, 0)
    avatarGroup.add(leftArmGroup)

    const leftArmGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.45, 12)
    const leftArm = new THREE.Mesh(leftArmGeo, suitMat)
    leftArm.position.y = -0.2
    leftArmGroup.add(leftArm)

    const leftHandGeo = new THREE.SphereGeometry(0.065, 12, 12)
    const leftHand = new THREE.Mesh(leftHandGeo, skinMat)
    leftHand.position.y = -0.44
    leftArmGroup.add(leftHand)

    // Classroom Podium
    const podiumGeo = new THREE.BoxGeometry(0.85, 0.75, 0.4)
    const podium = new THREE.Mesh(podiumGeo, podiumMat)
    podium.position.set(0, 0.35, 0.45)
    podium.castShadow = true
    scene.add(podium)

    // Microphone on Podium
    const micStemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.25, 6)
    const micStemMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
    const micStem = new THREE.Mesh(micStemGeo, micStemMat)
    micStem.position.set(0.2, 0.82, 0.4)
    micStem.rotation.x = -0.3
    scene.add(micStem)

    const micHeadGeo = new THREE.SphereGeometry(0.022, 10, 10)
    const micHead = new THREE.Mesh(micHeadGeo, eyeMat)
    micHead.position.set(0.2, 0.94, 0.35)
    scene.add(micHead)

    // Floor Plane
    const floorGeo = new THREE.PlaneGeometry(10, 10)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.4
    floor.receiveShadow = true
    scene.add(floor)

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()
      const speaking = isSpeakingRef.current
      const currentMood = moodRef.current

      // Idle breathing and subtle body sway
      avatarGroup.position.y = -0.4 + Math.sin(elapsed * 2) * 0.015
      avatarGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.04

      // Head movement
      if (currentMood === 'pointing') {
        headGroup.rotation.y = -0.28 + Math.sin(elapsed * 1.5) * 0.05
        headGroup.rotation.x = -0.05
      } else {
        headGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.08
        headGroup.rotation.x = Math.sin(elapsed * 2) * 0.03
      }

      // Speaking mouth and head gestures
      if (speaking) {
        mouth.scale.y = 1 + Math.abs(Math.sin(elapsed * 14)) * 3
        headGroup.position.y = 1.48 + Math.sin(elapsed * 12) * 0.01
      } else {
        mouth.scale.y = 1
        headGroup.position.y = 1.48
      }

      // Arm gestures based on mood
      if (currentMood === 'pointing') {
        // Raise right arm pointing towards whiteboard
        rightArmGroup.rotation.z = -1.25 + Math.sin(elapsed * 2) * 0.08
        rightArmGroup.rotation.x = 0.55
      } else if (currentMood === 'greeting') {
        // Waving motion
        rightArmGroup.rotation.z = -1.6 + Math.sin(elapsed * 6) * 0.35
        rightArmGroup.rotation.x = 0.3
      } else if (currentMood === 'celebrating') {
        // Both hands slightly elevated
        rightArmGroup.rotation.z = -0.8 + Math.sin(elapsed * 3) * 0.15
        leftArmGroup.rotation.z = 0.8 + Math.cos(elapsed * 3) * 0.15
      } else {
        // Gentle relaxed natural posture
        rightArmGroup.rotation.z = -0.2 + Math.sin(elapsed * 1.5) * 0.05
        rightArmGroup.rotation.x = 0.1
        leftArmGroup.rotation.z = 0.2 + Math.cos(elapsed * 1.5) * 0.05
      }

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const newW = container.clientWidth
      const newH = container.clientHeight
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [onWebGLError])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '340px',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'none',
      }}
    />
  )
}
