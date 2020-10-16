import React, {Component} from 'react';

import oilcanMtl from "../model/oilcan.mtl";
import oilcanObj from "../model/oilcan.obj"
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

class Demo01 extends Component{

    componentDidMount() {
        const mainCanvas = document.getElementById("canvas-dom-2");

        console.log(mainCanvas)

        const scene = new THREE.Scene();
        const geometry = new THREE.BoxGeometry(100, 100, 100);
        const material = new THREE.MeshLambertMaterial({color: 0x0000ff});
        const mesh = new THREE.Mesh(geometry, material);

        mesh.translateX(80);

        scene.add(mesh);

        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(400, 200, 300);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x444444);
        scene.add(ambientLight);


        const width = window.innerWidth;
        const height = window.innerHeight;
        const k = width / height;
        const s = 150;

        const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        camera.position.set(200, 300, 200);
        camera.lookAt(scene.position);


        const mtlLoader = new MTLLoader();
        //mtl材质加载器
        mtlLoader.load(oilcanMtl, mtl);

        //加载.mtl文件，执行mtl函数
        function mtl(material) {
            const objLoader = new OBJLoader();
            //obj模型加载器
            objLoader.setMaterials(material);
            //mtl材质赋值给obj模型
            objLoader.load(oilcanObj, obj);
            //加载.obj文件，执行obj函数
        }

        function obj(object3D) {
            // object3D.scale.set(100, 100, 100);
            //放大object3D对象
            scene.add(object3D);
            //object3D对象插入场景对象
        }


        const renderer = new THREE.WebGLRenderer({
            canvas: mainCanvas,
            antialias:true, //设置抗锯齿
            alpha:true, //背景透明
        });
        renderer.setClearColor(0x000000,0.0); //设置渲染器背景颜色
        renderer.setSize(mainCanvas.offsetWidth,mainCanvas.offsetHeight);

        const rayCaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();


        let flag = true;
        function onMouseClick(event){

            //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标

            mouse.x = ( (event.clientX - mainCanvas.getBoundingClientRect().left) / mainCanvas.offsetWidth ) * 2 - 1;
            mouse.y = - ( (event.clientY - mainCanvas.getBoundingClientRect().top) / mainCanvas.offsetHeight ) * 2 + 1;

            // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
            rayCaster.setFromCamera( mouse, camera );

            // 获取raycaster直线和所有模型相交的数组集合
            const intersects = rayCaster.intersectObjects(scene.children);
            console.log(intersects);

            //将所有的相交的模型的颜色设置为红色
            if (flag){
                for (let i = 0; i < intersects.length; i++ ) {
                    intersects[ i ].object.material.color.set( 0xff0000 );
                }
            }else{
                for (let i = 0; i < intersects.length; i++ ) {
                    intersects[ i ].object.material.color.set( 0x0000ff );
                }
            }
            flag = !flag;
        }

        mainCanvas.addEventListener( 'click', onMouseClick, false );

        const controls = new OrbitControls(camera,renderer.domElement);

        function renderThree() {
            mesh.rotateX(0.01);
            renderer.render(scene, camera);
            requestAnimationFrame(renderThree);
        }

        renderThree();

    }

    render() {
        return <canvas width={window.innerWidth} height={window.innerHeight} id="canvas-dom-2">您的浏览器不支持canvas!</canvas>;
    }
}

export default Demo01;
