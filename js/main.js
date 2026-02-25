window.Scene3DViewportVideoGuard = (function () {
  let io = null;
  let rootEl = null;
  const visible = new Set();
  const playing = new Set();
  const MAX_PLAYING = 4; // 同时播放上限，防止性能炸

  function isInViewport(el) {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.right > 0 && r.top < (window.innerHeight || 0) && r.left < (window.innerWidth || 0);
  }

  function ensureSrc(v) {
    const ds = v.dataset && v.dataset.src;
    if (!ds) return;

    // 兼容：有些实现用 <source>，这里统一兜底成 v.src
    // 如果你们的 manager 会用 <source>，这个也不冲突（v.src 没有时才设置）
    if (!v.src) {
      v.src = ds;
      // 某些浏览器需要显式 load 才会进入可播放状态
      try { v.load(); } catch (e) {}
    }
  }

  async function tryPlay(v) {
    if (!v) return;
    ensureSrc(v);

    // 如果已经在播就不重复
    if (!v.paused && !v.ended) return;

    try {
      const p = v.play();
      // play() 可能返回 Promise
      if (p && typeof p.then === "function") await p;
    } catch (e) {
      // 自动播放策略、资源冻结等都会导致失败；失败就算了，下次进入视口再试
    }
  }

  function pause(v) {
    try { v.pause(); } catch (e) {}
  }

  function reconcile() {
    // 只让“可见的”且“最靠前的”最多 MAX_PLAYING 个播放
    const vids = Array.from(visible)
      .filter(v => document.contains(v) && isInViewport(v))
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    const shouldPlay = new Set(vids.slice(0, MAX_PLAYING));

    // pause 多余的
    for (const v of Array.from(playing)) {
      if (!shouldPlay.has(v)) {
        pause(v);
        playing.delete(v);
      }
    }

    // play 需要的
    for (const v of shouldPlay) {
      if (!playing.has(v)) {
        tryPlay(v);
        playing.add(v);
      } else {
        // 有些浏览器滚动后会把它 pause 掉，但我们集合里还认为在播
        if (v.paused) tryPlay(v);
      }
    }
  }

  function observe(container) {
    if (!container) return;
    rootEl = container;

    // 建一次 IO（可复用）
    if (!io) {
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          const v = e.target;
          if (e.isIntersecting) visible.add(v);
          else visible.delete(v);
        }
        reconcile();
      }, {
        root: null,
        threshold: 0.15
      });

      // 页面从后台回来、或 bfcache 恢复时，强制恢复视口内播放
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) reconcile();
      });

      window.addEventListener("pageshow", () => {
        reconcile();
      });

      // 滚动不触发 mutation，所以加一个轻量 scroll 兜底
      let raf = null;
      window.addEventListener("scroll", () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          reconcile();
        });
      }, { passive: true });

      window.addEventListener("resize", () => reconcile(), { passive: true });
    }

    // 观察当前容器内所有视频
    const vids = container.querySelectorAll("video.scene3d-video");
    vids.forEach(v => {
      // 避免重复 observe
      if (v.__guardObserved) return;
      v.__guardObserved = true;

      // 如果浏览器/系统把视频强制 pause，且它此刻在视口内，则拉起来
      v.addEventListener("pause", () => {
        if (visible.has(v) && !document.hidden) {
          // 小延迟避免和浏览器内部状态打架
          setTimeout(() => {
            if (visible.has(v) && v.paused) reconcile();
          }, 80);
        }
      });

      io.observe(v);
    });

    // 初次同步一次
    reconcile();
  }

  function reset() {
    visible.clear();
    playing.clear();
    // 不销毁 io，保留监听器（更稳定）；如果你一定要销毁也可以加 disconnect
  }

  return { observe, reset, reconcile };
})();

function installScene3DVideoAutoInit() {
    // 防止重复安装
    if (window.__scene3dVideoAutoInitInstalled) return;
    window.__scene3dVideoAutoInitInstalled = true;
  
    const container = document.getElementById('results-scene3d');
    if (!container) return;
  
    let t = null;
  
    function kickInit() {
      // 等 DOM/layout 稳一下再 init（避免 make_carousel 内部异步/分批插入）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (window.Scene3DVideoManager && typeof window.Scene3DVideoManager.init === "function") {
            window.Scene3DVideoManager.init(container);
            window.Scene3DVideoManager.resetSync?.();
          }
        });
      });
    }
  
    const mo = new MutationObserver(() => {
      clearTimeout(t);
      t = setTimeout(kickInit, 50);
    });
  
    mo.observe(container, { childList: true, subtree: true });
  
    // ✅ 首次也执行一次（不等 mutation）
    kickInit();
  }
  
  window.onload = function() {
    initWindow();
  
    // ✅ 先装 observer（避免错过首次渲染的 mutation）
    installScene3DVideoAutoInit();
  
    if (scene3d_items && scene3d_items.length > 0) {
      make_carousel('results-scene3d', scene3d_carousel_item_template, scene3d_items, 2, 2);
  
      // ✅ 首次渲染后再 kick 一次，确保一定 init 到新插入的 video
      //（就算 make_carousel 没触发 mutation 或者触发太早也没事）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const container = document.getElementById('results-scene3d');
          if (window.Scene3DVideoManager && typeof window.Scene3DVideoManager.init === "function") {
            window.Scene3DVideoManager.init(container || document);
            window.Scene3DVideoManager.resetSync?.();
          }
        });
      });
    }
  
    if (typeof arInit === 'function') {
      arInit();
    }
  };

function installScene3DVideoAutoInit() {
  if (window.__scene3dVideoAutoInitInstalled) return;
  window.__scene3dVideoAutoInitInstalled = true;

  const container = document.getElementById('results-scene3d');
  if (!container) return;

  let t = null;

  function kickInit() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (window.Scene3DVideoManager && typeof window.Scene3DVideoManager.init === "function") {
          window.Scene3DVideoManager.init(container);
          window.Scene3DVideoManager.resetSync?.();
        }
        window.Scene3DViewportVideoGuard?.observe(container);
      });
    });
  }

  const mo = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(kickInit, 50);
  });

  mo.observe(container, { childList: true, subtree: true });

  kickInit();
}