import React from "react";
import styles from "./styles.module.scss";
import * as THREE from "three";
import { generateStripeTexture } from "./../utils";

import Input from "../components/Input";
import Navigation from "../components/Navigation";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Demo1 = (props) => {
  const mount = React.useRef(null);
  const textureWidthSlider = React.useRef(null);
  const textureHeightSlider = React.useRef(null);
  const textureRotationSlider = React.useRef(null);
  const textureTextInput = React.useRef(null);
  const poligonsSlider = React.useRef(null);
  const speedSlider = React.useRef(null);

  React.useEffect(() => {
    const canvas = mount.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      alpha: true,
    });

    // CAMERA
    const camera = new THREE.PerspectiveCamera(80, width / height, 0.1, 100);
    camera.position.z = 20;

    // TEXTURE
    const torusTexture = new THREE.Texture(
      generateStripeTexture(textureTextInput.current.value)
    );
    let textureProps = {
      width: 20,
      height: 6,
      speed: 0.009,
    };

    torusTexture.needsUpdate = true;
    torusTexture.wrapS = THREE.RepeatWrapping;
    torusTexture.wrapT = THREE.RepeatWrapping;
    torusTexture.repeat.set(
      textureWidthSlider.current.value,
      textureHeightSlider.current.value
    );
    const torusMaterial = new THREE.MeshPhongMaterial({ map: torusTexture });

    // OBJECTS
    const torusGeometry = new THREE.TorusKnotBufferGeometry(
      20,
      8,
      poligonsSlider.current.value,
      24
    );
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = -50;
    torus.rotation.z = 100;
    torus.position.y = 2;

    // LIGHT
    const light = new THREE.AmbientLight(0xffffff);

    // SCENE
    scene.add(torus, light);
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // FUNCTIONS
    const animate = () => {
      requestAnimationFrame(animate);
      torusTexture.offset.y -= textureProps.speed;
      torus.rotation.z -= 0.01;
      renderScene();
    };

    // INIT
    animate();

    // RESIZE
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    // TEXTURE CHANGES
    const changeTexture = {
      width: (e) => {
        textureProps.width = e.target.value;
        torusTexture.repeat.set(textureProps.width, textureProps.height);
      },
      height: (e) => {
        textureProps.height = e.target.value;
        torusTexture.repeat.set(textureProps.width, textureProps.height);
      },
      rotation: (e) => {
        torusTexture.rotation = e.target.value / 10;
      },
      text: (e) => {
        torus.material.map.image = generateStripeTexture(e.target.value);
        torus.material.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        textureProps.speed = e.target.value / 1000;
      },
    };

    const handlePoligons = (e) => {
      torus.geometry = new THREE.TorusKnotBufferGeometry(
        20,
        8,
        e.target.value,
        24
      );
    };

    // WATCHERS
    window.addEventListener("resize", handleResize);
    textureWidthSlider.current.addEventListener("change", changeTexture.width);
    textureHeightSlider.current.addEventListener(
      "change",
      changeTexture.height
    );
    textureRotationSlider.current.addEventListener(
      "change",
      changeTexture.rotation
    );
    textureTextInput.current.addEventListener("change", changeTexture.text);
    poligonsSlider.current.addEventListener("change", handlePoligons);
    speedSlider.current.addEventListener("change", changeTexture.handleSpeed);

    return () => {
      console.log("**CURSOR UNMOUNTED**");
    };
  }, []);

  const Inputs = () => {
    return (
      <>
        <Input
          type="range"
          ref={textureWidthSlider}
          label="Width"
          min="4"
          max="60"
          val="20"
        />
        <Input
          type="range"
          ref={textureHeightSlider}
          label="Height"
          min="1"
          max="60"
          val="6"
        />
        <Input
          type="range"
          ref={textureRotationSlider}
          label="Rotation"
          min="0"
          max="60"
          val="0"
        />
        <Input type="text" ref={textureTextInput} label="Text" val="YOUCAN" />
        <Input
          type="range"
          ref={speedSlider}
          label="Speed"
          min="1"
          max="100"
          val="10"
        />
        <Input
          type="range"
          ref={poligonsSlider}
          label="Poligons"
          min="3"
          max="100"
          val="80"
        />
      </>
    );
  };

  return (
    <div className={styles.wrap}>
      <Navigation
        inputs={<Inputs />}
        colors={{ main: "black", second: "#F2A5A3", third: "white" }}
      />
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo1;
