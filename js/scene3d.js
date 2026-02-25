// ============================================================
// 3D 场景交互展示 — 数据配置 & 模板
// ============================================================
//
// 目录结构：
//   videos/{category}/{folder}/
//     outputs_360/orbit.mp4   ← 旋转预览视频
//     {folder}.obj            ← 3D 模型
//     material.mtl            ← 材质
//     material_0.png          ← 纹理贴图
//
// 每页 4 个（2×2），按分类排列：
//   第 1 页: bedroom
//   第 2 页: livingroom
//   第 3 页: others
// ============================================================

var scene3d_items = [
    // ── Page 1: Bedroom ──
    { category: "bedroom", folder: "44d15f42-a914-4d48-8add-393c57addfb4_Bedroom-16110" },
    { category: "bedroom", folder: "1928f513-0f29-4311-b8cd-bb9faa1d3be0_MasterBedroom-4104" },
    { category: "bedroom", folder: "2463f2a4-6b9d-4410-9d93-a2415fdffd86_MasterBedroom-21684" },
    { category: "bedroom", folder: "e5afb85b-f9b0-48dc-9fa6-cdd46d3193b6_MasterBedroom-30258" },

    // ── Page 2: Living Room ──
    { category: "livingroom", folder: "057af01e-97b2-46b7-9bd3-eefbdfe4f31c_LivingRoom-20951" },
    { category: "livingroom", folder: "23b1facb-b178-4875-86c3-1a2a853a3dae_LivingDiningRoom-14508" },
    { category: "livingroom", folder: "5e44b2a9-66ec-4d5b-adf0-c87ab69cc93c_LivingRoom-3797" },
    { category: "livingroom", folder: "b6fbd17c-7013-4fed-802f-e7075cce8329_LivingDiningRoom-56789" },

    // ── Page 3: Others ──
    { category: "others", folder: "3rscan_fcf66db0-622d-291c-8734-2a41fae7deb2" },
    { category: "others", folder: "arkitscenes_Training_44796483" },
    { category: "others", folder: "arkitscenes_Training_48458455" },
    { category: "others", folder: "scannet_scene0705_01" },
];


// ── 路径工具函数 ──
function scene3dPaths(item) {
    var base = "videos/" + item.category + "/" + item.folder + "/";
    return {
        video:    base + "outputs_360/orbit.mp4",
        obj:      item.folder + ".obj",
        mtl:      "material.mtl",
        basePath: base
    };
}


// ── Carousel 卡片模板（无文字） ──
// function scene3d_carousel_item_template(item, item_idx, info) {
//     var paths = scene3dPaths(item);
//     return '<div class="x-card clickable scene3d-card" style="min-width:120px; padding:8px;"'
//          + ' onclick="openScene3DWindow(scene3d_items[' + item_idx + '])">'
//          + '<div style="width:100%; aspect-ratio:1; overflow:hidden; border-radius:8px; background:#000;">'
//          + '<video autoplay playsinline loop muted'
//          + ' style="width:100%; height:100%; object-fit:cover;"'
//          + ' src="' + paths.video + '"></video>'
//          + '</div>'
//          + '</div>';
// }
function scene3d_carousel_item_template(item, item_idx, info) {
    var paths = scene3dPaths(item);
    var poster = paths.poster || paths.thumb || "";
  
    return ''
      + '<div class="x-card clickable scene3d-card" style="min-width:120px; padding:8px;"'
      + ' onclick="openScene3DWindow(scene3d_items[' + item_idx + '])">'
      + '  <div style="width:100%; aspect-ratio:1; overflow:hidden; border-radius:8px; background:#000;">'
      + '    <video class="scene3d-video"'
      + '      autoplay muted playsinline loop'
      + '      preload="metadata"'
      + '      poster="' + poster + '"'
      + '      data-src="' + paths.video + '"'
      + '      data-idx="' + item_idx + '"'
      + '      style="width:100%; height:100%; object-fit:cover;">'
      + '    </video>'
      + '  </div>'
      + '</div>';
  }


// ── 弹窗打开（精简版：只保留 3D 查看器 + 关闭按钮） ──
function openScene3DWindow(item) {
    var html = '<div class="scene3d-window-simple">'
             + '<div id="scene3d-canvas-container"></div>'
             + '</div>';

    openWindow(html);

    setTimeout(function () {
        if (window.initScene3DViewer) {
            var paths = scene3dPaths(item);
            window.initScene3DViewer({
                obj:      paths.obj,
                mtl:      paths.mtl,
                basePath: paths.basePath
            });
        }
    }, 300);
}
