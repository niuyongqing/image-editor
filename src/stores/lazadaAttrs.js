/**
 * lazada 分类属性列表
 */
import { defineStore } from "pinia";

export const useLadazaAttrs = defineStore("lazadaAttrs", () => {
  const state = reactive({
    shortCode: "", // 店铺
    attributes: [], // 所有属性
    productClassifyAtrrs: [], // 产品分类属性
    requiredAttrs: [], //  必填属性
    skuAttrs: [], //  SKU属性
    warrantyTypeList: [], //  质保类型属性
    warrantyList: [], //   质保时长属性
    taxOptions: [], // 税率属性
    loading: false, // 加载状态
  });

  const setShortCode = (shortCode = "") => {
    state.shortCode = shortCode;
  };
  const setLoading = (loading) => {
    state.loading = loading;
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

  return {
    state,
    setLoading,
    setShortCode,
    setLazadaAttrs,
  };
});
