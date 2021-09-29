import * as THREE from 'three';
import React, { useRef } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';
import { Link } from 'react-router-dom';

const GradientShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uAspect: 0,
  },
  // Vertex Shader
  glsl/* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
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

      float n = noise(vec3(center * 0.8, uTime * 0.5));
      vec3 color = hsl2rgb(0.13 + n * 0.1, 1.0, 0.65 * n);

      gl_FragColor = vec4(color, 1.0); 
    }
  `
);

extend({ GradientShaderMaterial });

const Wave = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  return (
    <mesh>
      <planeBufferGeometry args={[0.2, 0.1, 1, 1]} />
      <gradientShaderMaterial uColor={'tomato'} ref={ref} uAspect={window.innerWidth / window.innerHeight} />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ fov: 3, position: [0, 0, 5] }}>
      <Wave />
    </Canvas>
  );
};

const Gradient = () => {
  return (
    <>
      <Link style={{ position: 'absolute', zIndex: 1, color: '#fff' }} to="/">
        To root
      </Link>
      <Link style={{ position: 'absolute', zIndex: 1, color: '#fff', left: '10%' }} to="/light">
        To light
      </Link>
      <Scene />
    </>
  );
};

export default Gradient;
