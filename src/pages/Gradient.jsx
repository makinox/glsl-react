import * as THREE from 'three';
import React, { useRef, Suspense } from 'react';
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';
import { Link } from 'react-router-dom';

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
    uAspect: 0,
  },
  // Vertex Shader
  glsl/* glsl */ `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
    }
  `,
  // Fragment Shader
  glsl/* glsl */ `
    #pragma glslify: noise = require('glsl-noise/simplex/3d');
    #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');

    uniform float uAspect;
    uniform vec3 uColor;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 center = vUv - 0.5;
      center.x *= uAspect;

      float n = noise(vec3(center * 1.0, uTime * 0.5));
      vec3 color = hsl2rgb(0.6 + n * 0.9, 0.5, 0.5);

      gl_FragColor = vec4(color, 1.0); 
    }
  `
);

extend({ WaveShaderMaterial });

const Wave = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  const [image] = useLoader(THREE.TextureLoader, [
    'https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80',
  ]);

  return (
    <mesh>
      <planeBufferGeometry args={[0.8, 0.8, 1, 1]} />
      <waveShaderMaterial uColor={'tomato'} ref={ref} uTexture={image} uAspect={512 / 512} />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ fov: 2, position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
    </Canvas>
  );
};

const Gradient = () => {
  return (
    <>
      <Link style={{ position: 'absolute', zIndex: 1, color: '#fff' }} to="/">
        To root
      </Link>
      <Scene />
    </>
  );
};

export default Gradient;
