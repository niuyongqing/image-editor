/**
 * 店铺模板校验规则
 */
export const storeTemplateRules = {
  // 店铺模板名称
  shopTemplateName: [
    { required: true, message: "请输入店铺模板名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],

  // 店铺id
  account: [{ required: true, message: "请选择店铺", trigger: "change" }],

  // 状态：0 默认，1 备选
  status: [
    { required: true, message: "请选择状态", trigger: ["change", "blur"] },
  ],

  // 首重物流费
  firstPriorityLogisticFee: [
    { required: true, message: "请输入首重物流费", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("首重物流费不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 续重物流费
  continuedLogisticFee: [
    { required: true, message: "请输入续重物流费", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("续重物流费不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 定价利润率，单位%
  profitRate: [
    { required: true, message: "请输入定价利润率", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("定价利润率不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 折损率，单位%
  lossRate: [
    { required: true, message: "请输入折损率", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("折损率不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 提现手续费率，单位%
  withdrawalFeeRate: [
    { required: true, message: "请输入提现手续费率", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("提现手续费率不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 物流佣金（RUB）
  logisticCommissionRate: [
    { required: true, message: "请输入物流佣金", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("物流佣金不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 平台佣金费率，单位%
  platformCommissionRate: [
    { required: true, message: "请输入平台佣金费率", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("平台佣金费率不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],

  // 原价折扣率，单位%
  discountRate: [
    { required: true, message: "请输入原价折扣率", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("原价折扣率不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  // 折扣率，单位%
  discountRate: [
    { required: true, message: "请输入折扣率", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && parseFloat(value) < 0) {
          callback(new Error("折扣率不能为负数"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};
