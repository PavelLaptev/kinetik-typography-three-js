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
  main: "#deff00",
  second: "#FA3749",
};

const Demo4 = (props) => {
  const mount = React.useRef(null);
  const textureWidthSlider = React.useRef(null);
  const textureHeightSlider = React.useRef(null);
  const textureTextInput = React.useRef(null);
  const poligonsSlider = React.useRef(null);
  const speedSlider = React.useRef(null);
  const tensionSlider = React.useRef(null);

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
    const torusTexture = new THREE.Texture(
      generateStripeTexture(textureTextInput.current.value, newColors)
    );
    let meshProps = {
      width: 30,
      height: 1,
      speed: 0.009,
      poligons: 160,
    };

    torusTexture.needsUpdate = true;
    torusTexture.wrapS = THREE.RepeatWrapping;
    torusTexture.wrapT = THREE.RepeatWrapping;
    torusTexture.repeat.set(
      textureWidthSlider.current.value,
      textureHeightSlider.current.value
    );
    const torusMaterial = new THREE.MeshPhongMaterial({ map: torusTexture });

    // OBJECT
    const helixPoint = (a, b, t) => {
      return new THREE.Vector3(-a * Math.cos(t), -b * t, a * Math.sin(t));
    };

    const helixPointsArray = (a, b) => {
      const curvePoints = [];

      for (let t = -20; t < 20; t += 1) {
        curvePoints.push(helixPoint(a, b, t));
      }
      return curvePoints;
    };

    let spiralSpline = new THREE.CatmullRomCurve3(helixPointsArray(80, 6));

    let geometry = new THREE.TubeBufferGeometry(
      spiralSpline,
      140,
      16,
      2,
      false
    );

    const mesh = new THREE.Mesh(geometry, torusMaterial);
    scene.add(mesh);

    // Correct Y position
    var meshBox = new THREE.Box3().setFromObject(mesh);
    const meshBoxCenter = new THREE.Vector3();
    mesh.position.y = -meshBox.getCenter(meshBoxCenter).y;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(400, width / height, 0.1, 1000);
    camera.position.z = 200;

    // LIGHT
    const light = new THREE.AmbientLight("rgb(100%, 100%, 100%)", 1.2, 2500);
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
      torusTexture.offset.x -= meshProps.speed;
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
        torusTexture.repeat.set(meshProps.width, meshProps.height);
      },
      height: (e) => {
        meshProps.height = e.target.value;
        torusTexture.repeat.set(meshProps.width, meshProps.height);
      },
      text: (e) => {
        torusMaterial.map.image = generateStripeTexture(
          e.target.value,
          newColors
        );
        torusMaterial.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        meshProps.speed = e.target.value / 1000;
      },
    };

    const handleMouseMove = (e) => {
      let mouseX = e.pageX - window.innerWidth / 2;
      let mouseY = e.pageY - window.innerHeight / 2;

      mesh.rotation.z = mouseX / 2000;
      mesh.rotation.x = mouseY / 1000;
      mesh.rotation.y = -mouseY / 100;

      const scaleVal = () => {
        let val = (1 + mouseY / 1000).toFixed(2);
        let min = 1;
        let max = 1.7;

        if (val >= min && val <= max) {
          return val;
        }

        if (val < min) {
          return min;
        }

        if (val > max) {
          return max;
        }
      };

      mesh.scale.set(scaleVal(), 1, scaleVal());
    };

    const handlePoligons = (e) => {
      meshProps.poligons = e.target.value;
      mesh.geometry = new THREE.TubeBufferGeometry(
        spiralSpline,
        meshProps.poligons,
        16,
        2,
        false
      );
    };

    const handleTension = (e) => {
      spiralSpline = new THREE.CatmullRomCurve3(
        helixPointsArray(80, e.target.value)
      );

      mesh.geometry = new THREE.TubeBufferGeometry(
        spiralSpline,
        meshProps.poligons,
        16,
        2,
        false
      );
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
    poligonsSlider.current.addEventListener("change", handlePoligons);
    tensionSlider.current.addEventListener("change", handleTension);

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
          val="16"
        />
        <Input
          type="range"
          ref={textureHeightSlider}
          label="Height"
          min="1"
          max="8"
          val="1"
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
          min="8"
          step="8"
          max="240"
          val="160"
        />
        <Input
          type="range"
          ref={tensionSlider}
          label="Tension"
          min="2"
          max="18"
          val="6"
        />
      </>
    );
  };

  return (
    <div className={styles.wrap}>
      <Navigation
        inputs={<Inputs />}
        colors={{
          main: newColors.second,
          second: newColors.main,
          third: "white",
        }}
      />
      <canvas ref={mount} id="c" />
    </div>
  );
};

export default Demo4;
