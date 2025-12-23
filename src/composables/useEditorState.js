import { reactive, readonly } from 'vue';

/**
 * ✨ 全局路由配置表 (Single Source of Truth)
 * 定义 Fabric 对象类型 -> 工具面板(Tool) + 子选项卡(Tab) 的映射关系
 */
export const OBJECT_TO_TOOL_MAP = {
    // === 基础形状 ===
    'i-text':  { tool: 'text', tab: 'style' },    // 文本 -> 文本面板-样式Tab
    'textbox': { tool: 'text', tab: 'style' },
    'image':   { tool: 'adjust', tab: 'filter' }, // 图片 -> 调整面板-滤镜Tab
    'group':   { tool: 'adjust', tab: '' },       // 组 -> 调整面板 (根据业务需求)
    
    // === 绘制/矢量 ===
    'path':    { tool: 'draw', tab: '' },         // 路径 -> 绘制面板
    
    // === 几何图形 (通常归类为素材或边框，根据你的业务定) ===
    'rect':     { tool: 'border', tab: 'style' },
    'circle':   { tool: 'material', tab: 'basic' },
    'triangle': { tool: 'material', tab: 'basic' },
    
    // === 自定义业务类型 ===
    'puzzle':   { tool: 'puzzle', tab: 'template' }
};

// 单例状态
const state = reactive({
    activeTool: 'adjust', // 一级菜单 ID
    activeTab: '',        // ✨ 新增: 二级菜单 ID (例如 'style', 'color', 'filter')
    
    isDrawing: false,     // 是否处于自由绘制模式
    
    canUndo: false,       // 历史记录状态
    canRedo: false,
    
    isLoading: false,
    loadingText: '处理中...',
    
    isSidebarDisabled: false, // 侧边栏残影模式
    
    /**
     * ✨ 导航来源标记
     * 'system': 初始化或系统重置
     * 'manual': 用户手动点击侧边栏 (优先级最高，应有点击反馈)
     * 'canvas': 画布对象选中触发自动跳转 (应平滑过渡，无干扰)
     */
    navigationSource: 'system' 
});

export function useEditorState() {
    
    /**
     * 切换当前激活的工具和选项卡
     * @param {string} tool - 一级工具 ID
     * @param {string} tab - (可选) 二级选项卡 ID
     * @param {string} source - 触发来源 ('manual' | 'canvas' | 'system')
     */
    const setActiveTool = (tool, tab = '', source = 'manual') => {
        // 状态防抖：如果 Tool 和 Tab 都没变，且侧边栏也是激活状态，则不执行
        if (state.activeTool === tool && state.activeTab === tab && !state.isSidebarDisabled) {
            return;
        }

        state.activeTool = tool;
        state.activeTab = tab; // 更新二级路由
        state.navigationSource = source;
        
        // 副作用处理
        state.isDrawing = false; // 切换工具默认退出绘制模式
        state.isSidebarDisabled = false; // 只要切换工具，必定激活面板
    };

    const toggleDrawing = (status) => {
        state.isDrawing = status;
    };

    const setHistoryState = (canUndo, canRedo) => {
        state.canUndo = canUndo;
        state.canRedo = canRedo;
    };

    const setLoading = (status, text = '处理中...') => {
        state.isLoading = status;
        state.loadingText = text;
    };

    const setSidebarDisabled = (status) => {
        state.isSidebarDisabled = status;
    };

    // === ✨ 核心：智能路由系统 ===

    /**
     * 根据 Canvas 选中的对象，自动路由到对应的工具面板
     * @param {Object} target - Fabric 对象实例
     * @returns {boolean} - 是否成功匹配并跳转
     */
    const routeToObject = (target) => {
        if (!target) return false;

        // 1. 优先检查对象实例级元数据 (Custom Payload)
        // 允许在代码中 addText 时注入 { customTab: 'color' } 来覆盖默认行为
        if (target.customTab) {
            // 获取该类型的基础配置，如果没有则默认为 adjust
            const baseConfig = OBJECT_TO_TOOL_MAP[target.type] || { tool: 'adjust' };
            const targetTool = baseConfig.tool || 'adjust';
            
            console.log(`[Router] Custom routing: Tool[${targetTool}] Tab[${target.customTab}]`);
            setActiveTool(targetTool, target.customTab, 'canvas');
            return true;
        }

        // 2. 提取并标准化对象类型
        let type = target.type;
        
        // 处理自定义标识
        if (target.isPuzzleImage || target.isPuzzleController) {
            type = 'puzzle';
        }
        
        // ⚠️ 已移除 activeSelection (多选) 的判断逻辑
        // 如果你需要多选时保持在当前页面或去特定页面，可在此重新添加

        // 3. 查表
        const config = OBJECT_TO_TOOL_MAP[type];
        
        if (config) {
            // 兼容配置是字符串的情况 (旧逻辑兼容)
            const toolId = typeof config === 'string' ? config : config.tool;
            const tabId = typeof config === 'string' ? '' : config.tab;
            
            // 触发跳转，标记来源为 'canvas'
            setActiveTool(toolId, tabId, 'canvas');
            return true;
        }
        
        // 4. 未匹配到路由 (例如辅助线、背景控制点等)
        return false;
    };

    return {
        state: readonly(state), // 导出只读状态
        setActiveTool,
        toggleDrawing,
        setHistoryState,
        setLoading,
        setSidebarDisabled,
        routeToObject // 导出路由动作供 useCanvas 使用
    };
}

// 全局聚焦系数 (保留)
export const ZOOM_PADDING = 0.921;