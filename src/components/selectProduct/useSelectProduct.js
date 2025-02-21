import commodityTypeList from "@/utils/commodityType";
import { storeStatus, meansKeepGrains } from "@/utils/devStatusSelect";
import sheepProhibitionSelect from "@/utils/sheepProhibitionSelect";
import devAttributableMarketRevertSelect from "@/utils/devAttributableMarketRevertSelect";
import { forbidSaleApi } from "@/api/common/selectProduct";
import { getUserInfoApi } from "@/api/common/user";
export const useSelectProduct = () => {
  const forbidSaleList = ref([]);
  const userInfo = ref({});
  // 获取用户详细信息
  function getInfo() {
    getUserInfoApi().then((res) => {
      if (res.code === 200) {
        const data = res.data || {};
        userInfo.value = data;
      }
    });
  }

  // 获取禁售属性
  function getForbidSale() {
    forbidSaleApi().then((res) => {
      if (res.code === 200) {
        const data = res.data || [];
        forbidSaleList.value = data.map((item) => {
          return {
            ...item,
            disabled: false,
          };
        });
      }
    });
  }

  watchEffect(() => {
    getForbidSale();
  });

  return {
    userInfo,
    commodityTypeList,
    storeStatus,
    sheepProhibitionSelect,
    forbidSaleList,
    meansKeepGrains,
    devAttributableMarketRevertSelect,
  };
};
