import commodityTypeList from "@/utils/commodityType";
import { storeStatus, meansKeepGrains } from "@/utils/devStatusSelect";
import sheepProhibitionSelect from "@/utils/sheepProhibitionSelect";
import devAttributableMarketRevertSelect from "@/utils/devAttributableMarketRevertSelect";
import { forbidSaleApi } from "@/api/common/selectProduct";
export const useSelectProduct = () => {
  const forbidSaleList = ref([]);

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
    commodityTypeList,
    storeStatus,
    sheepProhibitionSelect,
    forbidSaleList,
    meansKeepGrains,
    devAttributableMarketRevertSelect,
  };
};
