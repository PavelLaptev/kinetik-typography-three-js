import React from "react";
import styles from "./styles.module.scss";
import * as THREE from "three";

import Input from "../components/Input";
import Navigation from "../components/Navigation";

import { generateStripeTexture } from "./../utils";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Demo3 = (props) => {
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
    const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
    camera.position.z = 20;

    // TEXTURE
    const torusTexture = new THREE.Texture(
      generateStripeTexture(textureTextInput.current.value)
    );
    let textureProps = {
      width: 20,
      height: 5,
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

    // OBJ ARRAYS
    let torArray = [];
    let torusProps = [28, 9.8, 40];

    // OBJECTS
    Array(5)
      .fill(0)
      .forEach((item, i) => {
        const torusGeometry = new THREE.TorusBufferGeometry(
          ...torusProps,
          poligonsSlider.current.value
        );
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torArray.push(torus);
        torus.position.z = -i * i * 12;
        scene.add(torus);
      });

    // LIGHT
    const light = new THREE.PointLight("rgb(100%, 80%, 10%)", 1.5, 100);
    light.position.set(0, 0, -20);
    scene.add(light);

    const lightTwo = new THREE.PointLight("rgb(0%, 0%, 100%)", 0.5, 100);
    lightTwo.position.set(0, 0, -180);
    scene.add(lightTwo);

    const lightThree = new THREE.PointLight("rgb(10%, 0%, 100%)", 1, 100);
    lightThree.position.set(0, 0, -10);
    scene.add(lightThree);

    const lightFour = new THREE.AmbientLight("rgb(0%, 0%, 100%)", 1, 100);
    lightFour.position.set(0, 0, -100);
    scene.add(lightFour);

    // SCENE
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // FUNCTIONS
    const animate = () => {
      requestAnimationFrame(animate);
      torusTexture.offset.y -= textureProps.speed;
      // torus.rotation.z -= 0.01;
      torArray.forEach((item, i) => {
        item.rotation.z += 0.01 * i + 0.002;
      });
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
        renderScene();
      },
      text: (e) => {
        torusMaterial.map.image = generateStripeTexture(e.target.value);
        torusMaterial.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        textureProps.speed = e.target.value / 1000;
      },
    };

    const handlePoligons = (e) => {
      torArray.forEach((item, i) => {
        item.geometry = new THREE.TorusBufferGeometry(
          ...torusProps,
          e.target.value
        );
      });
    };

    const handleMouseMove = (e) => {
      // Update the mouse variable
      let mouseX = (e.clientX / window.innerWidth) * 4 - 1;
      let mouseY = -(e.clientY / window.innerHeight) * 4 + 1;

      light.position.set(mouseX * -6, mouseY * -6, -20 + mouseY * 6);

      torArray.forEach((torus, i) => {
        torus.position.x = mouseX;
        torus.position.y = mouseY;
      });
    };

    // WATCHERS
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

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
    speedSlider.current.addEventListener("change", changeTexture.handleSpeed);
    poligonsSlider.current.addEventListener("change", handlePoligons);

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
          min="2"
          max="60"
          val="6"
        />
        <Input
          type="range"
          ref={textureHeightSlider}
          label="Height"
          min="1"
          max="60"
          val="5"
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
          max="30"
          val="30"
        />
      </>
    );
  };

  return (
    <div className={styles.wrap}>
      <Navigation
        inputs={<Inputs />}
        colors={{ main: "#010032", second: "#EF92F9", third: "white" }}
      />
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo3;
