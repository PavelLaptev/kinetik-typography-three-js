import React from "react";
import styles from "./demo.module.scss";
import * as THREE from "three";
import RangeControl from "../components/RangeControl";

const generateTexture = (text) => {
  const bitmapShift = 80;
  const copyAmount = 4;
  const canvasSize = 640;
  const fontSize = canvasSize / copyAmount;

  const bitmap = document.createElement("canvas");
  bitmap.width = canvasSize;
  bitmap.height = canvasSize;

  const g = bitmap.getContext("2d");
  g.font = `Bold ${fontSize}px Arial`;
  g.fillStyle = "blue";
  const textWidth = g.measureText(text).width;
  g.scale(canvasSize / textWidth, 1);
  const scaledText = (index) =>
    g.fillText(text, 0, fontSize * ++index - bitmapShift);

  Array(copyAmount + 1)
    .fill(0)
    .forEach((item, i) => {
      scaledText(i);
    });

  document.body.appendChild(bitmap);
  return bitmap;
};

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Demo1 = (props) => {
  const mount = React.useRef(null);
  const textureWidthSlider = React.useRef(null);

  React.useEffect(() => {
    const canvas = document.querySelector("#c");
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: false,
      alpha: true,
    });

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    // TEXTURE
    const torusTexture = new THREE.Texture(generateTexture("YOUCAN"));
    torusTexture.needsUpdate = true;
    torusTexture.wrapS = THREE.RepeatWrapping;
    torusTexture.wrapT = THREE.RepeatWrapping;
    torusTexture.repeat.set(16, 2);
    const torusMaterial = new THREE.MeshPhongMaterial({ map: torusTexture });

    // OBJECTS
    const torusGeometry = new THREE.TorusKnotBufferGeometry(14, 4, 120, 10);
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = -16;
    torus.position.y = 5;

    // LIGHT
    const light = new THREE.DirectionalLight(0xffffff);
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
      torusTexture.offset.y += 0.002;
      torus.rotation.z += 0.006;
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

    const handleTextureWidth = (e) => {
      torusTexture.repeat.set(e.target.value, 2);
      renderScene();
    };

    window.addEventListener("resize", handleResize);
    textureWidthSlider.current.addEventListener("change", handleTextureWidth);

    return () => {
      console.log("**CURSOR UNMOUNTED**");
      // console.clear();
    };
  }, []);

  return (
    <div className={styles.wrap} ref={mount}>
      <section className={styles.controls}>
        <RangeControl ref={textureWidthSlider} min="8" max="40" />
      </section>
      <canvas id="c" />
    </div>
  );
};

export default Demo1;
