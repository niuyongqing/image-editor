import { reactive, computed } from "vue";
import { getAccountUser, getUserDep, lazadaAccount } from "../api";
import { debounce } from "lodash-es";
export const useFormList = () => {
  //  用户
  const userIdSelction = reactive({
    data: [],
    searchLoading: false,
  });
  const lazadaAccountOptions = ref([]); // 用户options
  const depOptions = ref([]); // 部门options

  const search = debounce((value) => {
    getAccountUserList({
      userName: value,
    });
  }, 200);

  function getAccountUserList(params) {
    getAccountUser(params)
      .then((res) => {
        if (res.code === 200) {
          userIdSelction.data = res.data || [];
          console.log(" userIdSelction.data", userIdSelction.data);
        }
      })
      .finally(() => {
        userIdSelction.searchLoading = false;
      });
  }

  function getLazadaAccount() {
    lazadaAccount({}).then((res) => {
      lazadaAccountOptions.value = res.data || [];
    });
  }
  function getUserDepList() {
    getUserDep().then((res) => {
      depOptions.value = res.data || [];
    });
  }

  watchEffect(() => {
    getLazadaAccount();
    getUserDepList();
  });

  const formList = computed(() => {
    return [
      {
        type: "select",
        name: "platform",
        label: "平台",
        rules: [{ required: true, message: "请选择平台" }],
        componentProps: {
          disabled: true,
          filterOption: false,
          options: [{ label: "Lazada", value: "Lazada" }],
        },
      },
      {
        type: "select",
        name: "userId",
        label: "用户",
        rules: [{ required: true, message: "请选择用户" }],
        componentProps: {
          mode: "multiple",
          fieldNames: { label: "userName", value: "userId" },
          showSearch: true,
          onSearch: search.bind(),
          options: userIdSelction.data,
          filterOption: false,
        },
      },
      {
        type: "cascader",
        name: "depId",
        label: "部门",
        rules: [{ required: true, message: "请选择部门" }],
        componentProps: {
          options: depOptions.value,
          fieldNames: {
            label: "deptName",
            value: "deptId",
            childrrn: "children",
          },
          changeOnSelect: true,
          showSearch: true,
        },
      },
      {
        type: "select",
        name: "account",
        label: "账号",
        rules: [{ required: true, message: "请选择账号" }],
        slot: "account",
        style: { display: "flex" },
        componentProps: {
          mode: "multiple",
          fieldNames: { label: "simpleName", value: "shortCode" },
          options: lazadaAccountOptions.value,
          showSearch: true,
          filterOption: (input, option) => {
            return (
              option.simpleName.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          },
        },
      },
    ];
  });

  return {
    formList,
    depOptions,
    lazadaAccountOptions,
    getAccountUserList,
    getLazadaAccount,
    getUserDepList,
  };
};
