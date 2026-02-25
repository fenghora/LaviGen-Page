// ============================================================
// 自回归式布局生成 — 交互演示
// ============================================================

var AR_SCENE_BASE = "8c7a71d5-01c0-4537-8669-5c58b8054102_MasterBedroom-5149";
var AR_SUBSET_BASE = "scene_subsets";

// 家具列表（bit 0 → 5）
var ar_furniture = [
    { bit: 0, jid: "2367712e-695d-4b3a-bc44-a2711b48c3dd", label: "TV Stand" },
    { bit: 1, jid: "50823ece-f1e0-4a8e-b7d6-312953939076", label: "Cabinet" },
    { bit: 2, jid: "71ab8f57-0cf2-4efb-83bd-6d87258622a6", label: "Floor Lamp" },
    { bit: 3, jid: "602022db-9c17-43fa-97d2-111ba3438c38", label: "Double Bed" },
    { bit: 4, jid: "4f4f8527-9b6f-498b-859e-0e2574ec536d", label: "Wardrobe" },
    { bit: 5, jid: "20256e43-e58d-42d6-8f21-0810936def36", label: "Pendant Lamp" },
];

// 当前 bitmask 状态
var ar_mask = [0, 0, 0, 0, 0, 0];  // bit 0..5


// 获取当前 mask 字符串（如 "010011"）
function arMaskStr() {
    return ar_mask.join('');
}

// 获取当前子集的路径信息
function arSubsetPaths() {
    var maskStr = arMaskStr();
    var dir = AR_SUBSET_BASE + "/subset_" + maskStr + "/";
    var hasMtl = maskStr !== "000000";
    return {
        basePath: dir,
        obj: "subset_" + maskStr + ".obj",
        mtl: hasMtl ? "material.mtl" : null
    };
}

// 获取家具缩略图路径
function arThumbnail(item) {
    return AR_SCENE_BASE + "/models/" + item.jid + "/image.jpg";
}

// 添加家具（只能添加，不能移除）
function arAddFurniture(bit) {
    if (ar_mask[bit]) return;  // 已添加则忽略
    ar_mask[bit] = 1;
    arUpdatePanel();
    arLoadCurrentSubset();
}

// 更新右侧面板的选中状态
function arUpdatePanel() {
    for (var i = 0; i < ar_furniture.length; i++) {
        var el = document.getElementById("ar-item-" + i);
        if (!el) continue;
        if (ar_mask[i]) {
            el.classList.add("ar-item-active");
        } else {
            el.classList.remove("ar-item-active");
        }
    }
}

// 加载当前子集场景
function arLoadCurrentSubset() {
    var paths = arSubsetPaths();
    if (window.arViewerSwapModel) {
        window.arViewerSwapModel(paths);
    }
}

// 重置为空场景
function arReset() {
    ar_mask = [0, 0, 0, 0, 0, 0];
    arUpdatePanel();
    arLoadCurrentSubset();
}

// 构建整个演示区域的 HTML
function arBuildHTML() {
    var html = '';
    html += '<div class="ar-demo">';

    // 左侧：3D 查看器
    html += '<div class="ar-viewer-area">';
    html += '  <div id="ar-canvas-container"></div>';
    html += '</div>';

    // 右侧：家具面板
    html += '<div class="ar-panel">';
    html += '  <div class="ar-panel-title">';
    html += '    <span class="x-gradient-font" style="font-size:18px; font-weight:700;">Furniture</span>';
    html += '  </div>';
    html += '  <div class="ar-item-list">';
    for (var i = 0; i < ar_furniture.length; i++) {
        var item = ar_furniture[i];
        html += '<div id="ar-item-' + i + '" class="ar-item" onclick="arAddFurniture(' + i + ')">';
        html += '  <div class="ar-item-thumb">';
        html += '    <img src="' + arThumbnail(item) + '" alt="' + item.label + '">';
        html += '  </div>';
        html += '  <div class="ar-item-label">' + item.label + '</div>';
        html += '</div>';
    }
    html += '  </div>';
    html += '  <div class="ar-panel-actions">';
    html += '    <div class="ar-reset-btn" onclick="arReset()">Reset</div>';
    html += '  </div>';
    html += '</div>';

    html += '</div>';
    return html;
}

// 初始化演示
// function arInit() {
//     var container = document.getElementById('ar-demo-container');
//     if (!container) return;
//     container.innerHTML = arBuildHTML();

//     // 初始化 3D 查看器（延迟等待 DOM 渲染）
//     setTimeout(function () {
//         if (window.initARViewer) {
//             var paths = arSubsetPaths();
//             window.initARViewer(paths);
//         }
//     }, 500);
// }

(function () {
    // ---------- 全局状态（避免重复绑定/重复初始化） ----------
    const STATE_KEY = "__AR_DEMO_STATE__";
    const state = (window[STATE_KEY] ||= {
      viewer: null,
      resizeObs: null,
      wheelBound: false,
      lastInitToken: 0,
    });
  
    // ---------- 工具函数 ----------
    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
  
    function nextFrame(times = 1) {
      return new Promise((resolve) => {
        let n = 0;
        function tick() {
          n++;
          if (n >= times) resolve();
          else requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  
    async function waitFor(condFn, timeout = 4000, interval = 16) {
      const t0 = performance.now();
      while (true) {
        if (condFn()) return true;
        if (performance.now() - t0 > timeout) return false;
        await sleep(interval);
      }
    }
  
    async function waitForNonZeroSize(el, timeout = 2500) {
      // 先等两帧，让 innerHTML 插入和 layout 完成
      await nextFrame(2);
  
      const okNow = el.clientWidth > 0 && el.clientHeight > 0;
      if (okNow) return true;
  
      // 如果高度为 0，很多时候是 CSS 没给高度。这里给一个兜底最小高度，避免“永远 0”
      const cs = getComputedStyle(el);
      const h = parseFloat(cs.height || "0");
      if (!h || h <= 0) {
        // 兜底：不影响你已有 CSS；仅在确实为 0 时补一个
        el.style.minHeight ||= "520px";
      }
  
      // 用 ResizeObserver 等尺寸变为非 0
      return await new Promise((resolve) => {
        let done = false;
        const ro = new ResizeObserver(() => {
          if (el.clientWidth > 0 && el.clientHeight > 0) {
            done = true;
            ro.disconnect();
            resolve(true);
          }
        });
        ro.observe(el);
  
        setTimeout(() => {
          if (!done) {
            ro.disconnect();
            // 不强行 reject：有些布局就是晚一点才撑开，后续 resize 也会触发 viewer.resize
            resolve(false);
          }
        }, timeout);
      });
    }
  
    function safeDestroyViewer(viewer) {
      if (!viewer) return;
      try { viewer.dispose?.(); } catch (e) {}
      try { viewer.destroy?.(); } catch (e) {}
      try { viewer.stop?.(); } catch (e) {}
      // 如果你 viewer 里暴露了 renderer，可以顺手释放 WebGL 资源
      try { viewer.renderer?.dispose?.(); } catch (e) {}
    }
  
    function ensureWheelFix(container) {
      if (state.wheelBound) return;
      state.wheelBound = true;
  
      // 用 capture 抢先拦截（避免页面滚动 + viewer zoom 同时触发）
      container.addEventListener(
        "wheel",
        (e) => {
          // 只在鼠标在 viewer 区域内滚动时拦截
          // （事件目标通常是 canvas 或其子元素）
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false, capture: true }
      );
  
      // 额外保险：触控/滚动链路
      container.style.overscrollBehavior = "contain";
      container.style.touchAction = "none";
    }
  
    function ensureResizeObserver(container) {
      if (state.resizeObs) return;
  
      state.resizeObs = new ResizeObserver(() => {
        const v = state.viewer;
        if (!v) return;
  
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
  
        // 兼容不同 viewer 写法：优先调用你自己实现的 resize/onResize/setSize
        try {
          if (typeof v.resize === "function") v.resize(w, h);
          else if (typeof v.onResize === "function") v.onResize(w, h);
          else if (typeof v.setSize === "function") v.setSize(w, h);
          else if (v.renderer?.setSize) {
            v.renderer.setSize(w, h, false);
            if (v.camera) {
              v.camera.aspect = w / h;
              v.camera.updateProjectionMatrix?.();
            }
          }
        } catch (e) {
          console.warn("[arInit] resize handler error:", e);
        }
      });
  
      state.resizeObs.observe(container);
    }
  
    // ---------- 你要用的主函数：完整替换版 ----------
    async function arInit() {
      const container = document.getElementById("ar-demo-container");
      if (!container) return;
  
      // 每次 init 都生成一个 token；防止并发 init（比如 pageshow + 你手动调用）互相覆盖
      const token = ++state.lastInitToken;
  
      // 先把 HTML 塞进去
      container.innerHTML = arBuildHTML();
  
      // 拦截滚轮冲突（绑定一次即可，DOM 重建也不丢）
      ensureWheelFix(container);
  
      // 等容器尺寸可靠（防止 0x0 canvas）
      await waitForNonZeroSize(container);
  
      // 等 initARViewer 真正挂到 window 上（别赌 500ms）
      const ok = await waitFor(() => typeof window.initARViewer === "function", 5000, 20);
      if (!ok) {
        console.warn("[arInit] window.initARViewer is not ready (timeout).");
        return;
      }
  
      // 如果期间又触发了新的 arInit，这次就直接退出，避免旧 init 覆盖新 viewer
      if (token !== state.lastInitToken) return;
  
      // 销毁旧 viewer（避免重复初始化导致的 context/监听器问题）
      if (state.viewer) {
        safeDestroyViewer(state.viewer);
        state.viewer = null;
      }
  
      const paths = arSubsetPaths();
  
      // JS 多传一个参数不会报错；如果你愿意让 initARViewer 支持 container，可以直接用第二参
      let viewer = null;
      try {
        viewer = window.initARViewer(paths, container);
      } catch (e) {
        console.error("[arInit] initARViewer error:", e);
        return;
      }
  
      // 有些实现不返回 viewer，而是内部挂全局；这里做个兜底
      state.viewer = viewer || window.__arViewer || window.arViewer || null;
  
      // 监听尺寸变化，随时 resize（解决：刷新后布局变动导致黑屏/拉伸）
      ensureResizeObserver(container);
    }
  
    // 挂到全局，保持你原来的调用方式不变
    window.arInit = arInit;
  
    // ---------- 额外：处理 bfcache（浏览器返回缓存） ----------
    window.addEventListener("pageshow", (e) => {
      // 从 bfcache 恢复时，WebGL 状态经常需要重建
      if (e.persisted) {
        window.arInit?.();
      }
    });
  
    // ---------- 可选：页面离开时释放（减少偶发 WebGL 卡死/上下文泄漏） ----------
    window.addEventListener("pagehide", () => {
      if (state.viewer) {
        safeDestroyViewer(state.viewer);
        state.viewer = null;
      }
    });
  })();

