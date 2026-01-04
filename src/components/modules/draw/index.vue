<template>
  <div class="tool-panel panel-draw">
    <div class="panel-title">绘制</div>

    <div class="control-group">
      <div class="label-row">
        <span class="label">绘制类型</span>
        <span class="hint" v-if="isDrawMode">ESC 退出</span>
      </div>

      <div class="type-row">
        <!-- 1 矩形 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'rect' }"
          @click="handleSelectType('rect')"
          title="矩形"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="5" y="5" width="14" height="14" rx="1" />
          </svg>
        </button>

        <!-- 2 圆形 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'ellipse' }"
          @click="handleSelectType('ellipse')"
          title="圆形"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="7" />
          </svg>
        </button>

        <!-- 3 直线 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'line' }"
          @click="handleSelectType('line')"
          title="直线"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 19L19 5" />
          </svg>
        </button>

        <!-- 5 箭头 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'arrow' }"
          @click="handleSelectType('arrow')"
          title="箭头"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M4 12h14" />
            <path d="M14 6l6 6-6 6" />
          </svg>
        </button>

        <!-- 6 实体矩形 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'rectFill' }"
          @click="handleSelectType('rectFill')"
          title="实体矩形"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>

        <!-- 7 实体圆形 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'ellipseFill' }"
          @click="handleSelectType('ellipseFill')"
          title="实体圆形"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <circle cx="12" cy="12" r="7" />
          </svg>
        </button>

        <!-- 4 画笔 -->
        <button
          class="type-btn"
          :class="{ active: isDrawMode && state.drawType === 'brush' }"
          @click="handleSelectType('brush')"
          title="画笔"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M4 16c3-8 7-8 10 0s7 8 6-2" />
          </svg>
        </button>

        <button
          class="type-btn"
          :class="{ active: !isDrawMode }"
          @click="exitDrawMode"
          title="退出绘制模式"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div class="sub-hint">
        选择类型后进入绘制模式（十字光标，禁止选中其它对象）；点击已绘制对象会退出绘制模式。
      </div>
    </div>

    <div class="control-group">
      <div class="label-row">
        <span class="label">描边大小</span>
        <input
          class="ie-input-number"
          type="number"
          min="1"
          max="200"
          v-model.number="strokeWidth"
        />
      </div>
      <input
        class="ie-slider"
        type="range"
        min="1"
        max="200"
        v-model.number="strokeWidth"
        v-ie-slider-progress
      />
    </div>

    <div class="control-group">
      <div class="label-row">
        <span class="label">透明度</span>
        <span class="value">{{ Math.round(opacity * 100) }}%</span>
      </div>
      <input
        class="ie-slider"
        type="range"
        min="0"
        max="100"
        v-model.number="opacityPercent"
        v-ie-slider-progress
      />
    </div>

    <div class="control-group">
      <div class="label-row">
        <span class="label">线型</span>
      </div>

      <div class="custom-select" :class="{ open: isLineStyleOpen }">
        <div class="selected-value" @click="isLineStyleOpen = !isLineStyleOpen">
          <svg
            width="100%"
            height="10"
            viewBox="0 0 160 10"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="5"
              x2="160"
              y2="5"
              stroke="currentColor"
              stroke-width="2"
              :stroke-dasharray="currentDashStr"
            />
          </svg>
          <svg
            class="dropdown-arrow"
            width="12"
            height="12"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </div>

        <div v-show="isLineStyleOpen" class="options-list">
          <div
            v-for="opt in LINE_STYLE_OPTIONS"
            :key="opt.value"
            class="option-item"
            @click="selectLineStyle(opt.value)"
          >
            <div class="opt-label">{{ opt.label }}</div>
            <svg
              width="80"
              height="10"
              viewBox="0 0 80 10"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="5"
                x2="80"
                y2="5"
                stroke="#606266"
                stroke-width="2"
                :stroke-dasharray="opt.dashStr"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="control-group">
      <div class="label-row">
        <span class="label">描边颜色</span>
      </div>
      <div class="color-row">
        <div class="color-picker-wrapper">
          <div
            class="ie-color-trigger"
            :style="{
              backgroundColor: state.drawStyle.strokeColor || '#000000',
            }"
            @click="showStrokePicker = !showStrokePicker"
            title="选择颜色"
          ></div>
          <div v-if="showStrokePicker" class="absolute-popover">
            <IeColorPicker
              v-model="strokeColor"
              :allow-transparent="false"
              @confirm="showStrokePicker = false"
              @close="showStrokePicker = false"
            />
          </div>
        </div>
        <input class="ie-input" v-model="strokeColor" />
      </div>
    </div>

    <div class="control-group">
      <div class="label-row">
        <span class="label">填充颜色</span>
      </div>
      <div class="color-row">
        <div class="color-picker-wrapper">
          <div
            class="ie-color-trigger"
            :style="{
              backgroundColor: state.drawStyle.fillColor || 'transparent',
            }"
            @click="showFillPicker = !showFillPicker"
            title="选择颜色"
          ></div>
          <div v-if="showFillPicker" class="absolute-popover">
            <IeColorPicker
              v-model="fillColor"
              :allow-transparent="true"
              @confirm="showFillPicker = false"
              @close="showFillPicker = false"
            />
          </div>
        </div>
        <input class="ie-input" v-model="fillColor" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch, onMounted, onUnmounted } from "vue";
import { useEditorState } from "@/composables/useEditorState";
import { useCanvasDraw } from "./useCanvasDraw";
import IeColorPicker from "@/components/common/IeColorPicker.vue";

const canvasAPI = inject("canvasAPI");
const { state, updateDrawStyle } = useEditorState();

const {
  enterDrawMode,
  exitDrawMode: exitDrawModeLogic,
  refreshStyle,
} = useCanvasDraw(canvasAPI);

const showStrokePicker = ref(false);
const showFillPicker = ref(false);
const isLineStyleOpen = ref(false);

const LINE_STYLE_OPTIONS = [
  { label: "实线", value: "solid", dashStr: undefined },
  { label: "虚线", value: "dash", dashStr: "8,6" },
  { label: "点虚线", value: "dotted", dashStr: "2,4" },
];

const currentDashStr = computed(() => {
  const opt = LINE_STYLE_OPTIONS.find((o) => o.value === lineStyle.value);
  return opt?.dashStr || undefined;
});

const selectLineStyle = (val) => {
  lineStyle.value = val;
  isLineStyleOpen.value = false;
};

const isDrawMode = computed(() => state.drawMode && !!state.drawType);

const applyStyleToSelection = () => {
  // 仅当当前选中对象是绘制对象时，将面板样式应用到该对象
  const canvas = canvasAPI?.canvas?.value;
  if (!canvas) return;
  const obj = canvas.getActiveObject();
  if (!obj || !obj.isDrawObject) return;

  // 触发逻辑层刷新（brush 模式下刷新画笔），以及统一样式
  refreshStyle({ ...state.drawStyle });

  const opacity = state.drawStyle.opacity ?? 1;
  const stroke = state.drawStyle.strokeColor || "#000000";
  const fill = state.drawStyle.fillColor || "";
  const strokeWidth = Number(state.drawStyle.strokeWidth) || 1;
  
  let dash = null;
  if (state.drawStyle.lineStyle === "dash") dash = [8, 6];
  else if (state.drawStyle.lineStyle === "dotted") dash = [2, 4];

  // group(arrow) 需要分别设置子对象
  if (obj.type === "group" && typeof obj.item === "function") {
    const line = obj.item(0);
    const head = obj.item(1);
    if (line) {
      line.set({ stroke, strokeWidth, opacity });
      line.set("strokeDashArray", dash);
    }
    if (head) {
      head.set({ fill: stroke, opacity });
    }
    obj.addWithUpdate();
  } else {
    obj.set({ stroke, strokeWidth, opacity });
    obj.set("strokeDashArray", dash);

    // 面类：允许填充；线类填充保持透明
    if (obj.type === "rect" || obj.type === "ellipse") {
      obj.set({ fill: fill || "rgba(0,0,0,0)" });
    }
  }

  obj.setCoords();
  canvas.requestRenderAll();
};

const strokeWidth = computed({
  get: () => state.drawStyle.strokeWidth,
  set: (val) => {
    updateDrawStyle({ strokeWidth: Number(val) || 1 });
    applyStyleToSelection();
  },
});

const opacityPercent = computed({
  get: () => Math.round((state.drawStyle.opacity ?? 1) * 100),
  set: (val) => {
    const pct = Math.max(0, Math.min(100, Number(val) || 0));
    updateDrawStyle({ opacity: pct / 100 });
    applyStyleToSelection();
  },
});

const opacity = computed(() => state.drawStyle.opacity ?? 1);

const strokeColor = computed({
  get: () => state.drawStyle.strokeColor,
  set: (val) => {
    updateDrawStyle({ strokeColor: String(val || "").toUpperCase() });
    applyStyleToSelection();
  },
});

const fillColor = computed({
  get: () => state.drawStyle.fillColor,
  set: (val) => {
    updateDrawStyle({ fillColor: String(val || "").toUpperCase() });
    applyStyleToSelection();
  },
});

const lineStyle = computed({
  get: () => state.drawStyle.lineStyle || "solid",
  set: (val) => {
    updateDrawStyle({ lineStyle: val });
    applyStyleToSelection();
  },
});

const handleSelectType = (type) => {
  // 根据绘制类型自动设置填充色默认值
  if (type === 'rectFill' || type === 'ellipseFill') {
    updateDrawStyle({ fillColor: '#000000' });
  } else if (type === 'rect' || type === 'ellipse') {
    updateDrawStyle({ fillColor: '' });
  }
  // 进入绘制模式（十字光标 + 禁止选中其它对象）
  enterDrawMode(type);
};

const exitDrawMode = () => {
  exitDrawModeLogic();
};

// 当从绘制模式退出（比如：点击绘制对象后 composable 内 setDrawMode(false)）时，面板联动清理
const onGlobalClick = (e) => {
  const t = e.target;
  if (!t) return;
  // 点击面板外部时关闭下拉
  if (isLineStyleOpen.value && !t.closest(".custom-select")) {
    isLineStyleOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", onGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener("click", onGlobalClick);
});

watch(
  () => state.drawMode,
  (val) => {
    if (!val) {
      showStrokePicker.value = false;
      showFillPicker.value = false;
      isLineStyleOpen.value = false;
    }
  }
);
</script>

<style scoped>
.panel-draw {
  padding: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.control-group {
  margin-bottom: 18px;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.label {
  color: #303133;
  font-size: 13px;
}

.hint {
  font-size: 12px;
  color: #909399;
}

.value {
  font-size: 12px;
  color: #909399;
}

.type-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 34px;
  gap: 8px;
}

.custom-select {
  position: relative;
  width: 100%;
}

.selected-value {
  position: relative;
  height: 34px;
  border: 1px solid var(--ie-border-color);
  border-radius: 6px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  color: #606266;
}

.custom-select.open .selected-value {
  border-color: var(--ie-primary-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.18);
}

.dropdown-arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
}

.options-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 10;
  padding: 6px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.option-item:hover {
  background: #f5f7fa;
}

.opt-label {
  font-size: 12px;
  color: #606266;
  width: 48px;
}

.type-btn {
  height: 34px;
  border-radius: 6px;
  border: 1px solid var(--ie-border-color);
  background: #fff;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn:hover {
  color: var(--ie-primary-color);
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.type-btn.active {
  color: var(--ie-primary-color);
  border-color: var(--ie-primary-color);
  background: #ecf5ff;
}

.sub-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.color-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: center;
}
</style>
