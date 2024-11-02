import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class ModelViewer {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        // 设置透明背景
        this.scene.background = null;

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 1, 4);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true, // 启用透明度
            premultipliedAlpha: false // 防止透明度混合问题
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setClearColor(0x000000, 0); // 设置清除颜色为透明
        this.container.appendChild(this.renderer.domElement);

        // 优化光照效果
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, 0, -5);
        this.scene.add(fillLight);

        // 添加轨道控制
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2;
        this.controls.enableZoom = true; // 允许缩放
        this.controls.minDistance = 2; // 限制最小距离
        this.controls.maxDistance = 6; // 限制最大距离
        this.controls.target.set(0, 1, 0); // 调整控制器目标点的高度

        // 加载模型
        const loader = new GLTFLoader();
        loader.load(
            'examples/image-tracking/assets/porcelain-example/softmind/scene.gltf',
            (gltf) => {
                this.model = gltf.scene;
                this.scene.add(this.model);
                
                // 调整模型位置和大小
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // 计算期望的模型高度
                const desiredHeight = 2.5; // 调整模型大小
                const scale = desiredHeight / size.y;
                
                // 应用缩放
                this.model.scale.setScalar(scale);
                
                // 重新计算包围盒
                box.setFromObject(this.model);
                box.getCenter(center);
                
                // 调整模型位置
                this.model.position.set(
                    -center.x,
                    -center.y + desiredHeight / 2,
                    -center.z
                );
                
                // 为模型添加材质效果
                this.model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        if (node.material) {
                            node.material.transparent = true;
                            node.material.opacity = 1;
                            node.material.envMapIntensity = 1;
                            node.material.needsUpdate = true;
                        }
                    }
                });
            },
            undefined,
            (error) => {
                console.error('An error happened:', error);
            }
        );

        // 开始动画循环
        this.animate();

        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

export { ModelViewer }; 