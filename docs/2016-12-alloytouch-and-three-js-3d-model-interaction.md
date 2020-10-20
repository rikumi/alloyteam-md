---
title: AlloyTouch 与 three.js 3D 模型交互
date: 2016-12-08
author: TAT.dnt
source_link: http://www.alloyteam.com/2016/12/alloytouch-and-three-js-3d-model-interaction/
---

<!-- {% raw %} - for jekyll -->

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161207093956632-718807571.gif)

如你所见，上面的 cube 的旋转、加速、减速停止都是通过 AlloyTouch 去实现的。

演示  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161207094015913-505345057.png)

代码  

* * *

```javascript
&lt;script src="asset/three.js">&lt;/script>
&lt;script src="../../alloy_touch.js">&lt;/script>
 
&lt;script>
    var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 500;
 
    var scene = new THREE.Scene();
 
    var texture = new THREE.TextureLoader().load( 'asset/crate.gif' );
    //几何体
    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    //材质
    var material = new THREE.MeshBasicMaterial( { map: texture } );
 
    var mesh = new THREE.Mesh( geometry, material );
    //添加到舞台
    scene.add( mesh );
 
    var renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    
    animate();
 
    new AlloyTouch({
        touch: document,    //触摸整个文档
        vertical: false,            //监听横向触摸
        target: mesh.rotation,  //运动 mesh.rotation
        property: "y",              //被运动的属性 y
        factor: 0.08,               //运动期间的摩擦力
        moveFactor: 0.2     //拖拽期间的摩擦力
    })
&lt;/script>
```

factor 需要自己不断去调试出最佳的值，让松手之后的惯性运动的速率和时间达到最佳的效果。  
moveFactor 需要自己不断去调试出最佳的值，就是让横向拖拽的距离映射到旋转的角度上达到最跟手的效果。

如果，不需要惯性运动。比如像王者荣耀里的任务旋转就是没有惯性的，手指离开屏幕就会立马停止运动。如：

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161207094025226-19737363.gif)

你只需要在 new AlloyTouch 设置 inertia 为 false 便可。

无惯性演示  

* * *

![](http://images2015.cnblogs.com/blog/105416/201612/105416-20161207094038741-1173398716.png)

无惯性代码  

* * *

```html
&lt;script src="asset/three.js">&lt;/script>
&lt;script src="../../alloy_touch.js">&lt;/script>
&lt;script>
    ...
    ...
    ...
    animate();
 
    new AlloyTouch({
        touch: document,    //触摸整个文档
        vertical: false,            //监听横向触摸
        target: mesh.rotation,  //运动 mesh.rotation
        property: "y",              //被运动的属性 y
        factor: 0.08,               //运动期间的摩擦力
        moveFactor: 0.2 ,       //拖拽期间的摩擦力
        inertia: false      //禁止惯性运动
    })
&lt;/script>
```

开始 AlloyTouch 吧  

* * *

Github 地址：<https://github.com/AlloyTeam/AlloyTouch>  
欢迎 issues:<https://github.com/AlloyTeam/AlloyTouch/issues>  



<!-- {% endraw %} - for jekyll -->