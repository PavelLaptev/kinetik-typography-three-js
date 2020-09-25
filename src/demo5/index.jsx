import React from "react";
import styles from "./styles.module.scss";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import Input from "../components/Input";
import Navigation from "../components/Navigation";

import { generateStripeTexture } from "../utils";

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const newColors = {
  main: "#343434",
  second: "#C4C4C4",
};

const Demo5 = (props) => {
  const mount = React.useRef(null);
  const textureWidthSlider = React.useRef(null);
  const textureHeightSlider = React.useRef(null);
  const textureTextInput = React.useRef(null);
  const poligonsSlider = React.useRef(null);
  const speedSlider = React.useRef(null);
  const tensionSlider = React.useRef(null);

  React.useEffect(() => {
    let meshProps = {
      width: 0.02,
      height: 0.01,
      speed: 0.009,
      poligons: 160,
    };

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
    const texture = new THREE.Texture(
      generateStripeTexture(textureTextInput.current.value, newColors)
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(meshProps.width, meshProps.height);
    texture.needsUpdate = true;
    const meshMaterial = new THREE.MeshPhongMaterial({ map: texture });

    // let uvGenerator = new THREE.UVsUtils.CylinderUVGenerator();

    // CURVE
    let closedSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-60, -30, 60),
      new THREE.Vector3(-60, 20, 60),
      new THREE.Vector3(-60, 120, 60),
      new THREE.Vector3(60, 20, -60),
      new THREE.Vector3(60, -100, -60),

      new THREE.Vector3(-130, -30, 90),
      new THREE.Vector3(-100, 20, 40),
      new THREE.Vector3(-100, 120, 60),
      new THREE.Vector3(60, 20, -60),
      new THREE.Vector3(60, -130, -60),
    ]);

    closedSpline.curveType = "catmullrom";
    closedSpline.closed = true;

    let extrudeSettings = {
      steps: 70,
      bevelEnabled: false,
      extrudePath: closedSpline,
      extrudeMaterial: 0,
      material: 1,
    };

    let pts = [];
    let count = 4;

    for (let i = 0; i < count; i++) {
      let l = 20;
      let a = ((2 * i) / count) * Math.PI;
      pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
    }

    // MESH
    let shape = new THREE.Shape(pts);
    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    let mesh = new THREE.Mesh(geometry, meshMaterial);
    scene.add(mesh);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(400, width / height, 0.1, 1000);
    camera.position.z = 300;

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 200;
    controls.maxDistance = 500;

    // LIGHT
    const light = new THREE.PointLight("rgb(100%, 100%, 100%)", 1.2, 2500);
    light.position.set(-200, 30, -30);
    scene.add(light);

    const light2 = new THREE.PointLight("rgb(100%, 100%, 100%)", 1.2, 2500);
    light2.position.set(100, -10, 100);
    scene.add(light2);

    var sphereSize = 3;
    var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
    var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize);
    scene.add(pointLightHelper, pointLightHelper2);

    // SCENE
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // ANIMATE
    const animate = () => {
      requestAnimationFrame(animate);
      texture.offset.x -= meshProps.speed;
      // camera.rotation.z += 0.001;
      controls.update();
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
        meshProps.width = e.target.value / 500;
        texture.repeat.set(meshProps.width, meshProps.height);
      },
      height: (e) => {
        meshProps.height = e.target.value / 500;
        texture.repeat.set(meshProps.width, meshProps.height);
      },
      text: (e) => {
        meshMaterial.map.image = generateStripeTexture(
          e.target.value,
          newColors
        );
        meshMaterial.map.needsUpdate = true;
      },
      handleSpeed: (e) => {
        meshProps.speed = e.target.value / 1000;
      },
    };

    // const handleMouseMove = (e) => {
    //   let mouseX = e.pageX - window.innerWidth / 2;
    //   let mouseY = e.pageY - window.innerHeight / 2;

    //   mesh.rotation.z = mouseX / 2000;
    //   mesh.rotation.x = mouseY / 1000;
    //   mesh.rotation.y = -mouseY / 100;
    // };

    // const handlePoligons = (e) => {
    //   meshProps.poligons = e.target.value;
    //   mesh.geometry.computeBoundingSphere();
    //   mesh.geometry = new THREE.TubeBufferGeometry(
    //     spiralSpline,
    //     e.target.value,
    //     16,
    //     2,
    //     false
    //   );
    // };

    // WATCHERS
    window.addEventListener("resize", handleResize);
    // window.addEventListener("mousemove", handleMouseMove);

    textureWidthSlider.current.addEventListener("change", changeTexture.width);
    textureHeightSlider.current.addEventListener(
      "change",
      changeTexture.height
    );
    textureTextInput.current.addEventListener("change", changeTexture.text);
    speedSlider.current.addEventListener("change", changeTexture.handleSpeed);
    // poligonsSlider.current.addEventListener("change", handlePoligons);

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
          max="10"
          val="6"
        />
        <Input
          type="range"
          ref={textureHeightSlider}
          label="Height"
          min="1"
          max="10"
          val="5"
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

export default Demo5;
