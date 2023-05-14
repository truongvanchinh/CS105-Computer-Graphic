import { RectAreaLightUniformsLib } from './lib/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from './lib/RectAreaLightHelper.js'
import { OrbitControls } from './lib/OrbitControls.js';
import * as TWEEN from './lib/tween.esm.js';
import { MeshPhongMaterial } from './lib/three.module.js';
// import TWEEN from '@tweenjs/tween.js'

function init(){
    var scene = new THREE.Scene();
    var gui = new dat.GUI()
    var clock = new THREE.Clock();
    var pointLight = getPointLight(1)
    var ambientLight = getAmbientLight(1)
    // var hepper = new THREE.CameraHelper(rectAreaLight.shadow.camera);
    var enableFog = false
    if (enableFog){
        scene.fog = new THREE.FogExp2(0xffffff,0.06)
    }

    // ------Get Element ------------
    // var new_box = document.querySelector('.box')
    // var box_x = document.querySelector('.box-x')
    // var box_y = document.querySelector('.box-y')
    // var box_z = document.querySelector('.box-z')
    // var box_name = document.querySelector('.box-name')
    
    // new_box.onclick = function() {
    //     box = getBox(box_x.value,box_y.value,box_z.value)
    //     box.name = box_name.value
    //     box.position.y = box.geometry.parameters.height/2;
    //     scene.add(box);
    // }
    // -------------------------
    // -----------Deleta box ----------
    var de_box = document.querySelector('.de-box')
    var de_box_name = document.querySelector('.box-name-de')
    var rotationElement = document.querySelector('.rotation')
    var translationElement = document.querySelector('.translation')
    var scaleElement = document.querySelector('.scale')
    var pointLightElement = document.querySelector('.pointLight')
    var spotLightElement = document.querySelector('.spotLight')
    var directionLightElement = document.querySelector('.directionLight')
    var rectAreaLightElement = document.querySelector('.rectAreaLight')

    // ----------box-------
    // var box = getBox(1,1,1)
    // box.position.y = box.geometry.parameters.height/2;
    // scene.add(box);
    // var plane = getPlane(100)
    // plane.rotation.x = Math.PI/2
    // scene.add(plane);
    // var sphere = getSphere(0.05)
    // var boxGrid = getBoxGrid(20, 2.5)
    // boxGrid.name="boxGrid";
    // scene.add(boxGrid)

    // ---------Material--------
    var sphereMaterial = getMaterial('standard', 'rgb(255,255,255)');
    var sphere = getSphere(sphereMaterial, 1,24);

    var planeMaterial = getMaterial('standard', 'rgb(255,255,255)');
    var plane = getPlane(planeMaterial, 300)

    var lightLeft = getSpotLight(1,'rgb(255,220,180')
    var lightRight = getSpotLight(1,'rgb(255,220,180')


    sphere.position.y = sphere.geometry.parameters.radius;
    plane.rotation.x = -Math.PI/2;

    lightLeft.position.x = -5;
    lightLeft.position.y = 2;
    lightLeft.position.z = -4;

    lightRight.position.x = 5;
    lightRight.position.y = 2;
    lightRight.position.z = -4;

    scene.add(lightLeft)
    scene.add(lightRight)
    scene.add(sphere)
    scene.add(plane)

    var lightLeftFolder = gui.addFolder("Light Left");
    lightLeftFolder.add(lightLeft,'intensity',0,10)
    lightLeftFolder.add(lightLeft.position, 'x',-10,20)
    lightLeftFolder.add(lightLeft.position, 'y',-10,20)
    lightLeftFolder.add(lightLeft.position, 'z',-10,20)
    lightLeftFolder.open()

    var lightRightFolder = gui.addFolder("Light Right");
    lightRightFolder.add(lightRight,'intensity',0,10)
    lightRightFolder.add(lightRight.position, 'x',-10,20)
    lightRightFolder.add(lightRight.position, 'y',-10,20)
    lightRightFolder.add(lightRight.position, 'z',-10,20)
    lightRightFolder.open()

    var materialFolder = gui.addFolder("Materials");
    materialFolder.add(sphereMaterial, 'roughness',0,1);
    materialFolder.add(planeMaterial, 'roughness',0,1);
    materialFolder.add(sphereMaterial, 'metalness',0,1);
    materialFolder.add(planeMaterial, 'metalness',0,1);
    materialFolder.open()

    // Texture Map
    // var path = './assests/cubemap/MilkyWay/dark-s_';
    // var format = '.jpg';
    // var urls = [
    //     path +'px'+ format, path + 'nx' + format,
    //     path +'py'+ format, path + 'ny' + format,
    //     path +'pz'+ format, path + 'nz' + format,
    // ];
    var path = './assests/cubemap/sky/';
    var format = '.jpg';
    var urls = [
        path +'px'+ format, path + 'nx' + format,
        path +'py'+ format, path + 'ny' + format,
        path +'pz'+ format, path + 'nz' + format,
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBAFormat;

    var loader = new THREE.TextureLoader();
    planeMaterial.map = loader.load('./assests/texture/colors.png');
    planeMaterial.bumpMap = loader.load('./assests/texture/colors.png');
    planeMaterial.roughnessMap = loader.load('./assests/texture/colors.png');
    planeMaterial.bumpScale = 0.01;
    planeMaterial.metalness = 0.1;
    planeMaterial.roughness = 0.7;

    sphereMaterial.map = loader.load('./assests/texture/kandao3.jpg');

    var maps=['map', 'bumpMap','roughnessMap'] 
    maps.forEach(function(mapName){
        var texture = planeMaterial[mapName]
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(15,15)
    })

    


    scene.background = reflectionCube;
    planeMaterial.envMap = reflectionCube
    sphereMaterial.envMap = reflectionCube
    // -------


    // -------------------------



    // pointLight.position.x = 2
    // pointLight.position.y = 4
    // pointLight.position.z = 8

    // pointLight.intensity = 2
    // // pointLight.add(sphere);
    // // scene.add(pointLight);

    // var pointFolder = gui.addFolder('Point Light')
    // pointFolder.add(pointLight,'intensity',0,10)
    // pointFolder.add(pointLight.position, 'x',-10,20)
    // pointFolder.add(pointLight.position, 'y',-10,20)
    // pointFolder.add(pointLight.position, 'z',-10,20)
    // pointFolder.open()

    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        1,
        1000
    );
    
    camera.position.x = 10;
    camera.position.y = 18;
    camera.position.z = -18;
    camera.lookAt(new THREE.Vector3(0,0,0))

    // left - right - top - bottom - near - far - 
    // var camera = new THREE.OrthographicCamera(
    //     -15,
    //     15,
    //     15,
    //     -15,
    //     1,
    //     1000
    // );

    // Chỉnh góc camera
    // var cameraYPosition = new THREE.Group();
    // var cameraZPosition = new THREE.Group();
    // var cameraYRotation = new THREE.Group();
    // var cameraZRotation = new THREE.Group();
    // var cameraXRotation = new THREE.Group();
    
    // cameraYPosition.name = 'cameraYPosition'
    // cameraZPosition.name = 'cameraZPosition'
    // cameraXRotation.name = 'cameraXRotation'
    // cameraYRotation.name = 'cameraYRotation'
    // cameraZRotation.name = 'cameraZRotation'

    // cameraZRotation.add(camera)
    // cameraYPosition.add(cameraZRotation);
    // cameraZPosition.add(cameraYPosition);
    // cameraXRotation.add(cameraZPosition);
    // cameraYRotation.add(cameraXRotation);
    // scene.add(cameraYRotation);

    // cameraXRotation.rotation.x = -2.6;
    // cameraYRotation.rotation.y = -3;
    // cameraYPosition.position.y = 3;
    // cameraZPosition.position.z = 20;


    // var cameraFolder = gui.addFolder("Camera")
    // cameraFolder.add(cameraZPosition.position, 'z', 0,200);
    // cameraFolder.add(cameraYRotation.rotation, 'y', -Math.PI,Math.PI);
    // cameraFolder.add(cameraXRotation.rotation, 'x', -Math.PI,Math.PI);
    // cameraFolder.add(cameraZRotation.rotation, 'z', -Math.PI,Math.PI);
    // cameraFolder.open();

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)');
    renderer.shadowMap.enabled = true;
    document.getElementById("webgl").appendChild(renderer.domElement);
    var controls = new OrbitControls( camera, renderer.domElement );

    // new TWEEN.Tween({val:100})
    //     .to({val: -50},1000)
    //     .onUpdate(function(){
    //         cameraZPosition.position.z = this.val;
    //     })
    //     .start();



    // new TWEEN.Tween({val: -Math.PI/2})
    //         .to({val: 0}, 6000)
    //         .delay(1000)
    //         .onUpdate(function(){
    //             cameraXRotation.rotation.x = this.val;
    //         })
    //         .start();
    
    // new TWEEN.Tween({val: 0})
    //     .to({val: Math.PI/2}, 6000)
    //     .delay(1000)
    //     .easing(TWEEN.Easing.Quadratic.InOut)
    //     .onUpdate(function(){
    //         cameraYRotation.rotation.y = this.val;
    //     })
    //     .start();

    
    
    // ----

    
    
    
    
    


    // ---------------Event -----------
    

    var rectAreaFolder,spotFolder,directionalFolder, planeLight

    de_box.onclick = function(){
        var de_box = scene.getObjectByName(de_box_name.value)
        scene.remove(de_box);
        this.animate()
    }

    rectAreaLightElement.onclick=function(){
        var dir = scene.getObjectByName('direct')
        var point = scene.getObjectByName('point')
        var spot = scene.getObjectByName('spot')
        RectAreaLightUniformsLib.init();
        var rectLight1 = getRectAreaLight(5,'0xffffff',4,10)
        scene.add( rectLight1 );
        planeLight = new RectAreaLightHelper( rectLight1 )
        scene.add(planeLight);
        if (dir !== undefined){
            scene.remove(dir)
            directionalFolder.close()
        }
        if (point !== undefined){
            scene.remove(point)
            pointFolder.close()
        }
        if (spot !== undefined){
            scene.remove(spot)
            spot.close()
        }

        if(rectAreaFolder===undefined){
            rectAreaFolder= gui.addFolder('Rect Area Light')
            rectAreaFolder.add(rectLight1.position, 'x', -20,20)
            rectAreaFolder.add(rectLight1.position, 'y', -20,20)
            rectAreaFolder.add(rectLight1.position, 'z', -20,20)
            rectAreaFolder.add(rectLight1, 'intensity', 0,10)
        }
        rectAreaFolder.open();
    }

    spotLightElement.onclick=function(){
        var rect = scene.getObjectByName('rect')
        var dir = scene.getObjectByName('direct')
        var point = scene.getObjectByName('point')
        var spotLight = getSpotLight(1)
        spotLight.position.y = 4
        spotLight.intensity = 2
        spotLight.add(sphere);
        scene.add(spotLight);
        
        if (dir !== undefined){
            scene.remove(dir)
            directionalFolder.close()
        }
        if (point !== undefined){
            scene.remove(point)
            pointFolder.close()
        }
        if (rect !== undefined){
            scene.remove(rect)
            scene.remove(planeLight)
            rectAreaFolder.close()
        }
        if(spotFolder===undefined){
            spotFolder = gui.addFolder('Spot Light')
            spotFolder.add(spotLight,'intensity',0,10)
            spotFolder.add(spotLight,'penumbra',0,1)
            spotFolder.add(spotLight.position, 'x',-10,20)
            spotFolder.add(spotLight.position, 'y',-10,20)
            spotFolder.add(spotLight.position, 'z',-10,20)
        }
        spotFolder.open();
        
    }

    pointLightElement.onclick=function(){
        var rect = scene.getObjectByName('rect')
        var dir = scene.getObjectByName('direct')
        var spot = scene.getObjectByName('spot')
        pointLight = getPointLight(1)
        pointLight.position.y = 4
        pointLight.intensity = 2
        pointLight.add(sphere);
        scene.add(pointLight);
        pointFolder.open();
        if (dir !== undefined){
            scene.remove(dir)
            directionalFolder.close()
        }
        if (spot !== undefined){
            scene.remove(spot)
            spot.close()
        }
        if (rect !== undefined){
            scene.remove(rect)
            scene.remove(planeLight)
            rectAreaFolder.close()
        }

    }

    directionLightElement.onclick=function(){
        var rect = scene.getObjectByName('rect')
        var point = scene.getObjectByName('point')
        var spot = scene.getObjectByName('spot')
        var directionLight = getDirectionLight(1)
        directionLight.position.y = 4
        directionLight.intensity = 2
        directionLight.add(sphere);
        scene.add(directionLight);
        
        if (point !== undefined){
            scene.remove(point)
            pointFolder.close()
        }
        if (spot !== undefined){
            scene.remove(spot)
            spot.close()
        }
        if (rect !== undefined){
            scene.remove(rect)
            scene.remove(planeLight)
            rectAreaFolder.close()
        }
        if(directionalFolder === undefined){
            directionalFolder = gui.addFolder('Directional Light')
            directionalFolder.add(directionLight,'intensity',0,10)
            directionalFolder.add(directionLight.position, 'x',-10,20)
            directionalFolder.add(directionLight.position, 'y',-10,20)
            directionalFolder.add(directionLight.position, 'z',-10,20)
        }
        directionalFolder.open();
    }
    // --------------------------------

    var ambientFolder = gui.addFolder('Ambient Light')
    const data = {
        ambient: false
    }
    ambientFolder.add(data, 'ambient').onChange(() => {
            if (data.ambient) {
                scene.add(ambientLight);
            } else if(ambientLight) {
                var de = scene.getObjectByName("ambient")
                scene.remove(de);
            }
    })

    

    update(renderer,scene,camera, controls,clock);
    return scene
}

function getBox(w,h,d){
    var geometry = new THREE.BoxGeometry(w,h,d);
    var material = new THREE.MeshStandardMaterial({
        color: 0xffffff, roughness: 0, metalness: 0
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;
    return mesh
}

function getPlane(material,size){
    var geometry = new THREE.PlaneGeometry(size,size);
    // var material = new THREE.MeshStandardMaterial({
    //     color: 0xffffff,
    //     side: THREE.DoubleSide,
    //     roughness: 0, 
    //     metalness: 0 
    // });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;
    return mesh
}

// function getSphere(size){
//     var geometry = new THREE.SphereGeometry(size,24,24);
//     var material = new THREE.MeshBasicMaterial({
//         color: 'rgb(255,255,255)',

//     });
//     var mesh = new THREE.Mesh(
//         geometry,
//         material
//     );

//     return mesh
// }

function getSphere(material,size, segment){
    var geometry = new THREE.SphereGeometry(size,segment,segment);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;

    return mesh
}

function getBoxGrid(amount, separationMultiplier){
    var group = new THREE.Group();
    for(var i=0; i<amount;i++){
        var obj = getBox(1,1,1);
        obj.position.x = i*separationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        group.add(obj);
        for(var j=0;j<amount;j++){
            var obj = getBox(1,1,1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            obj.position.z = j * separationMultiplier;
            group.add(obj)
        }
    }
    group.position.x = -(separationMultiplier*(amount-1)/2)
    group.position.z = -(separationMultiplier*(amount-1)/2)

    return group
}


function getPointLight(intensity){
    var light =new THREE.PointLight(0xffffff, intensity)
    light.castShadow = true;
    light.name = 'point'
    return light
}

function getSpotLight(intensity, color){
    var light =new THREE.SpotLight(color,intensity)
    light.castShadow = true;

    light.shadow.bias = 0.001
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.name = 'spot'
    return light
}

function getDirectionLight(intensity){
    var light = new THREE.DirectionalLight(0xffffff, intensity)
    light.castShadow = true;

    light.shadow.camera.left = -40;
    light.shadow.camera.bottom = -40;
    light.shadow.camera.right = 40;
    light.shadow.camera.top = 40;

    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.name = 'direct'
    return light
}

function getAmbientLight(intensity){
    var light = new THREE.AmbientLight('rgb(10,30,50)', intensity)
    light.name = "ambient";
    return light
}

function getRectAreaLight(intensity,color,width,height){
    const rectLight1 = new THREE.RectAreaLight( color, intensity, width,height);
    rectLight1.position.set(0,5,8)
    rectLight1.name = 'rect'
    return rectLight1
}

function getMaterial(type, color){
    var selectMaterial;
    var materialOption ={
        color: color === undefined? 'rgb(255,255,255)':color,

    };
    switch(type){
        case 'basic':
            selectMaterial = new THREE.MeshBasicMaterial(materialOption);
            break;
        case 'lambert':
            selectMaterial = new THREE.MeshLambertMaterial(materialOption);
            break;
        case 'phong':
            selectMaterial = new THREE.MeshPhongMaterial(materialOption);
            break;
        case 'standard':
            selectMaterial = new THREE.MeshStandardMaterial(materialOption);
            break;
    }
    return selectMaterial;
}
function update(renderer, scene, camera, controls,clock){
    renderer.render(
        scene,
        camera
    );
    controls.update();
    TWEEN.update(); 
    var timeElapsed = clock.getElapsedTime();
    // var cameraZRotation = scene.getObjectByName('cameraZRotation');
    // cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5)*0.02;

    // var boxGrid = scene.getObjectByName('boxGrid')
    // boxGrid.children.forEach(function(child,index){
    //     var x = timeElapsed + index
    //     child.scale.y = (noise.simplex2(x,x)+1)/2 + 0.001;
    //     child.position.y = child.scale.y/2
    // })
    
    
    requestAnimationFrame(function(){
        update(renderer, scene, camera,controls,clock)
    })
}

var scene = init();