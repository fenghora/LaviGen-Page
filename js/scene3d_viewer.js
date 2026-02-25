// ============================================================
// Three.js 交互式 3D OBJ 查看器  (ES Module)
// ============================================================
import * as THREE from 'three';
import { OBJLoader }     from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader }     from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls }  from 'three/addons/controls/OrbitControls.js';

let currentViewer = null;

// ── 查看器类 ──
class Scene3DViewer {
    constructor(container, opts) {
        this.container = container;
        this.opts      = opts;          // { obj, mtl, basePath }
        this.animId    = null;
        this.resizeObs = null;
        this.initCamera = { pos: null, target: new THREE.Vector3(0, 0, 0) };

        this._initScene();
        this._loadModel();
        this._animate();
    }

    /* ---------- 初始化场景 ---------- */
    _initScene() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 1000);
        this.camera.position.set(0, 1, 3);

        // Renderer — 不使用 toneMapping，保证 OBJ 材质颜色准确
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // 阻止事件冒泡，避免被 fullscreen 层拦截
        this.renderer.domElement.addEventListener('wheel',     function (e) { e.stopPropagation(); });
        this.renderer.domElement.addEventListener('touchmove', function (e) { e.stopPropagation(); });

        // Lights — 充足的光照，避免模型偏暗
        var ambient = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambient);

        var dir1 = new THREE.DirectionalLight(0xffffff, 1.0);
        dir1.position.set(5, 10, 7.5);
        this.scene.add(dir1);

        var dir2 = new THREE.DirectionalLight(0xffffff, 0.6);
        dir2.position.set(-5, 5, -5);
        this.scene.add(dir2);

        var dir3 = new THREE.DirectionalLight(0xffffff, 0.4);
        dir3.position.set(0, -5, 5);
        this.scene.add(dir3);

        // OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping  = true;
        this.controls.dampingFactor  = 0.08;
        this.controls.screenSpacePanning = true;
        this.controls.maxPolarAngle  = Math.PI;

        // Responsive resize
        this.resizeObs = new ResizeObserver(() => {
            var rw = this.container.clientWidth;
            var rh = this.container.clientHeight;
            if (rw === 0 || rh === 0) return;
            this.camera.aspect = rw / rh;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(rw, rh);
        });
        this.resizeObs.observe(this.container);
    }

    /* ---------- 加载模型 ---------- */
    _loadModel() {
        var basePath = this.opts.basePath || '';

        // 加载提示
        var loadingDiv = document.createElement('div');
        loadingDiv.className = 'scene3d-loading';
        loadingDiv.innerHTML = '<div class="scene3d-spinner"></div><div>Loading 3D Model…</div>';
        this.container.appendChild(loadingDiv);

        var self = this;

        function onLoaded(object) {
            // 移除加载提示
            if (loadingDiv.parentNode) loadingDiv.remove();

            // 遍历所有 Mesh，修正材质：
            //  - 双面渲染
            //  - 将 color 设为白色，避免 Kd(0.4) 和纹理相乘导致变暗
            //  - 纹理颜色空间设为 sRGB
            object.traverse(function (child) {
                if (child.isMesh) {
                    var mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(function (mat) {
                        mat.side = THREE.DoubleSide;
                        // 把材质颜色重置为白色，让纹理以原始亮度显示
                        if (mat.color) {
                            mat.color.set(0xffffff);
                        }
                        if (mat.map) {
                            mat.map.colorSpace = THREE.SRGBColorSpace;
                            mat.map.needsUpdate = true;
                        }
                        mat.needsUpdate = true;
                    });
                }
            });

            // 居中并自适应缩放
            var box    = new THREE.Box3().setFromObject(object);
            var center = box.getCenter(new THREE.Vector3());
            var size   = box.getSize(new THREE.Vector3());
            object.position.sub(center);

            // 根据模型大小设置相机
            var maxDim  = Math.max(size.x, size.y, size.z);
            var fovRad  = self.camera.fov * (Math.PI / 180);
            var camDist = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.6;

            self.camera.position.set(camDist * 0.5, camDist * 0.35, camDist);
            self.camera.lookAt(0, 0, 0);
            self.controls.target.set(0, 0, 0);
            self.controls.update();

            // 保存初始相机位置，供 reset 使用
            self.initCamera.pos = self.camera.position.clone();

            self.scene.add(object);
        }

        function onError(err) {
            console.error('Model load error:', err);
            if (loadingDiv.parentNode) {
                loadingDiv.innerHTML = '<div style="color:#c00;font-size:14px;">Failed to load 3D model</div>';
            }
        }

        if (this.opts.mtl) {
            var mtlLoader = new MTLLoader();
            mtlLoader.setPath(basePath);
            mtlLoader.setResourcePath(basePath);   // 确保纹理从同一目录加载
            mtlLoader.load(this.opts.mtl, function (materials) {
                materials.preload();
                var objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(basePath);
                objLoader.load(self.opts.obj, onLoaded, undefined, onError);
            }, undefined, function () {
                // MTL 加载失败时仍尝试加载 OBJ
                console.warn('MTL load failed, loading OBJ without materials.');
                var objLoader = new OBJLoader();
                objLoader.setPath(basePath);
                objLoader.load(self.opts.obj, onLoaded, undefined, onError);
            });
        } else {
            var objLoader = new OBJLoader();
            objLoader.setPath(basePath);
            objLoader.load(this.opts.obj, onLoaded, undefined, onError);
        }
    }

    /* ---------- 动画循环 ---------- */
    _animate() {
        var self = this;
        this.animId = requestAnimationFrame(function () { self._animate(); });
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    /* ---------- 重置相机 ---------- */
    resetCamera() {
        if (this.initCamera.pos) {
            this.camera.position.copy(this.initCamera.pos);
            this.controls.target.copy(this.initCamera.target);
            this.controls.update();
        }
    }

    /* ---------- 清理资源 ---------- */
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
        this.scene.traverse(function (child) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(function (m) { m.dispose(); });
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}


// ── 暴露给全局调用的 API ──

window.initScene3DViewer = function (opts) {
    var container = document.getElementById('scene3d-canvas-container');
    if (!container) return;
    if (currentViewer) { currentViewer.dispose(); currentViewer = null; }
    currentViewer = new Scene3DViewer(container, opts);
};

window.cleanupScene3DViewer = function () {
    if (currentViewer) { currentViewer.dispose(); currentViewer = null; }
};

window.resetScene3DCamera = function () {
    if (currentViewer) currentViewer.resetCamera();
};
