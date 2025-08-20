import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
console.log("GLB script yüklendi.");
// Modeli yükleyecek ve ölçeklendirecek fonksiyon
document.addEventListener('DOMContentLoaded', function () {
    initModels();
});
function initModels() {
    document.querySelectorAll('.model-container, #modelContainer').forEach(container => {
        console.log("GLB script yüklendi.");
        const modelPath = container.dataset.model;

        if (!modelPath) {
            console.error("Model yolu tanımlanmamış: 'data-model' özelliği eksik.");
            return;
        }

        // Scene, Camera ve Renderer
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            2000 // Fov'u genişlettik
        );

        // Kontrolleri ekle (modeli fare ile döndürmek için)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Daha akıcı bir hareket için
        controls.dampingFactor = 0.05;

        // Işık
        const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
        scene.add(ambientLight);

        // GLTF Loader
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (glb) => {
                const model = glb.scene;
                scene.add(model);

                // Modeli sahneye sığacak şekilde ölçeklendir ve kamerayı pozisyonlandır
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                // Kameranın modelin merkezine bakmasını sağla
                controls.target.copy(center);

                // Kamerayı modelin en büyük boyutuna göre konumlandır
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                cameraZ *= 1.5; // Modeli biraz daha uzaktan göstermek için

                camera.position.set(center.x, center.y + size.y / 2, center.z + cameraZ);
                camera.lookAt(center);

                // İsteğe bağlı olarak modeli döndürme animasyonu
                function animate() {
                    requestAnimationFrame(animate);
                    controls.update(); // Kontrolleri güncelle
                    renderer.render(scene, camera);
                }
                animate();

                // Ekran boyutu değiştiğinde
                window.addEventListener('resize', () => {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                });

            },
            (xhr) => {
                // Yükleme ilerlemesini göstermek isterseniz
                console.log((xhr.loaded / xhr.total * 100) + '% yüklendi');
            },
            (error) => {
                console.error("Model yüklenemedi:", error);
                container.innerHTML = "Model yüklenirken bir hata oluştu."; // Kullanıcıya hata mesajı göster
            }
        );
    });
}

// DOM yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', initModels);