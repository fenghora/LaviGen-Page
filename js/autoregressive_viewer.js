// ============================================================
// 自回归演示 — 嵌入式 Three.js 查看器 (ES Module)
// 支持动态换模型（保持相机位置）
// ============================================================
import * as THREE from 'three';
import { OBJLoader }     from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader }     from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls }  from 'three/addons/controls/OrbitControls.js';

let arViewer = null;

class ARViewer {
    constructor(container, initialPaths) {
        this.container = container;
        this.animId    = null;
        this.resizeObs = null;
        this.currentModel = null;
        this.isFirstLoad  = true;

        this._initScene();
        this._animate();
        this.swapModel(initialPaths);
    }

    _initScene() {
        var w = this.container.clientWidth;
        var h = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000);
        this.camera.position.set(2, 2, 4);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // 事件冒泡阻止
        this.renderer.domElement.addEventListener('wheel', function (e) { e.stopPropagation(); });
        this.renderer.domElement.addEventListener('touchmove', function (e) { e.stopPropagation(); });

        // 充足光照
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        var d1 = new THREE.DirectionalLight(0xffffff, 1.0);
        d1.position.set(5, 10, 7.5);
        this.scene.add(d1);
        var d2 = new THREE.DirectionalLight(0xffffff, 0.6);
        d2.position.set(-5, 5, -5);
        this.scene.add(d2);
        var d3 = new THREE.DirectionalLight(0xffffff, 0.4);
        d3.position.set(0, -5, 5);
        this.scene.add(d3);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping  = true;
        this.controls.dampingFactor  = 0.08;
        this.controls.screenSpacePanning = true;
        this.controls.maxPolarAngle  = Math.PI;

        this.resizeObs = new ResizeObserver(function () {
            var rw = this.container.clientWidth;
            var rh = this.container.clientHeight;
            if (rw === 0 || rh === 0) return;
            this.camera.aspect = rw / rh;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rw, rh);
        }.bind(this));
        this.resizeObs.observe(this.container);
    }

    swapModel(paths) {
        var self = this;
        var basePath = paths.basePath || '';

        // 显示加载指示
        var existing = this.container.querySelector('.scene3d-loading');
        if (existing) existing.remove();
        var loadingDiv = document.createElement('div');
        loadingDiv.className = 'scene3d-loading';
        loadingDiv.innerHTML = '<div class="scene3d-spinner"></div><div>Loading…</div>';
        this.container.appendChild(loadingDiv);

        function onLoaded(object) {
            if (loadingDiv.parentNode) loadingDiv.remove();

            // 移除旧模型
            if (self.currentModel) {
                self.scene.remove(self.currentModel);
                self.currentModel.traverse(function (c) {
                    if (c.geometry) c.geometry.dispose();
                    if (c.material) {
                        var mats = Array.isArray(c.material) ? c.material : [c.material];
                        mats.forEach(function (m) { m.dispose(); });
                    }
                });
            }

            // 修正材质
            object.traverse(function (child) {
                if (child.isMesh) {
                    var mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(function (mat) {
                        mat.side = THREE.DoubleSide;
                        if (mat.color) mat.color.set(0xffffff);
                        if (mat.map) {
                            mat.map.colorSpace = THREE.SRGBColorSpace;
                            mat.map.needsUpdate = true;
                        }
                        // 处理顶点颜色（无 MTL 时）
                        if (child.geometry && child.geometry.hasAttribute('color') && !mat.map) {
                            mat.vertexColors = true;
                        }
                        mat.needsUpdate = true;
                    });
                }
            });

            // 居中模型
            var box = new THREE.Box3().setFromObject(object);
            var center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);

            self.currentModel = object;
            self.scene.add(object);

            // 仅首次加载时自动设置相机
            if (self.isFirstLoad) {
                var size = box.getSize(new THREE.Vector3());
                var maxDim = Math.max(size.x, size.y, size.z);
                var fovRad = self.camera.fov * (Math.PI / 180);
                var camDist = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.6;
                self.camera.position.set(camDist * 0.5, camDist * 0.35, camDist);
                self.camera.lookAt(0, 0, 0);
                self.controls.target.set(0, 0, 0);
                self.controls.update();
                self.isFirstLoad = false;
            }
        }

        function onError(err) {
            console.error('AR model load error:', err);
            if (loadingDiv.parentNode) {
                loadingDiv.innerHTML = '<div style="color:#c00;font-size:14px;">Load failed</div>';
            }
        }

        if (paths.mtl) {
            var mtlLoader = new MTLLoader();
            mtlLoader.setPath(basePath);
            mtlLoader.setResourcePath(basePath);
            mtlLoader.load(paths.mtl, function (materials) {
                materials.preload();
                var objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(basePath);
                objLoader.load(paths.obj, onLoaded, undefined, onError);
            }, undefined, function () {
                var objLoader = new OBJLoader();
                objLoader.setPath(basePath);
                objLoader.load(paths.obj, onLoaded, undefined, onError);
            });
        } else {
            var objLoader = new OBJLoader();
            objLoader.setPath(basePath);
            objLoader.load(paths.obj, onLoaded, undefined, onError);
        }
    }

    _animate() {
        var self = this;
        this.animId = requestAnimationFrame(function () { self._animate(); });
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.resizeObs) this.resizeObs.disconnect();
        if (this.controls) this.controls.dispose();
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
    }
}

// 全局 API
window.initARViewer = function (paths) {
    var container = document.getElementById('ar-canvas-container');
    if (!container) return;
    if (arViewer) { arViewer.dispose(); arViewer = null; }
    arViewer = new ARViewer(container, paths);
};

window.arViewerSwapModel = function (paths) {
    if (arViewer) arViewer.swapModel(paths);
};

