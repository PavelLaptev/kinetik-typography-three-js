import React from "react";
import styles from "./styles.module.scss";
import * as THREE from "three";

import Input from "../components/Input";
import Navigation from "../components/Navigation";

import { generateTexture } from "../utils";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const newColors = {
  main: "#2b3439",
  second: "#d2ff1f",
};

const Demo7 = () => {
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
    let planeProps = {
      width: 80,
      height: 60,
      poligons: 14,
    };

    let textureProps = {
      speed: 0.005,
      height: 4,
      width: 3,
    };

    // TEXTURE
    const planeTexture = new THREE.Texture(
      generateTexture(
        textureTextInput.current.value,
        newColors.main,
        newColors.second,
        1000
      )
    );

    planeTexture.needsUpdate = true;
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(textureProps.height, textureProps.width);
    const planeMaterial = new THREE.MeshLambertMaterial({
      map: planeTexture,
    });
    planeTexture.rotation = 0.3;

    // OBJECT
    const geometry = new THREE.PlaneBufferGeometry(
      planeProps.width,
      planeProps.height,
      planeProps.poligons * 1.2,
      planeProps.poligons
    );

    const plane = new THREE.Mesh(geometry, planeMaterial);

    var peak = 10;
    var vertices = plane.geometry.attributes.position.array;
    for (var i = 0; i <= vertices.length; i += 3) {
      vertices[i + 2] = peak * Math.random();
    }

    scene.add(plane);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(80, width / height, 1, 2000);
    camera.position.z = 16;

    // LIGHT
    const light = new THREE.AmbientLight("rgb(100%, 100%, 100%)", 1, 1500);
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
      planeTexture.offset.x -= textureProps.speed / 2;
      planeTexture.offset.y += textureProps.speed;
      // planeTexture.rotation -= textureProps.speed / 2;
      // camera.rotation.z += 0.001;
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
        planeTexture.repeat.set(textureProps.width, textureProps.height);
      },
      height: (e) => {
        textureProps.height = e.target.value;
        planeTexture.repeat.set(textureProps.width, textureProps.height);
      },
      text: (e) => {
        planeMaterial.map.image = generateTexture(
          e.target.value,
          newColors.main,
          newColors.second,
          1000
        );
        planeMaterial.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        textureProps.speed = e.target.value / 1500;
      },
    };

    const handleMouseMove = (e) => {
      let mouseX = e.pageX - window.innerWidth / 2;
      let mouseY = e.pageY - window.innerHeight / 2;

      plane.rotation.x = mouseY / 1000;
      plane.rotation.z = (mouseY + mouseX) / 6000;
      plane.rotation.y = mouseX / 10000;
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
          val="3"
        />
        <Input
          type="range"
          ref={textureHeightSlider}
          label="Height"
          min="1"
          max="20"
          val="4"
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
          main: "#1d211f",
          second: newColors.second,
          third: "white",
        }}
      />
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo7;
