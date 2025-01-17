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
        label: "别名",
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
        label: "简称",
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
        type: "select",
        name: "account",
        label: "地区",
        rules: [{ required: true, message: "请选择账号" }],
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
    getAccountUserList,
    getLazadaAccount,
    getUserDepList,
  };
};
