// 获取input类型属性的值
const getInputValue = (attr, item) => {
    if(item.id === 10097) {
        return item[attr.name];
    }else  if (
        (attr.isAspect && !attr.isRequired) ||
        (attr.isAspect && attr.isCollection)
    ) {
        return item[attr.name] || "";
    }
};
// 获取select类型属性的值
const getSelectValue = (attr, item) => {
    if (item[attr.name]) {
        // 根据拿到的值去数组中找到匹配的ID
        let matchedId = attr.options.filter(e => e.value == item[attr.name]);
        return [matchedId[0]?.id, item[attr.name]];
    } else {
        return [ 0 ,""];
    }
};
// 获取multSelect类型属性的值
const getMultiSelectValue = (attr, item,createValueObj) => {
    if (item[attr.name]) {
        if (item[attr.name] instanceof Array) {
            return item[attr.name]?.map((item) => {
                return {
                    dictionary_value_id: "",
                    value: item,
                };
            });
        } else {
            const colorList = item[attr.name]?.split(";");
            console.log("colorList",colorList);
            
            return colorList.map((color) => {
                const foundOption = attr.options.find((option) => option.value === color);
                return {
                    dictionaryValueId: foundOption ? foundOption.id : "",
                    value: color,
                };
            });
        }
    } 
    else {
        return [{
            dictionaryValueId: 0,
            value: ""
        }]
    }
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
        let values = ""
        //   item.selectType === "multSelect"
        //     ? item?.modelValue?.map((val) => val.label).join(";")
        //     : item.selectType === "select"
        //     ? item.modelValue[0]?.label
        //       : item.modelValue; //原写法 item.modelValue.value
        output.attrIdList.push(item.id)
        if(item.selectType === "select") {
            values = item.modelValue[0]?.label || item.modelValue?.label
        }else if(item.selectType === "multSelect") {
            values = item?.modelValue?.map((val) => val.label).join(";")
        }else {
            values = item.modelValue
        }
        output[item.name] = values;
        output["secondName"] = item?.secondModelValue || "";
        output[item.secondName] = item?.secondModelValue || "";
      });
      console.log("output",output);
      
      return output;
    });
};
export {
    getInputValue,
    getSelectValue,
    getMultiSelectValue,
    processResult
};