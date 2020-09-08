import React from "react";
import styles from "./demo.module.scss";
import * as THREE from "three";
import RangeControl from "../components/RangeControl";

const generateTexture = (text) => {
  const bitmapShift = 80;
  const copyAmount = 4;
  const canvasSize = 400;
  const fontSize = 400 / copyAmount;

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

const Demo1 = (props) => {
  const mount = React.useRef(null);
  const [textureWidth, setTextureWidth] = React.useState(16);

  React.useEffect(() => {
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    // TEXTURE
    const torusTexture = new THREE.Texture(generateTexture("YOUCAN"));
    torusTexture.needsUpdate = true;
    torusTexture.wrapS = THREE.RepeatWrapping;
    torusTexture.wrapT = THREE.RepeatWrapping;
    torusTexture.repeat.set(textureWidth, 2);
    const torusMaterial = new THREE.MeshPhongMaterial({ map: torusTexture });

    // OBJECTS
    const torusGeometry = new THREE.TorusKnotBufferGeometry(14, 4, 120, 10);
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = -16;
    torus.position.y = 5;

    // LIGHT
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0.5, 1, 1).normalize();
    scene.add(light);

    // SCENE
    scene.add(torus);
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

    mount.current.appendChild(renderer.domElement);

    // RESIZE
    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    window.addEventListener("resize", handleResize);
  });

  return (
    <div className={styles.wrap} ref={mount}>
      <section className={styles.controls}>
        <RangeControl
          min="8"
          max="40"
          onChange={(e) => setTextureWidth(e.target.value)}
        />
      </section>
    </div>
  );
};

export default Demo1;
