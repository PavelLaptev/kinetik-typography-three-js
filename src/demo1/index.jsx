import React from "react";
import styles from "./demo.module.scss";
import * as THREE from "three";
import Input from "../components/Input";

const generateTexture = (text) => {
  const bitmapShift = 80;
  const copyAmount = 4;
  const canvasSize = 640;
  const fontSize = canvasSize / copyAmount;

  const bitmap = document.createElement("canvas");
  bitmap.width = canvasSize;
  bitmap.height = canvasSize;

  const g = bitmap.getContext("2d");

  // background
  g.fillStyle = "#ffa1a1";
  g.fillRect(0, 0, bitmap.width + 80, bitmap.height);

  // text
  g.fillStyle = "red";
  g.font = `Bold ${fontSize}px Arial`;
  g.fillStyle = "blue";
  const textWidth = g.measureText(text).width;
  g.scale(canvasSize / textWidth, 1);
  const fillAndShiftText = (index) =>
    g.fillText(text, 0, fontSize * ++index - bitmapShift);

  Array(copyAmount + 1)
    .fill(0)
    .forEach((item, i) => {
      fillAndShiftText(i);
    });

  // document.body.appendChild(bitmap);
  return bitmap;
};

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
      generateTexture(textureTextInput.current.value)
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
    light.position.set(0.5, 1, 1).normalize();

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
      // torusTexture.rotation += 0.001;
      // torusTexture.offset.x -= 0.008;
      // torus.rotation.y += 0.006;
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
        renderScene();
      },
      height: (e) => {
        textureProps.height = e.target.value;
        torusTexture.repeat.set(textureProps.width, textureProps.height);
        renderScene();
      },
      rotation: (e) => {
        torusTexture.rotation = e.target.value / 10;
        renderScene();
      },
      text: (e) => {
        torus.material.map.image = generateTexture(e.target.value);
        torus.material.map.needsUpdate = true;
        renderScene();
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

  return (
    <div className={styles.wrap}>
      <section className={styles.controls}>
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
          ref={poligonsSlider}
          label="Poligons"
          min="3"
          max="100"
          val="80"
        />
        <Input
          type="range"
          ref={speedSlider}
          label="Speed"
          min="1"
          max="100"
          val="10"
        />
      </section>
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo1;
