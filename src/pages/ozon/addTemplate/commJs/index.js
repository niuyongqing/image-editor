// 获取input类型属性的值
const getInputValue = (attr, item) => {
    // if (attr.id === 4191) {
    //     return image.description === "<ul><li></li></ul>"
    //         ? null
    //         : image.description;
    // } else if (attr.id === 11254) {
    //     return image.jsons
    //         ? typeof image.jsons === "string"
    //             ? image.jsons
    //             : JSON.stringify(image.jsons)
    //         : null;
    // } else 
    console.log("attr",attr);
    console.log("item",item);
    if (
        (attr.isAspect && !attr.isRequired) ||
        (attr.isAspect && attr.isCollection)
    ) {
        return item[attr.name] || "";
    } 
};
// 获取select类型属性的值
const getSelectValue = (attr, item) => {
    // if (attr.id === 8229) {
    //     return [
    //         Number(base.categoryId.threeCategoryId),
    //         base.categoryId.threeCategoryName,
    //     ];
    // } else {
    // }
    // const value = base.attributes[attr.name];

    // if (attr.id === 9070 && value !== undefined) {
    //     return [0, value[0]?.value?.value];
    // } else if (value?.value === "无品牌" || value?.label === "无品牌") {
    //     return [126745801, "无品牌"];
    // } else {

    // }
    console.log("attr",attr);
    console.log("item",item);
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
        return [ 0 ,""];
    }
    // else {
    //     return [value?.value, value?.value];
    // }
};
// 获取multSelect类型属性的值
const getMultiSelectValue = (attr, item, createValueObj, type) => {
    console.log("attr",attr);
    console.log("item",item);
    
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
    } 
    // else {
    //     let filteredData = attr.options.filter((item) =>
    //         base.attributes[attr.name]?.includes(item.id)
    //     );
    //     return (
    //         filteredData?.map((item) => createValueObj(item.id, item.label)) || []
    //     );
    //     // return (
    //     //     base.attributes[attr.name]?.map((item) =>
    //     //         createValueObj(item.id, item.value)
    //     //     ) || []
    //     // );
    // }
};


export {

    getInputValue,
    getSelectValue,
    getMultiSelectValue,

};