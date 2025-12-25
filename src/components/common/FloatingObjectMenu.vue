<template>
  <div
    v-show="isVisible"
    class="floating-wrapper"
    :style="{ left: position.left + 'px', top: position.top + 'px' }"
  >
    <button
      class="trigger-btn"
      @click.stop="toggleMenu"
      :class="{ active: isMenuOpen }"
      title="更多操作"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="19" cy="12" r="1"></circle>
        <circle cx="5" cy="12" r="1"></circle>
      </svg>
    </button>

    <div v-if="isMenuOpen" class="main-menu">
      <div class="menu-item" @click="handleAction(actions.copyActive)">
        <span class="icon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path
              d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            ></path>
          </svg>
        </span>
        <span class="label">复制</span>
        <span class="shortcut">Ctrl+C</span>
      </div>

      <div class="menu-item" @click="handleAction(actions.cutActive)">
        <span class="icon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="6" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
            <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
            <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
          </svg>
        </span>
        <span class="label">剪切</span>
        <span class="shortcut">Ctrl+X</span>
      </div>

      <div class="menu-item" @click="handleLock">
        <span class="icon">
          <svg
            v-if="isLocked"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <svg
            v-else
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          </svg>
        </span>
        <span class="label">{{ isLocked ? "解锁" : "锁定" }}</span>
        <span class="shortcut">Shift+Ctrl+L</span>
      </div>

      <div class="menu-item has-submenu">
        <span class="icon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
            <polyline points="2 7 12 12 22 7"></polyline>
          </svg>
        </span>
        <span class="label">图层顺序</span>
        <span class="arrow-right">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>

        <div class="submenu">
          <div
            class="menu-item"
            @click="handleAction(() => actions.moveLayer('forward'))"
          >
            <span class="label">上一层</span>
            <span class="shortcut">]</span>
          </div>
          <div
            class="menu-item"
            @click="handleAction(() => actions.moveLayer('backward'))"
          >
            <span class="label">下一层</span>
            <span class="shortcut">[</span>
          </div>
          <div class="divider"></div>
          <div
            class="menu-item"
            @click="handleAction(() => actions.moveLayer('front'))"
          >
            <span class="label">置顶</span>
            <span class="shortcut">Shift+]</span>
          </div>
          <div
            class="menu-item"
            @click="handleAction(() => actions.moveLayer('back'))"
          >
            <span class="label">置底</span>
            <span class="shortcut">Shift+[</span>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="menu-item delete" @click="handleAction(actions.deleteActive)">
        <span class="icon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            ></path>
          </svg>
        </span>
        <span class="label">删除</span>
        <span class="shortcut">Del</span>
      </div>

      <div v-if="$slots.extra">
        <div class="divider"></div>
        <slot name="extra"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, unref } from "vue";
import { useObjectActions } from "@/composables/useObjectActions";
import { fabric } from "fabric";
const canvasAPI = inject("canvasAPI");
const actions = useObjectActions();

const isVisible = ref(false);
const isMenuOpen = ref(false);
const isLocked = ref(false);
const position = ref({ left: 0, top: 0 });

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleAction = (actionFn) => {
  actionFn();
  isMenuOpen.value = false;
};

const handleLock = () => {
  const locked = actions.toggleLock();
  isLocked.value = locked;
};

const excludeTabs = ['ruler'];

// 更新菜单位置
const updatePosition = () => {
  const canvas = unref(canvasAPI.canvas);
  const activeObj = canvas?.getActiveObject();
  // 🛡️ 拦截非法对象
  if (
    !activeObj ||
    activeObj.isMainImage ||
    activeObj.evented === false ||
    activeObj.selectable === false || !excludeTabs.includes(activeObj.customTab)
  ) {
    isVisible.value = false;
    isMenuOpen.value = false;
    return;
  }

  // ✨ 核心逻辑：计算锚点位置
  let anchorPoint;
  
  if (activeObj.isRuler) {
    // 1. 标尺对象：计算其旋转后的“右端点”物理坐标
    const center = activeObj.getCenterPoint();
    // 标尺 Group 的宽度即为总物理长度
    const halfWidth = (activeObj.width * activeObj.scaleX) / 2;
    const angleRad = fabric.util.degreesToRadians(activeObj.angle);
    
    anchorPoint = new fabric.Point(
      center.x + halfWidth * Math.cos(angleRad),
      center.y + halfWidth * Math.sin(angleRad)
    );
  } else {
    // 2. 普通对象：维持原有包围盒（Bounding Box）右边缘逻辑
    const coords = activeObj.getBoundingRect(true, true);
    anchorPoint = new fabric.Point(coords.left + coords.width, coords.top);
  }

  // ✨ 关键修复：将画布绝对坐标转换为 DOM 视口坐标 [大局观加固]
  // 解决了之前在旋转、缩放或平移画布时，菜单位置偏移或“飞走”的问题
  const vptPoint = fabric.util.transformPoint(anchorPoint, canvas.viewportTransform);

  const containerWidth = canvas.getElement().parentElement.offsetWidth;
  const menuWidth = 40;

  // 计算 UI 最终 Left 位置 (偏移 40px 防止遮挡)
  let newLeft = vptPoint.x + 40;

  // 边界检查：如果超出容器右侧，则反向显示在左端
  if (newLeft + menuWidth > containerWidth) {
    // 如果是标尺，建议向左偏移更多，以免盖住标尺本身
    newLeft = vptPoint.x - menuWidth - (activeObj.isRuler ? 30 : 0);
  }

  position.value = {
    left: newLeft,
    top: vptPoint.y, // 保持小幅度下移
  };

  isVisible.value = true;
  isLocked.value = !!activeObj.lockMovementX;
};

const bindEvents = () => {
  const canvas = unref(canvasAPI.canvas);
  if (!canvas) return;

  const events = [
    "selection:created",
    "selection:updated",
    "object:moving",
    "object:scaling",
    "object:rotating",
    "object:modified",
  ];
  events.forEach((evt) => canvas.on(evt, updatePosition));

  canvas.on("selection:cleared", () => {
    isVisible.value = false;
    isMenuOpen.value = false;
  });
};

const unbindEvents = () => {
  const canvas = unref(canvasAPI.canvas);
  if (!canvas) return;
  canvas.off("selection:cleared");
  const events = [
    "selection:created",
    "selection:updated",
    "object:moving",
    "object:scaling",
    "object:rotating",
    "object:modified",
  ];
  events.forEach((evt) => canvas.off(evt));
};

onMounted(() => setTimeout(bindEvents, 200));
onUnmounted(unbindEvents);
</script>

<style scoped>
.floating-wrapper {
  position: absolute;
  z-index: 2000;
  pointer-events: auto;
}

.trigger-btn {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
  padding: 0 !important;
}

.trigger-btn:hover,
.trigger-btn.active {
  background: #ecf5ff;
  color: var(--ie-primary-color);
  border-color: var(--ie-primary-color);
}

.main-menu {
  position: absolute;
  top: 15px;
  left: 22px;
  width: 180px;
  background: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  display: flex;
  flex-direction: column;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: background 0.1s;
}

.menu-item:hover {
  background: #f5f7fa;
  color: var(--ie-primary-color);
}

.menu-item.delete:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
  width: 16px;
  opacity: 0.8;
}

.label {
  flex: 1;
}

.shortcut {
  font-size: 11px;
  color: #909399;
  margin-left: 8px;
  font-family: monospace;
  opacity: 0.8;
}

.arrow-right {
  margin-left: auto;
  opacity: 0.5;
  display: flex;
  align-items: center;
}

.divider {
  height: 1px;
  background: #ebeef5;
  margin: 4px 0;
}

.submenu {
  display: none;
  position: absolute;
  left: 100%;
  top: -4px;
  width: 140px;
  background: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin-left: 4px;
}

.menu-item.has-submenu:hover .submenu {
  display: block;
}

.menu-item.has-submenu::after {
  content: "";
  position: absolute;
  top: 0;
  right: -10px;
  width: 10px;
  height: 100%;
}
</style>
