// 店铺编号验证规则
export const validateShopId = async (_rule, value) => {
  if (!value) {
    return Promise.reject('请选择店铺编号');
  } else {
    return Promise.resolve();
  }
};

// 模板名称验证规则
export const validateTemplateName = async (_rule, value) => {
  if (!value) {
    return Promise.reject('请输入模板名称');
  } else if (value.length < 1) {
    return Promise.reject('模板名称不能为空');
  } else {
    return Promise.resolve();
  }
};

// 生成表单验证规则
export const generateRules = (formState, formRef) => {
  return {
    shopId: [{ required: true, validator: validateShopId, trigger: 'change' }],
    templateName: [{ required: true, validator: validateTemplateName, trigger: 'change' }],
    // status字段有默认值，不需要额外验证
  };
};