import React from "react";
import styles from "./styles.module.scss";
import * as THREE from "three";

import Input from "../components/Input";
import Navigation from "../components/Navigation";

import { generateStripeTexture } from "../utils";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const newColors = {
  main: "#8e00ff",
  second: "#b3ff42",
  third: "#8e00ff",
};

const Demo6 = (props) => {
  const mount = React.useRef(null);
  const textureWidthSlider = React.useRef(null);
  const textureHeightSlider = React.useRef(null);
  const textureTextInput = React.useRef(null);
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

    // PROPS
    let boxProps = {
      scale: 12,
      poligons: 1,
    };

    let textureProps = {
      speed: 0.009,
      height: 2,
      width: 3,
    };

    // TEXTURE
    const boxTexture = new THREE.Texture(
      generateStripeTexture(textureTextInput.current.value, newColors)
    );

    boxTexture.needsUpdate = true;
    boxTexture.wrapS = THREE.RepeatWrapping;
    boxTexture.wrapT = THREE.RepeatWrapping;
    boxTexture.repeat.set(-textureProps.height, textureProps.width);
    const boxMaterial = new THREE.MeshPhongMaterial({
      map: boxTexture,
      side: THREE.BackSide,
    });

    // OBJECT
    const geometry = new THREE.BoxGeometry(
      boxProps.scale,
      boxProps.scale,
      boxProps.scale,
      boxProps.poligons,
      boxProps.poligons,
      boxProps.poligons
    );

    const cube = new THREE.Mesh(geometry, boxMaterial);
    cube.rotateX(0.5);
    cube.rotateY(-0.7);

    scene.add(cube);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(110, width / height, 1, 1100);
    camera.position.z = 2;

    // LIGHT
    const light = new THREE.PointLight("rgb(100%, 100%, 100%)", 1, 1500);
    light.position.set(0, 0, 0);
    scene.add(light);

    // SCENE
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // FUNCTIONS
    const animate = () => {
      requestAnimationFrame(animate);
      boxTexture.offset.x -= textureProps.speed;
      boxTexture.offset.z -= textureProps.speed;
      boxTexture.offset.y -= textureProps.speed;
      boxTexture.rotation -= textureProps.speed / 2;
      camera.rotation.z += 0.001;
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
        boxTexture.repeat.set(textureProps.width, textureProps.height);
      },
      height: (e) => {
        textureProps.height = e.target.value;
        boxTexture.repeat.set(textureProps.width, textureProps.height);
      },
      text: (e) => {
        boxMaterial.map.image = generateStripeTexture(
          e.target.value,
          newColors
        );
        boxMaterial.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        textureProps.speed = e.target.value / 1000;
      },
    };

    const handleMouseMove = (e) => {
      let mouseX = e.pageX - window.innerWidth / 2;
      let mouseY = e.pageY - window.innerHeight / 2;

      cube.rotation.x = mouseY / 200;
      cube.rotation.y = mouseX / 200;
    };

    // WATCHERS
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    textureWidthSlider.current.addEventListener("change", changeTexture.width);
    textureHeightSlider.current.addEventListener(
      "change",
      changeTexture.height
    );
    textureTextInput.current.addEventListener("change", changeTexture.text);
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
          min="1"
          max="20"
          val="2"
        />
        <Input
          type="range"
          ref={textureHeightSlider}
          label="Height"
          min="1"
          max="20"
          val="3"
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
      </>
    );
  };

  return (
    <div className={styles.wrap}>
      <Navigation
        inputs={<Inputs />}
        colors={{
          main: "#8e00ff",
          second: "#b3ff42",
          third: "white",
        }}
      />
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo6;
