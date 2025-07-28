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


export {

    getInputValue,
    getSelectValue,
    getMultiSelectValue,

};