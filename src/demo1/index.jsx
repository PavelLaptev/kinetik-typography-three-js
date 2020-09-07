import React from "react";
import styles from "./demo.module.scss";
import * as THREE from "three";

import objTexture from "../assets/object-texture.png";

const Demo1 = (props) => {
  const mount = React.useRef(null);

  React.useEffect(() => {
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 20;

    // Texture
    const torusTexture = new THREE.TextureLoader().load(objTexture);
    torusTexture.wrapS = THREE.RepeatWrapping;
    torusTexture.wrapT = THREE.RepeatWrapping;
    torusTexture.repeat.set(16, 2);
    const torusMaterial = new THREE.MeshBasicMaterial({ map: torusTexture });

    // Torus
    const torusGeometry = new THREE.TorusKnotBufferGeometry(14, 4, 120, 10);
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = -16;
    torus.position.y = 5;

    //
    scene.add(torus);
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    mount.current.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      // torus.rotation.x += 0.01;
      // torus.rotation.y += 0.008;
      torusTexture.offset.y += 0.005;
      // torusTexture.rotationy = 130;
      torus.rotation.z += 0.006;
      renderScene();
    };

    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    window.addEventListener("resize", handleResize);

    animate();
  });

  return <div className={styles.wrap} ref={mount}></div>;
};

export default Demo1;
