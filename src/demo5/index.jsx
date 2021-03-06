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
  main: "#3A3A3A",
  second: "#DEDEDE",
  third: "#3A3A3A",
};

const Demo5 = (props) => {
  const mount = React.useRef(null);
  const textureWidthSlider = React.useRef(null);
  const textureHeightSlider = React.useRef(null);
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

    // TEXTURE
    const ballTexture = new THREE.Texture(
      generateStripeTexture(textureTextInput.current.value, newColors)
    );

    ballTexture.needsUpdate = true;
    ballTexture.wrapS = THREE.RepeatWrapping;
    ballTexture.wrapT = THREE.RepeatWrapping;
    ballTexture.repeat.set(
      textureWidthSlider.current.value,
      textureHeightSlider.current.value
    );
    const ballMaterial = new THREE.MeshPhongMaterial({ map: ballTexture });

    // OBJECT
    let meshProps = {
      height: 4,
      width: 4,
      scale: 30,
      speed: 0.009,
      poligons: 32,
    };

    const geometry = new THREE.SphereGeometry(
      meshProps.scale,
      meshProps.poligons,
      meshProps.poligons
    );

    const mesh = new THREE.Mesh(geometry, ballMaterial);
    mesh.rotation.z = 45;
    mesh.rotation.x = 550;
    mesh.rotation.y = -206;
    scene.add(mesh);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(400, width / height, 0.1, 1000);
    camera.position.z = 80;

    // LIGHT
    const light = new THREE.AmbientLight("rgb(100%, 100%, 100%)", 1, 2500);
    light.position.set(-200, 30, -30);
    scene.add(light);

    // SCENE
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // FUNCTIONS
    const animate = () => {
      requestAnimationFrame(animate);
      ballTexture.offset.y -= meshProps.speed;
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
        meshProps.width = e.target.value;
        ballTexture.repeat.set(meshProps.width, meshProps.height);
      },
      height: (e) => {
        meshProps.height = e.target.value;
        ballTexture.repeat.set(meshProps.width, meshProps.height);
      },
      text: (e) => {
        ballMaterial.map.image = generateStripeTexture(
          e.target.value,
          newColors
        );
        ballMaterial.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        meshProps.speed = e.target.value / 1000;
      },
    };

    const handleMouseMove = (e) => {
      let mouseX = e.pageX - window.innerWidth / 2;
      let mouseY = e.pageY - window.innerHeight / 2;

      mesh.rotation.x = mouseY / 200;
      mesh.rotation.y = mouseX / 200;

      let cameraZoom = 70 + -mouseX * 0.1;

      if (cameraZoom < 60) {
        camera.position.z = 60;
      } else if (cameraZoom > 100) {
        camera.position.z = 100;
      } else {
        camera.position.z = cameraZoom;
      }
    };

    const handlePoligons = (e) => {
      meshProps.poligons = e.target.value;
      mesh.geometry = new THREE.SphereGeometry(
        meshProps.scale,
        meshProps.poligons,
        meshProps.poligons
      );
    };

    // WATCHERS
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    poligonsSlider.current.addEventListener("change", handlePoligons);

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
          min="2"
          max="40"
          val="4"
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
        <Input
          type="range"
          ref={poligonsSlider}
          label="Poligons"
          min="2"
          step="1"
          max="64"
          val="32"
        />
      </>
    );
  };

  return (
    <div className={styles.wrap}>
      <Navigation
        inputs={<Inputs />}
        colors={{
          main: "#232323",
          second: "#949494",
          third: "white",
        }}
      />
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo5;
