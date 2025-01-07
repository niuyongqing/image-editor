import { reactive, computed, toRefs, onMounted } from "vue";

/**
 * @description table 页面操作方法封装
 * @param apiUrl 获取表格数据 ApiUrl(必传)
 * @param initParam 获取数据初始化参数
 * @param isPageable 是否有分页
 * */
export const useTable = (
  apiUrl,
  initSearchParam = {},
  pageField = "pageNum",
  isPageable = true,
  immediate = true
) => {
  const state = reactive({
    loading: false,
    // 表格数据
    tableData: [],
    // 分页数据
    pagination: {
      // 当前页数
      [pageField]: 1,
      // 每页显示条数
      pageSize: 50,
      // 总条数
      total: 0,
    },
    searchParam: {}, // 查询参数(只包括查询)
    initSearchParam: initSearchParam, // 初始化默认的查询参数
    immediate: immediate, // 是否立即执行
    totalParam: {}, // 总参数(包含分页和查询参数)
  });

  /**
   * @description 分页查询数据
   * */
  const pageParam = computed({
    get: () => {
      return {
        [pageField]: state.pagination[pageField],
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
    console.log("state.totalParam", state.totalParam);

    return new Promise((resolve, reject) => {
      apiUrl(state.totalParam)
        .then((res) => {
          if (res.code === 200) {
            state.tableData = res.rows || [];
            const { total } = res;
            state.pagination.total = total;
            resolve(res);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  /**
   * @description 更新查询参数
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    let nowSearchParam = {};
    for (let key in state.searchParam) {
      nowSearchParam[key] = state.searchParam[key];
    }
    Object.assign(
      state.totalParam,
      nowSearchParam,
      isPageable ? pageParam.value : {}
    );
  };

  /**
   * @description 分页、排序、筛选变化时触发
   * */
  const handleChange = (pagination, filters, sorter) => {
    state.pagination[pageField] = pagination.current;
    state.pagination.pageSize = pagination.pageSize;
    if (sorter && JSON.stringify(sorter) !== "{}" && sorter.column) {
      state.searchParam["prop"] = sorter.column["sortField"] ?? ""; // 排序字段
      state.searchParam["order"] =
        sorter.order === "ascend" ? "ascending" : "descending"; // 排序字段
    }
    getTableList();
  };

  /**
   * @description 分页改变时触发
   *  */
  const handleChangePagination = (page, pageSize) => {
    state.pagination[pageField] = page;
    state.pagination.pageSize = pageSize;
    getTableList();
  };

  /**
   * @description 表格数据查询
   * */
  const search = async (params) => {
    state.pagination[pageField] = 1;
    state.searchParam = params || {};
    Object.assign(state.initSearchParam, state.searchParam);
    updatedTotalParam();
    await getTableList();
  };

  /**
   * @description 表格数据重置
   * */
  const reset = () => {
    state.pagination[pageField] = 1;
    state.searchParam = {};
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    Object.keys(state.initSearchParam).forEach((key) => {
      state.searchParam[key] = state.initSearchParam[key];
    });
    immediate && getTableList();
  };

  /**
   * @description 每页条数改变
   * @param val 当前条数
   * */
  const handleSizeChange = (val) => {
    state.pagination[pageField] = 1;
    state.pagination.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param val 当前页
   * */
  const handleCurrentChange = (val) => {
    state.pagination[pageField] = val;
    getTableList();
  };

  // 刷新
  const reload = () => {
    getTableList();
  };

  onMounted(() => {
    reset();
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
    handleChangePagination,
  };
};
