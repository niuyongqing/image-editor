import { reactive, computed, toRefs, onMounted } from "vue";

/**
 * @description table 页面操作方法封装
 * @param apiUrl 获取表格数据 ApiUrl(必传)
 * @param initParam 获取数据初始化参数(不必传，默认为{})
 * @param isPageable 是否有分页(不必传，默认为true)
 * @param tableRef 当前表格的DOM(不必传，默认为“”)
 * */
export const useTable = (apiUrl, initSearchParam = {}, isPageable = true) => {
  const state = reactive({
    loading: false, // 加载状态
    // 表格数据
    tableData: [],
    // 是否展开更多搜索框
    searchShow: false,
    // 分页数据
    pagination: {
      // 当前页数
      current: 1,
      // 每页显示条数
      pageSize: 50,
      // 总条数
      total: 0,
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    initSearchParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {},
  });

  /**
   * @description 分页查询数据(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        current: state.pagination.current,
        pageSize: state.pagination.pageSize,
      };
    },
    set: (newVal) => {
      console.log("分页更新之后的值", newVal);
    },
  });

  //  设置loading状态
  const setLoading = (loading) => {
    state.loading = loading;
  };

  /**
   * @description 获取表格数据
   * */
  const getTableList = async () => {
    // 更新查询参数
    setLoading(true);
    updatedTotalParam();
    apiUrl(state.totalParam)
      .then((res) => {
        if (res.code === 200) {
          state.tableData = res.rows;
          const { total } = res;
          state.pagination.total = total;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * @description 更新查询参数
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    let nowSearchParam = {};
    for (let key in state.searchParam) {
      if (
        state.searchParam[key] ||
        state.searchParam[key] === false ||
        state.searchParam[key] === 0
      ) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(
      state.totalParam,
      nowSearchParam,
      isPageable ? pageParam.value : {}
    );
  };

  /**
   * @description 更新分页信息
   * @param resPageable 后台返回的分页数据
   * */
  const handleChange = (resPageable) => {
    Object.assign(state.pagination, resPageable);
    getTableList();
  };

  /**
   * @description 表格数据查询
   * */
  const search = async (params) => {
    state.pagination.current = 1;
    state.searchParam = params || {};
    updatedTotalParam();
    await getTableList();
  };

  /**
   * @description 表格数据重置
   * */
  const reset = () => {
    state.pagination.current = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.initSearchParam).forEach((key) => {
      state.searchParam[key] = state.initSearchParam[key];
    });
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param val 当前条数
   * */
  const handleSizeChange = (val) => {
    state.pagination.current = 1;
    state.pagination.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param val 当前页
   * */
  const handleCurrentChange = (val) => {
    state.pagination.current = val;
    getTableList();
  };

  // 刷新
  const reload = () => {
    getTableList();
  };

  onMounted(() => {
    getTableList();
  });

  return {
    ...toRefs(state),
    setLoading,
    handleChange,
    getTableList,
    updatedTotalParam,
    pageParam,
    search,
    reset,
    reload,
    handleSizeChange,
    handleCurrentChange,
  };
};
