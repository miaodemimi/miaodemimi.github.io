// ================= B站动态头图终极动画引擎 =================
const banner = document.getElementById("biliBanner");
const bannerItems = banner.querySelectorAll(".layer img, .layer video");

// ================= 配置参数 (你可以自己微调) =================
const SENSITIVITY = 0.7;
const SMOOTHING = 0.05;

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// ================= 1. 监听整个 header，而非 biliBanner =================
// 原因：鼠标悬停时实际命中的是上层 .header-content（文字/导航），
// 事件不会冒泡到被它遮住的兄弟元素 biliBanner，所以要绑在父级 header 上
const headerEl = document.getElementById("mainHeader");

headerEl.addEventListener("mousemove", (event) => {
  const centerX = window.innerWidth / 2;
  const centerY = headerEl.offsetHeight / 2;

  targetX = ((event.clientX - centerX) / window.innerWidth) * SENSITIVITY;
  targetY = ((event.clientY - centerY) / headerEl.offsetHeight) * SENSITIVITY;
});

headerEl.addEventListener("mouseleave", () => {
  targetX = 0;
  targetY = 0;
});

// ================= 2. 核心：逐帧渲染循环 (Lerp 算法) =================
function animate() {
  // Lerp (线性插值) 算法：当前位置逐渐逼近目标位置，产生完美的物理阻尼感
  currentX += (targetX - currentX) * SMOOTHING;
  currentY += (targetY - currentY) * SMOOTHING;

  bannerItems.forEach((item) => {
    // 提取 HTML 中设定的 Scale (缩放) 和默认偏移 (ix, iy)
    const scale = parseFloat(item.getAttribute("data-scale")) || 1;
    const ix = parseFloat(item.getAttribute("data-ix")) || 0;
    const iy = parseFloat(item.getAttribute("data-iy")) || 0;

    // 提取最大移动像素上限 (mx, my)
    const mx = parseFloat(item.getAttribute("data-mx")) || 0;
    const my = parseFloat(item.getAttribute("data-my")) || 0;

    // 计算包含原始偏移 (ix, iy) 的最终位置
    const tx = ix - currentX * mx;
    const ty = iy - currentY * my;

    // 渲染！先居中，再缩放，最后位移
    item.style.transform = `scale(${scale}) translate(${tx}px, ${ty}px)`;
  });

  // 循环调用自己，保持动画一直运行 (浏览器自带的最高效动画 API)
  requestAnimationFrame(animate);
}

// 启动动画引擎！
animate();
