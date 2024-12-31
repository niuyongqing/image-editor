import commodityTypeList from "@/utils/commodityType";
import { storeStatus } from "@/utils/devStatusSelect";
import sheepProhibitionSelect from "@/utils/sheepProhibitionSelect";
//  获取禁售属性
function forbidSaleApi() {
  return useGet("/commodity-manage/commodity/means-public/forbid-sale");
}

export const useSelectProduct = () => {
  console.log("commodityTypeList", commodityTypeList);

  const forbidSaleList = ref([]);

  function getForbidSale() {
    forbidSaleApi().then((res) => {
      if (res.code === 200) {
        forbidSaleList.value = res.data || [];
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
  };
};
