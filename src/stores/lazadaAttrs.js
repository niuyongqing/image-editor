/**
 * lazada 分类属性列表
 */
import { defineStore } from "pinia";

export const useLadazaAttrs = defineStore("lazadaAttrs", () => {
  const state = reactive({
    shortCode: "", // 店铺
    primaryCategory: [], // 分类
    selectTheme: [], // 选中的变种主题
    attributes: [], // 所有属性
    productClassifyAtrrs: [], // 产品分类属性
    requiredAttrs: [], //  必填属性
    skuAttrs: [], //  SKU属性
    warrantyTypeList: [], //  质保类型属性
    warrantyList: [], //   质保时长属性
    taxOptions: [], // 税率属性、
    skuTable: [], // sku表格数据
    loading: false, // 加载状态
    product: {}, // 选择资料库产品信息
    productSkus: [], // 选中资料库中产品sku列表
  });
  const setShortCode = (shortCode = "") => {
    state.shortCode = shortCode;
  };
  const setPrimaryCategory = (primaryCategory = []) => {
    state.primaryCategory = primaryCategory;
  };
  const setLoading = (loading) => {
    state.loading = loading;
  };
  const setSelectTheme = (list) => {
    state.selectTheme = list;
  };

  const setSkuTable = (skuTable = []) => {
    state.skuTable = skuTable;
  };

  const setLazadaAttrs = (attributes = []) => {
    state.attributes = attributes;
    state.productClassifyAtrrs = attributes.filter((item) => {
      return (
        item.input_type !== "richText" &&
        item.attribute_type !== "sku" &&
        ![
          "video",
          "promotion_whitebkg_image",
          "brand",
          "warranty_type",
          "warranty",
          "model",
          "tax_class",
        ].includes(item.name)
      );
    });
    state.requiredAttrs = attributes.filter((attr) => attr.is_mandatory === 1);

    const skuAttrs = attributes.filter((attr) => {
      return attr.attribute_type === "sku" && attr.is_sale_prop === 1;
    });
    skuAttrs.forEach((skuAttr) => {
      skuAttr.checkedList = [];
      skuAttr.isEdit = false;
      skuAttr.skuOptions = skuAttr.options || [];
    });
    state.skuAttrs = skuAttrs;

    const warrantyType = attributes.find((attr) => {
      return attr.name === "warranty_type";
    });
    if (warrantyType) {
      state.warrantyTypeList = warrantyType.options || [];
    }

    const warranty = attributes.find((attr) => {
      return attr.name === "warranty";
    });
    if (warranty) {
      state.warrantyList = warranty.options || [];
    }

    const taxOptions = attributes.find((attr) => {
      return attr.name === "tax_class";
    });
    if (taxOptions) {
      state.taxOptions = taxOptions.options || [];
    }

    setLoading(false);
  };

  const setProduct = (data = {}) => {
    state.product = data;
  };

  const setProductSkus = (productSkus = []) => {
    state.productSkus = productSkus;
  };

  // 重置
  const reset = () => {
    state.shortCode = "";
    state.primaryCategory = [];
    state.selectTheme = [];
    state.attributes = [];
    state.productClassifyAtrrs = [];
    state.requiredAttrs = [];
    state.skuAttrs = [];
    state.warrantyTypeList = [];
    state.warrantyList = [];
    state.taxOptions = [];
    state.skuTable = [];
    state.loading = false;
    state.product = {};
    state.productSkus = [];
  };
  return {
    state,
    setShortCode,
    setPrimaryCategory,
    setSelectTheme,
    setLoading,
    setSkuTable,
    setLazadaAttrs,
    setProduct,
    reset,
    setProductSkus,
  };
});
