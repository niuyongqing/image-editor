// 提取更新价格的公共逻辑
const updatePrice = (items, priceKey, batchFields) => {
  items.forEach((item) => {
    if (batchFields.priceValue === 1) {
      item[priceKey] = batchFields.batchValue;
    } else {
      item[priceKey] = endResult(
        Number(item[priceKey]),
        Number(batchFields.batchComputeValue),
        batchFields.computeValue,
        batchFields.roundValue
      );
    }
  });
};
//
const endResult = (oldPrice, batchComputeValue, computeValue, roundValue) => {
  // 获取计算操作函数
  const computeFunc = computeFunctions[computeValue];
  // 获取取整操作函数
  const roundFunc = roundFunctions[roundValue];

  // 如果计算操作函数存在，则进行计算和取整操作
  if (computeFunc) {
    const computedValue = computeFunc(oldPrice, batchComputeValue);
    return roundFunc(computedValue);
  }
  // 如果计算操作函数不存在，返回 0
  return 0;
};

// 定义取整函数对象，包含保留两位小数、四舍五入、向上取整操作
const roundFunctions = {
  keepTwo: (value) => value.toFixed(2),
  roundUp: Math.round,
  carry: Math.ceil,
};
// 定义计算函数对象，包含加、减、乘、除、百分比加、百分比减操作
const computeFunctions = {
  add: (oldPrice, batchComputeValue) => oldPrice + batchComputeValue,
  reduction: (oldPrice, batchComputeValue) => oldPrice - batchComputeValue,
  take: (oldPrice, batchComputeValue) => oldPrice * batchComputeValue,
  divide: (oldPrice, batchComputeValue) => oldPrice / batchComputeValue,
  percentAdd: (oldPrice, batchComputeValue) =>
    oldPrice * ((batchComputeValue + 100) / 100),
  percentReduction: (oldPrice, batchComputeValue) =>
    oldPrice * ((100 - batchComputeValue) / 100),
};

// 属性方法
const processAttributesCache = (attributesCache) => {
  return attributesCache.map((item) => {
    item.show = true;
    if (shouldHideItem(item)) {
      item.show = false;
    }
    return item;
  });
};
const shouldHideItem = (item) => {
  return (
    item.id === 4080 ||
    item.id === 8229 ||
    item.id === 8789 ||
    item.id === 8790 ||
    item.id === 4180 ||
    item.id === 4191 ||
    item.id === 11254 ||
    item.id === 9024 ||
    item.attributeComplexId === "100001" ||
    item.attributeComplexId === "100002" ||
    (item.isAspect && !item.isRequired) ||
    (item.isAspect && item.isCollection)
  );
};

// 排序商品颜色
const reorderArray = (arr) => {
  const hasProdColor = arr.some((item) => item.id === 10096);
  const hasColor = arr.some((item) => item.id === 10097);
  if (hasProdColor && hasColor) {
    const item = arr.find((item) => item.id === 10096);
    arr = arr.filter((item) => item.id !== 10096);
    arr.unshift(item);
  }
  return arr;
};

// 笛卡尔算法步骤1
const cartesianProduct = (data) => {
  return combine([], data);
};
// 笛卡尔算法步骤1
const combine = (current, remaining) => {
  if (remaining.length === 0) {
    return [current];
  }
  let first = remaining[0];
  let rest = remaining.slice(1);
  let result = [];
  for (let item of first.tableData) {
    for (let subResult of combine([...current, item], rest)) {
      result.push(subResult);
    }
  }

  return result;
};
// 笛卡尔算法步骤1 初始写法
const processResult = (productList) => {
  return productList.map((product) => {
    let output = {
      skuTitle: "",
      sellerSKU: "",
      price: "",
      oldPrice: "",
      quantity: undefined,
      warehouseList: [],
      packageLength: undefined,
      packageWidth: undefined,
      packageHeight: undefined,
      packageWeight: undefined,
      imageUrl: [],
      colorImg: [],
      id: Math.random().toString(36).substring(2, 10),
      attrIdList: [] // 变种属性 Id 合集
    };
    product.forEach((item) => {
      let values =
        item.selectType === "multSelect"
          ? item?.modelValue?.map((val) => val.label).join(";")
          : item.selectType === "select"
          ? item.modelValue?.label
            : item.modelValue; //原写法 item.modelValue.value
      output.attrIdList.push(item.id)
      output[item.name] = values;
      output["secondName"] = item?.secondModelValue || "";
      output[item.secondName] = item?.secondModelValue || "";
    });
    return output;
  });
};

// 删除表格数据
const processData = (a, b) => {
  // 遍历 a 数组
  for (const item of a) {
    const { tableData } = item;
    // 遍历 tableData
    for (let i = tableData.length - 1; i >= 0; i--) {
      const dataItem = tableData[i];
      const modelValue = 
        dataItem.selectType === 'input' 
        ? dataItem.modelValue 
        : dataItem.selectType === 'select'
        ? dataItem.modelValue?.label
        : dataItem.selectType === 'multSelect'
        ? dataItem?.modelValue?.map((val) => val.label).join(";") 
        : null;
      // 判断 modelValue 是否在 b 数组中有匹配的值
      const isMatch = b.some((bItem) => {
        const key = item.name; // 使用 a 数组的 name 作为键
        return bItem[key] === modelValue;
      });

      // 如果没有匹配的值
      if (!isMatch) {
        if (tableData.length > 1) {
          // 如果 tableData 长度大于 1，删除该条数据
          tableData.splice(i, 1);
        }
      }
    }
  }

  return a;
};

// 校验sku是否一致
const checkSellerSKU = (data) => {
  const skuSet = new Set();
  for (let item of data) {
    if (skuSet.has(item.sellerSKU)) {
      return true;
    }
    skuSet.add(item.sellerSKU);
  }
  return false;
};

// 变种属性值去重
const hasDuplicateModelValues = (arr) => {
  for (const item of arr) {
    if (item.tableData.length > 1) {
      const valueMap = new Map();
      for (const dataItem of item.tableData) {
        // 统一处理modelValue为特征字符串
        if (dataItem.modelValue === undefined || dataItem.modelValue.length === 0) continue;
        let modelValue;
        if (Array.isArray(dataItem.modelValue)) {
          // 处理数组类型：提取label并排序
          modelValue = dataItem.modelValue
            .map(v => v?.label || v?.value)
            .sort()
            .join('|');
        } else if (typeof dataItem.modelValue === 'object') {
          // 处理对象类型：序列化关键属性
          modelValue = JSON.stringify({
            label: dataItem.modelValue?.label,
            value: dataItem.modelValue?.value
          });
        } else {
          // 处理基本类型
          modelValue = String(dataItem.modelValue);
        }
        // 处理secondModelValue
        const secondValue = dataItem.secondModelValue || '';
        // 生成复合键
        const compositeKey = `${modelValue}__${secondValue}`;
        if (valueMap.has(compositeKey)) {
          return true;
        }
        valueMap.set(compositeKey, true);
      }
    }
  }
  return false;
};

// 判断是否包含商品颜色和颜色名称
const checkData = (data) => {
  const hasColorName = data.some((item) => item.id === 10097);
  const hasProductColor = data.some((item) => item.id === 10096);
  return hasColorName && hasProductColor;
};

// 处理报错表单
const findFalseInArrayLikeObject = (obj) => {
  let list = [];
  for (const key in obj) {
    if (obj[key] === false || obj[key] === undefined) {
      list.push(key);
    }
  }
  return list;
};
// 移动颜色名称的顺序
const rearrangeColorFields = (arr) => {
  // 查找颜色名称字段的索引
  const colorNameIndex = arr.findIndex((item) =>
    item.name.includes("颜色名称")
  );
  // 查找商品颜色字段的索引
  const productColorIndex = arr.findIndex((item) =>
    item.name.includes("商品颜色")
  );
  // 若两个字段都存在
  if (colorNameIndex !== -1 && productColorIndex !== -1) {
    // 提取颜色名称字段
    const colorNameField = arr.splice(colorNameIndex, 1)[0];
    // 将颜色名称字段插入到商品颜色字段之后
    arr.splice(productColorIndex + 1, 0, colorNameField);
  }
  return arr;
};

// 处理变种主题展示
const handleTheme = (list) => {
  let echoThemeList = [];
  if (checkData(list)) {
    const prodColor = list.find((item) => item.id === 10096);
    const newList = list.filter(
      (obj) => !(obj.id === 10097 || obj.id === 9533)
    );
    echoThemeList = newList.map((item) => {
      return {
        title: item.name,
        tableColumns: rebackHeadList(item.id, item),
        isRequired: item.isRequired,
        id: item.id,
        name: item.name,
        isAspect: item.isAspect,
        categoryDependent: item.categoryDependent,
        isCollection: item.isCollection,
        selectType: item.selectType,
        details: item.options,
        tableData: rebackDataList(item.id, item),
      };
    });
  } else {
    echoThemeList = list.map((item) => {
      return {
        title: item.name,
        tableColumns: [
          {
            selectType: item.selectType,
            dataIndex: item.name,
            title: item.name,
            type: 2,
            id: item.id,
            show: true,
            align: "center",
            width: 900,
          },
          {
            dataIndex: "options",
            title: "操作",
            fixed: "right",
            width: 200,
          },
        ],
        isRequired: item.isRequired,
        id: item.id,
        name: item.name,
        isRequired: item.isRequired,
        categoryDependent: item.categoryDependent,
        isCollection: item.isCollection,
        selectType: item.selectType,
        details: item.options,
        tableData: [
          {
            details: item.options?.map((item) => {
              return {
                ...item,
                label: item.value,
                value: item.id,
              };
            }),
            isRequired: item.isRequired,
            categoryDependent: item.categoryDependent,
            isCollection: item.isCollection,
            id: item.id,
            name: item.name,
            selectType: item.selectType,
            modelValue:
              item.selectType === "input"
                ? ""
                : item.selectType === "multSelect"
                ? []
                : undefined,
          },
        ],
      };
    });
  }
  return echoThemeList;
};
// 返回主题表格数据
const rebackHeadList = (id, item) => {
  let arr = [];
  if (id === 10096) {
    arr = [
      {
        selectType: item.selectType,
        dataIndex: item.name,
        title: item.name,
        type: 2,
        id: item.id,
        show: true,
        align: "center",
        width: 900,
      },
      {
        dataIndex: "颜色名称(Название цвета)",
        title: "颜色名称(Название цвета)",
        selectType: "input",
        show: true,
        type: 2,
        align: "center",
        id: 10097,
      },
      {
        dataIndex: "options",
        title: "操作",
        fixed: "right",
        width: 200,
      },
    ];
  } else if (id === 4295) {
    arr = [
      {
        selectType: item.selectType,
        dataIndex: item.name,
        title: item.name,
        type: 2,
        id: item.id,
        show: true,
        align: "center",
        width: 900,
      },
      {
        dataIndex: "由制造商规定尺码(Размер производителя)",
        title: "由制造商规定尺码(Размер производителя)",
        selectType: "input",
        show: true,
        type: 2,
        align: "center",
        id: 9533,
      },
      {
        dataIndex: "options",
        title: "操作",
        fixed: "right",
        width: 200,
      },
    ];
  } else {
    arr = [
      {
        selectType: item.selectType,
        dataIndex: item.name,
        title: item.name,
        type: 2,
        id: item.id,
        show: true,
        align: "center",
        width: 900,
      },
      {
        dataIndex: "options",
        title: "操作",
        fixed: "right",
        width: 200,
      },
    ];
  }
  return arr;
};

const rebackDataList = (id, item) => { 
  let arr = [];
  if (id === 10096) {
    arr = [
      {
        details: item.options?.map((item) => {
          return {
            ...item,
            label: item.value,
            value: item.id,
          };
        }),
        isRequired: item.isRequired,
        categoryDependent: item.categoryDependent,
        isCollection: item.isCollection,
        id: item.id,
        name: item.name,
        selectType: item.selectType,
        modelValue:
          item.selectType === "input"
            ? ""
            : item.selectType === "multSelect"
            ? []
            : undefined,
        secondName: "颜色名称(Название цвета)",
        "颜色名称(Название цвета)": "颜色名称(Название цвета)",
        secondId: 10097,
        secondModelValue: "",
      },
    ];
  } else if (id === 4295) {
    arr = [
      {
        details: item.options?.map((item) => {
          return {
            ...item,
            label: item.value,
            value: item.id,
          };
        }),
        isRequired: item.isRequired,
        categoryDependent: item.categoryDependent,
        isCollection: item.isCollection,
        id: item.id,
        name: item.name,
        selectType: item.selectType,
        modelValue:
          item.selectType === "input"
            ? ""
            : item.selectType === "multSelect"
            ? []
            : undefined,
        secondName: "由制造商规定尺码(Размер производителя)",
        "由制造商规定尺码(Размер производителя)": "由制造商规定尺码(Размер производителя)",
        secondId: 9533,
        secondModelValue: "",
      },
    ];
  } else {
    arr = [
      {
        details: item.options?.map((item) => {
          return {
            ...item,
            label: item.value,
            value: item.id,
          };
        }),
        isRequired: item.isRequired,
        categoryDependent: item.categoryDependent,
        isCollection: item.isCollection,
        id: item.id,
        name: item.name,
        selectType: item.selectType,
        modelValue:
          item.selectType === "input"
            ? ""
            : item.selectType === "multSelect"
            ? []
            : undefined,
      },
    ];
  }
  return arr;
};

// 获取input类型属性的值
const getInputValue = (attr, base, image, item) => {
  if (attr.id === 4191) {
    return image.description === "<ul><li></li></ul>"
      ? null
      : image.description;
  } else if (attr.id === 11254) {
    return image.jsons ?? null;
  } else if (
    (attr.isAspect && !attr.isRequired) ||
    (attr.isAspect && attr.isCollection)
  ) {
    return item[attr.name];
  } else {
    return base.attributes[attr.name] || "";
  }
};
// 获取select类型属性的值
const getSelectValue = (attr, base, item) => {
  if (attr.id === 8229) {
    return [
      Number(base.categoryId.threeCategoryId),
      base.categoryId.threeCategoryName,
    ];
  } else {
    const value = base.attributes[attr.name];

    if (attr.id === 9070 && value !== undefined) {
      return [0, value[0]?.value?.value];
    } else if (value?.value === "无品牌" || value?.label === "无品牌") {
      return [126745801, "无品牌"];
    } else {

      if (item[attr.name]) {
        // 根据拿到的值去数组中找到匹配的ID
        // console.log("options",attr.options);
        // console.log("item",item[attr.name]);
        let matchedId = attr.options.filter(e => e.value == item[attr.name]);
      //   const filteredData = attr.options.filter(item => 
      //     item.value.includes(item[attr.name])
      // );
        // console.log("matchedId",matchedId);
        
        return [matchedId[0]?.id, item[attr.name]];
      } else {
        return [value?.value, value?.value];
      }
    }
  }
};
// 获取multSelect类型属性的值
const getMultiSelectValue = (attr, item, base, createValueObj, type) => {
  if (item[attr.name]) {
    if(item[attr.name] instanceof Array) {
      return item[attr.name]?.map((item) => {
        return {
          dictionary_value_id: "",
          value: item,
        };
      });
    }else {
      const colorList = item[attr.name]?.split(";");
      return colorList.map((color) => {
        const foundOption = attr.options.find((option) => option.value === color);
        if (type === 1) {
          return {
            dictionary_value_id: foundOption ? foundOption.id : "",
            value: color,
          };
        } else {
          return {
            dictionaryValueId: foundOption ? foundOption.id : "",
            value: color,
          };
        }
      });
    }
  } else {
    let filteredData = attr.options.filter((item) =>
      base.attributes[attr.name]?.includes(item.id)
    );
    return (
      filteredData?.map((item) => createValueObj(item.id, item.label)) || []
    );
    // return (
    //     base.attributes[attr.name]?.map((item) =>
    //         createValueObj(item.id, item.value)
    //     ) || []
    // );
  }
};
// 判断值是否不为空
const isNotEmpty = (value) => {
  return value || value === 0 || value === false;
};
// 处理视频格式
const createAndUpdateBaseObj = (targetObj, complexId, id, type) => {
  // 统一属性命名格式
  const keyStyle = type === 1 ? "snake" : "camel";

  // 映射属性名
  const keyMap = {
    complexId: keyStyle === "snake" ? "complex_id" : "complexId",
    dictionaryValueId:
      keyStyle === "snake" ? "dictionary_value_id" : "dictionaryValueId",
  };
  // 100001 多个视频
  // 100002 单个视频
  // 通用值处理逻辑
  const processValues = () => {
    if (complexId === 100002) {
      // return [{ [keyMap.dictionaryValueId]: 0, value: targetObj.replace('/prod-api', '') }];
      return [
        {
          [keyMap.dictionaryValueId]: 0,
          value: targetObj,
        },
      ];
    }
    return (Array.isArray(targetObj) ? targetObj : []).map((item) => ({
      [keyMap.dictionaryValueId]: 0,
      // value: item?.url?.replace('/prod-api', '') || null // 添加空值保护
      value: item?.url || null,
    }));
  };

  return {
    attributes: [
      {
        [keyMap.complexId]: complexId,
        id: id,
        values: processValues(),
      },
    ],
  };
};

const processImageSource = (source) => {
  if (source === undefined || source === null || source === "") return;
  const processUrl = (url) => {
    // 检查是否以 https:// 开头
    if (url.startsWith("https://") || url.includes('/prod-api')) {
      return url;
    } else {
      // 移除开头的斜杠以避免重复，并拼接 /prod-api/
      return `/prod-api/${url.replace(/^\//, "")}`;
    }
  };

  // 处理数组或字符串
  return Array.isArray(source) ? source.map(processUrl) : processUrl(source);
};

export {
  updatePrice,
  endResult,
  processAttributesCache,
  reorderArray,
  cartesianProduct,
  processResult,
  processData,
  checkSellerSKU,
  hasDuplicateModelValues,
  checkData,
  findFalseInArrayLikeObject,
  rearrangeColorFields,
  handleTheme,
  getInputValue,
  getSelectValue,
  getMultiSelectValue,
  isNotEmpty,
  createAndUpdateBaseObj,
  processImageSource,
};
