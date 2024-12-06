/** @license @lljj/vue3-form-ant (c) 2020-2024 Liu.Jun License: Apache-2.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue'), require('@lljj/vjsf-utils/vue3Utils'), require('@lljj/vjsf-utils/schema/getDefaultFormState'), require('@lljj/vjsf-utils/utils'), require('@lljj/vjsf-utils/formUtils'), require('@lljj/vjsf-utils/schema/retriev'), require('@lljj/vjsf-utils/components/FieldGroupWrap.vue'), require('@lljj/vjsf-utils/icons'), require('@lljj/vjsf-utils/schema/validate'), require('@lljj/vjsf-utils/arrayUtils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue', '@lljj/vjsf-utils/vue3Utils', '@lljj/vjsf-utils/schema/getDefaultFormState', '@lljj/vjsf-utils/utils', '@lljj/vjsf-utils/formUtils', '@lljj/vjsf-utils/schema/retriev', '@lljj/vjsf-utils/components/FieldGroupWrap.vue', '@lljj/vjsf-utils/icons', '@lljj/vjsf-utils/schema/validate', '@lljj/vjsf-utils/arrayUtils'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vue3FormAnt = {}, global.Vue, global.vueUtils, global.getDefaultFormState, global.utils, global.formUtils, global.retrieveSchema, global.FieldGroupWrap, global.icons, global.validate, global.arrayMethods));
}(this, (function (exports, vue, vueUtils, getDefaultFormState, utils, formUtils, retrieveSchema, FieldGroupWrap, icons, validate, arrayMethods) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var vueUtils__namespace = /*#__PURE__*/_interopNamespace(vueUtils);
  var getDefaultFormState__default = /*#__PURE__*/_interopDefaultLegacy(getDefaultFormState);
  var formUtils__namespace = /*#__PURE__*/_interopNamespace(formUtils);
  var retrieveSchema__default = /*#__PURE__*/_interopDefaultLegacy(retrieveSchema);
  var FieldGroupWrap__default = /*#__PURE__*/_interopDefaultLegacy(FieldGroupWrap);
  var validate__namespace = /*#__PURE__*/_interopNamespace(validate);

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];

    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }

    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");

    return typeof key === "symbol" ? key : String(key);
  }

  /**
   * Created by Liu.Jun on 2020/4/16 10:47 下午.
   */
  var vueProps = {
    formFooter: {
      type: Object,
      default: function _default() {
        return {
          show: true,
          okBtn: '保存',
          cancelBtn: '取消'
        };
      }
    },
    modelValue: {
      type: null,
      default: function _default() {
        return {};
      },
      required: true
    },
    fallbackLabel: {
      type: Boolean,
      default: false
    },
    strictMode: {
      type: Boolean,
      default: false
    },
    formProps: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    schema: {
      type: Object,
      default: function _default() {
        return {};
      },
      required: true
    },
    // 重置ui样式
    uiSchema: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 自定义校验规则
    customFormats: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 自定义校验
    customRule: {
      type: Function,
      default: null
    },
    // 重置自定义错误
    errorSchema: {
      type: Object,
      default: function _default() {
        return {};
      }
    }
  };

  var FormFooter = {
    name: 'FormFooter',
    props: {
      okBtn: {
        type: String,
        default: '保存'
      },
      okBtnProps: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      cancelBtn: {
        type: String,
        default: '取消'
      },
      formItemAttrs: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      globalOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },
    emits: ['cancel', 'submit'],
    setup: function setup(props, _ref) {
      var emit = _ref.emit;
      // globalOptions 不需要响应式
      var COMPONENT_MAP = props.globalOptions.COMPONENT_MAP;
      return function () {
        return vue.h(vueUtils.resolveComponent(COMPONENT_MAP.formItem), _objectSpread2({
          class: {
            formFooter_item: true
          }
        }, props.formItemAttrs), {
          default: function _default() {
            return [vue.h(vueUtils.resolveComponent(COMPONENT_MAP.button), {
              onClick: function onClick() {
                emit('cancel');
              }
            }, {
              default: function _default() {
                return props.cancelBtn;
              }
            }), vue.h(vueUtils.resolveComponent(COMPONENT_MAP.button), _objectSpread2({
              style: {
                marginLeft: '10px'
              },
              type: 'primary',
              onClick: function onClick() {
                emit('submit');
              }
            }, props.okBtnProps), {
              default: function _default() {
                return props.okBtn;
              }
            })];
          }
        });
      };
    }
  };

  /**
   * Created by Liu.Jun on 2020/4/22 18:58.
   */
  // 递归参数，统一props
  var vueProps$1 = {
    formProps: {
      type: null
    },
    // 全局的配置，用于 初始化差异，适配不同的ui框架
    globalOptions: {
      type: null
    },
    // 当前节点schema
    schema: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 当前节点Ui Schema
    uiSchema: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 当前节点Error Schema
    errorSchema: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 自定义校验
    customRule: {
      type: Function,
      default: null
    },
    // 自定义校验规则
    customFormats: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 根节点 Schema
    rootSchema: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    // 根节点的数据
    rootFormData: {
      type: null,
      default: function _default() {
        return {};
      }
    },
    // 当前节点路径
    curNodePath: {
      type: String,
      default: ''
    },
    // 是否必填
    required: {
      type: Boolean,
      default: false
    },
    // 是否需要校验数据组
    // object array 类型默认会最后追加一个校验组件校验整体数据
    needValidFieldGroup: {
      type: Boolean,
      default: true
    }
  };

  var Widget = {
    name: 'Widget',
    props: {
      // 是否同步formData的值，默认表单元素都需要
      // oneOf anyOf 中的select属于formData之外的数据
      isFormData: {
        type: Boolean,
        default: true
      },
      // isFormData = false时需要传入当前 value 否则会通过 curNodePath 自动计算
      curValue: {
        type: null,
        default: 0
      },
      schema: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      uiSchema: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      errorSchema: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      customFormats: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // 自定义校验
      customRule: {
        type: Function,
        default: null
      },
      widget: {
        type: [String, Function, Object],
        default: null
      },
      // 通过定义的 schema 计算出来的
      required: {
        type: Boolean,
        default: false
      },
      // 通过ui schema 配置传递的props
      uiRequired: {
        type: Boolean
      },
      // 解决 JSON Schema和实际输入元素中空字符串 required 判定的差异性
      // 元素输入为 '' 使用 emptyValue 的值
      emptyValue: {
        type: null,
        default: undefined
      },
      rootFormData: {
        type: null
      },
      curNodePath: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      // width -> formItem width
      width: {
        type: String,
        default: ''
      },
      labelWidth: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      // Widget attrs
      widgetAttrs: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // Widget className
      widgetClass: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // Widget style
      widgetStyle: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // Field attrs
      fieldAttrs: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // Field className
      fieldClass: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // Field style
      fieldStyle: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      // props
      uiProps: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      formProps: null,
      getWidget: null,
      renderScopedSlots: null,
      // 作用域插槽
      globalOptions: null,
      // 全局配置
      onChange: null
    },
    emits: ['otherDataChange'],
    inheritAttrs: true,
    setup: function setup(props, _ref) {
      var emit = _ref.emit;
      var genFormProvide = vue.inject('genFormProvide');
      var widgetValue = vue.computed({
        get: function get() {
          if (props.isFormData) return vueUtils.getPathVal(props.rootFormData, props.curNodePath);
          return props.curValue;
        },
        set: function set(value) {
          // 大多组件删除为空值会重置为null。
          var trueValue = value === '' || value === null ? props.emptyValue : value;

          if (props.isFormData) {
            vueUtils.setPathVal(props.rootFormData, props.curNodePath, trueValue);
          } else {
            emit('otherDataChange', trueValue);
          }
        }
      });
      var realRequired = vue.computed(function () {
        var _props$uiRequired;

        return (_props$uiRequired = props.uiRequired) !== null && _props$uiRequired !== void 0 ? _props$uiRequired : props.required;
      }); // 枚举类型默认值为第一个选项

      if (props.uiProps.enumOptions && props.uiProps.enumOptions.length > 0 && widgetValue.value === undefined && widgetValue.value !== props.uiProps.enumOptions[0]) {
        // array 渲染为多选框时默认为空数组
        if (props.schema.items) {
          widgetValue.value = [];
        } else if (realRequired.value && props.formProps.defaultSelectFirstOption) {
          widgetValue.value = props.uiProps.enumOptions[0].value;
        }
      } // 获取到widget组件实例


      var widgetRef = vue.ref(null); // 提供一种特殊的配置 允许直接访问到 widget vm

      if (typeof props.getWidget === 'function') {
        vue.watch(widgetRef, function () {
          props.getWidget.call(null, widgetRef.value);
        });
      }

      return function () {
        var _props$formProps;

        // 判断是否为根节点
        var isRootNode = vueUtils.isRootNodePath(props.curNodePath);
        var isMiniDes = props.formProps && props.formProps.isMiniDes;
        var miniDesModel = isMiniDes !== null && isMiniDes !== void 0 ? isMiniDes : props.globalOptions.HELPERS.isMiniDes(props.formProps);
        var descriptionVNode = props.description ? vue.h('div', {
          innerHTML: props.description,
          class: {
            genFromWidget_des: true,
            genFromWidget_des_mini: miniDesModel
          }
        }) : null;
        var COMPONENT_MAP = props.globalOptions.COMPONENT_MAP;
        var miniDescriptionVNode = miniDesModel && descriptionVNode ? vue.h(vueUtils.resolveComponent(COMPONENT_MAP.popover), _objectSpread2({
          style: {
            margin: '0 2px',
            fontSize: '16px',
            cursor: 'pointer'
          },
          placement: 'top',
          trigger: 'hover'
        }, (_props$formProps = props.formProps) === null || _props$formProps === void 0 ? void 0 : _props$formProps.popover), {
          default: function _default() {
            return descriptionVNode;
          },
          reference: function reference() {
            return vue.h(icons.IconQuestion);
          }
        }) : null; // form-item style

        var formItemStyle = _objectSpread2(_objectSpread2({}, props.fieldStyle), props.width ? {
          width: props.width,
          flexBasis: props.width,
          paddingRight: '10px'
        } : {}); // 运行配置回退到 属性名


        var _label = formUtils.fallbackLabel(props.label, props.widget && genFormProvide.fallbackLabel.value, props.curNodePath);

        return vue.h(vueUtils.resolveComponent(COMPONENT_MAP.formItem), _objectSpread2(_objectSpread2(_objectSpread2({
          class: _objectSpread2(_objectSpread2({}, props.fieldClass), {}, {
            genFormItem: true
          }),
          style: formItemStyle
        }, props.fieldAttrs), {}, {
          description: props.description,
          _title: _label
        }, props.labelWidth ? {
          labelWidth: props.labelWidth
        } : {}), props.isFormData ? {
          // 这里对根节点打特殊标志，绕过elementUi无prop属性不校验
          prop: isRootNode ? '__$$root' : vueUtils.path2prop(props.curNodePath),
          rules: [{
            validator: function validator(rule, value, callback) {
              if (isRootNode) value = props.rootFormData; // 校验是通过对schema逐级展开校验 这里只捕获根节点错误

              var errors = validate.validateFormDataAndTransformMsg({
                formData: value,
                schema: props.schema,
                uiSchema: props.uiSchema,
                customFormats: props.customFormats,
                errorSchema: props.errorSchema,
                required: realRequired.value,
                propPath: vueUtils.path2prop(props.curNodePath)
              }); // 存在校验不通过字段

              if (errors.length > 0) {
                if (callback) return callback(errors[0].message);
                return Promise.reject(errors[0].message);
              } // customRule 如果存在自定义校验


              var curCustomRule = props.customRule;

              if (curCustomRule && typeof curCustomRule === 'function') {
                return curCustomRule({
                  field: props.curNodePath,
                  value: value,
                  rootFormData: props.rootFormData,
                  callback: callback
                });
              } // 校验成功


              if (callback) return callback();
              return Promise.resolve();
            },
            trigger: 'change'
          }]
        } : {}), _objectSpread2(_objectSpread2({
          // 错误只能显示一行，多余...
          error: function error(slotProps) {
            return slotProps.error ? vue.h('div', {
              class: {
                formItemErrorBox: true
              },
              title: slotProps.error
            }, [slotProps.error]) : null;
          }
        }, _label ? {
          label: function label() {
            return vue.h('span', {
              class: {
                genFormLabel: true,
                genFormItemRequired: realRequired.value
              }
            }, ["".concat(_label)].concat(_toConsumableArray(miniDescriptionVNode ? [miniDescriptionVNode] : []), ["".concat(props.formProps && props.formProps.labelSuffix || '')]));
          }
        } : {}), {}, {
          // default
          default: function _default(otherAttrs) {
            return [].concat(_toConsumableArray(!miniDesModel && descriptionVNode ? [descriptionVNode] : []), _toConsumableArray(props.widget ? [vue.h( // 关键输入组件
            vueUtils.resolveComponent(props.widget), _objectSpread2(_objectSpread2(_objectSpread2({
              style: props.widgetStyle,
              class: props.widgetClass
            }, props.widgetAttrs), props.uiProps), {}, {
              modelValue: widgetValue.value,
              // v-model
              ref: widgetRef,
              'onUpdate:modelValue': function updateModelValue(event) {
                var preVal = widgetValue.value;

                if (preVal !== event) {
                  widgetValue.value = event;

                  if (props.onChange) {
                    props.onChange({
                      curVal: event,
                      preVal: preVal,
                      parentFormData: vueUtils.getPathVal(props.rootFormData, props.curNodePath, 1),
                      rootFormData: props.rootFormData
                    });
                  }
                }
              }
            }, otherAttrs ? function () {
              return Object.keys(otherAttrs).reduce(function (pre, k) {
                pre[k] = otherAttrs[k]; // 保证ui配置同名方法 ui方法先执行

                [props.widgetAttrs[k], props.uiProps[k]].forEach(function (uiConfFn) {
                  if (uiConfFn && typeof uiConfFn === 'function') {
                    pre[k] = function () {
                      uiConfFn.apply(void 0, arguments);
                      pre[k].apply(pre, arguments);
                    };
                  }
                });
                return pre;
              }, {});
            }() : {}), _objectSpread2({}, props.renderScopedSlots ? typeof props.renderScopedSlots === 'function' ? props.renderScopedSlots() : props.renderScopedSlots : {}))] : []));
          }
        }));
      };
    }
  };

  var ObjectField = {
    name: 'ObjectField',
    props: vueProps$1,
    setup: function setup(props) {
      // required
      var isRequired = function isRequired(name) {
        return Array.isArray(props.schema.required) && !!~props.schema.required.indexOf(name);
      }; // 存在 dependencies 配置，需要当前属性是否存在依赖关系 和当前属性是否正在被依赖
      // tip: 判断依赖关系需要使用了 formData 的值来做判断，所以当用户输入的时候会触发整个对象树重新渲染
      // TODO: 每个属性都需要单独来遍历 dependencies 属性可以优化一点点点点点（可通过 key value 反转值加个缓存来计算）


      var isDependOn = function isDependOn(name) {
        var isDependency = false; // 是否是一个被依赖项

        var curDependent = false; // 当前是否触发依赖

        if (utils.isObject(props.schema.dependencies)) {
          curDependent = Object.entries(props.schema.dependencies).some(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            // 是否和当前属性存在依赖关系
            var tempDependency = !!(Array.isArray(value) && ~value.indexOf(name)); // 是否是一个被依赖项

            isDependency = isDependency || tempDependency; // 当前需要依赖

            return tempDependency && vueUtils.getPathVal(props.rootFormData, props.curNodePath)[key] !== undefined;
          });
        }

        return {
          isDependency: isDependency,
          curDependent: curDependent
        };
      };

      return function () {
        var curNodePath = props.curNodePath;

        var _getUiOptions = formUtils.getUiOptions({
          schema: props.schema,
          uiSchema: props.uiSchema,
          curNodePath: curNodePath,
          rootFormData: props.rootFormData
        }),
            title = _getUiOptions.title,
            description = _getUiOptions.description,
            showTitle = _getUiOptions.showTitle,
            showDescription = _getUiOptions.showDescription,
            order = _getUiOptions.order,
            fieldClass = _getUiOptions.fieldClass,
            fieldAttrs = _getUiOptions.fieldAttrs,
            fieldStyle = _getUiOptions.fieldStyle,
            onlyShowIfDependent = _getUiOptions.onlyShowIfDependent;

        var properties = Object.keys(props.schema.properties || {});
        var orderedProperties = formUtils.orderProperties(properties, order); // 递归参数

        var propertiesVNodeList = orderedProperties.map(function (name) {
          var required = isRequired(name);

          var _isDependOn = isDependOn(name),
              isDependency = _isDependOn.isDependency,
              curDependent = _isDependOn.curDependent; // onlyShowWhenDependent 只渲染被依赖的属性


          return isDependency && onlyShowIfDependent && !curDependent ? null : vue.h(SchemaField, _objectSpread2(_objectSpread2({
            key: name
          }, props), {}, {
            schema: props.schema.properties[name],
            uiSchema: props.uiSchema[name],
            errorSchema: props.errorSchema[name],
            required: required || curDependent,
            curNodePath: vueUtils.computedCurPath(curNodePath, name)
          }));
        });
        return vue.h(FieldGroupWrap__default['default'], _objectSpread2({
          title: title,
          description: description,
          showTitle: showTitle,
          showDescription: showDescription,
          curNodePath: curNodePath,
          class: _objectSpread2({}, fieldClass),
          style: fieldStyle
        }, fieldAttrs), {
          default: function _default() {
            return [].concat(_toConsumableArray(propertiesVNodeList), _toConsumableArray(props.needValidFieldGroup ? [vue.h(Widget, {
              key: 'validateWidget-object',
              class: {
                validateWidget: true,
                'validateWidget-object': true
              },
              schema: Object.entries(props.schema).reduce(function (preVal, _ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    key = _ref4[0],
                    value = _ref4[1];

                if (props.schema.additionalProperties === false || !['properties', 'id', '$id'].includes(key)) preVal[key] = value;
                return preVal;
              }, {}),
              uiSchema: props.uiSchema,
              errorSchema: props.errorSchema,
              curNodePath: curNodePath,
              rootFormData: props.rootFormData,
              globalOptions: props.globalOptions
            })] : []));
          }
        });
      };
    }
  };

  var StringField = {
    name: 'StringField',
    props: vueProps$1,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      var widgetConfig = vue.computed(function () {
        // 可能是枚举数据使用select组件，否则使用 input
        var enumOptions = formUtils.isSelect(props.schema) && formUtils.optionsList(props.schema, props.uiSchema, props.curNodePath, props.rootFormData);
        var tempWidgetConfig = formUtils.getWidgetConfig({
          schema: props.schema,
          uiSchema: props.uiSchema,
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData
        }, function () {
          var isNumber = props.schema.type === 'number' || props.schema.type === 'integer';
          return {
            widget: enumOptions ? props.globalOptions.WIDGET_MAP.common.select : props.globalOptions.WIDGET_MAP.formats[props.schema.format] || (isNumber ? props.globalOptions.WIDGET_MAP.types.number : props.globalOptions.WIDGET_MAP.types.string)
          };
        }); // 存在枚举数据列表 传入 enumOptions

        if (enumOptions && !tempWidgetConfig.uiProps.enumOptions) {
          tempWidgetConfig.uiProps.enumOptions = enumOptions;
        }

        return tempWidgetConfig;
      });
      return function () {
        return vue.h(Widget, _objectSpread2(_objectSpread2(_objectSpread2({}, props), attrs), widgetConfig.value));
      };
    }
  };

  var NumberField = {
    name: 'NumberField',
    props: vueProps$1,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        return vue.h(StringField, _objectSpread2(_objectSpread2({}, props), attrs));
      };
    }
  };

  var IntegerField = {
    name: 'IntegerField',
    props: vueProps$1,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        return vue.h(StringField, _objectSpread2(_objectSpread2({}, props), attrs));
      };
    }
  };

  var BooleanField = {
    name: 'BooleanField',
    props: vueProps$1,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        var schema = props.schema,
            uiSchema = props.uiSchema,
            curNodePath = props.curNodePath,
            rootFormData = props.rootFormData,
            globalOptions = props.globalOptions; // Bool 会默认传入枚举类型选项 true false

        var enumOptions = formUtils.optionsList({
          enumNames: schema.enumNames || ['true', 'false'],
          enum: schema.enum || [true, false]
        }, uiSchema, curNodePath, rootFormData);
        var widgetConfig = formUtils.getWidgetConfig({
          schema: schema,
          uiSchema: uiSchema,
          curNodePath: curNodePath,
          rootFormData: rootFormData
        }, function () {
          return {
            widget: globalOptions.WIDGET_MAP.types.boolean
          };
        });
        widgetConfig.uiProps.enumOptions = widgetConfig.uiProps.enumOptions || enumOptions;
        return vue.h(Widget, _objectSpread2(_objectSpread2(_objectSpread2({}, attrs), props), widgetConfig));
      };
    }
  };

  var ArrayOrderList = {
    name: 'ArrayOrderList',
    emits: ['arrayOperate'],
    props: {
      // 需要被排序的VNode list
      vNodeList: {
        type: Array,
        default: []
      },
      // tuple类型的数组，需要固定前值
      tupleItemsLength: {
        type: Number,
        default: 0
      },
      addable: {
        // 是否启用添加
        type: Boolean,
        default: true
      },
      showIndexNumber: {
        // 是否显示当前序号
        type: Boolean,
        default: false
      },
      sortable: {
        // 是否可排序
        type: Boolean,
        default: true
      },
      removable: {
        // 是否可移除
        type: Boolean,
        default: true
      },
      maxItems: {// 最多添加个数
      },
      minItems: {// 最少添加个数
      },
      globalOptions: null
    },
    setup: function setup(props, _ref) {
      var emit = _ref.emit;
      // 是否可添加
      var canAdd = vue.computed(function () {
        var addable = props.addable,
            maxItems = props.maxItems,
            vNodeList = props.vNodeList; // 配置不可添加

        if (!addable) return false; // 配置了最大个数

        if (maxItems !== undefined) {
          return vNodeList.length < maxItems;
        }

        return !!maxItems;
      }); // 是否可移除

      var canRemove = vue.computed(function () {
        var removable = props.removable,
            minItems = props.minItems,
            vNodeList = props.vNodeList; // 配置不可移除

        if (!removable) return false;

        if (minItems !== undefined) {
          return vNodeList.length > minItems;
        }

        return true;
      });
      return function () {
        // 没有数据，且不能添加不渲染该组件
        if (props.vNodeList.length <= 0 && !props.addable) return null; // 是否可继续添加元素

        return vue.h('div', {
          class: {
            arrayOrderList: true
          }
        }, vue.h('div', {
          class: {
            arrayOrderListContent: true
          }
        }, props.vNodeList.map(function (_ref2, index) {
          var key = _ref2.key,
              VNodeItem = _ref2.vNode;
          var trueIndex = props.tupleItemsLength + index;
          var indexNumber = index + 1;
          return vue.h('div', {
            key: key,
            class: {
              arrayOrderList_item: true
            }
          }, [props.showIndexNumber ? vue.h('div', {
            class: {
              arrayListItem_index: true
            }
          }, indexNumber) : null, // 如果不添加多个就不显示工具栏
          vue.h('div', {
            style: _objectSpread2({}, !props.sortable || index === props.vNodeList.length - 1 ? {
              display: 'none'
            } : {}),
            class: {
              arrayListItem_operateTool: true
            }
          }, [vue.h('button', {
            // 配置不可排序不显示排序按钮
            style: _objectSpread2({}, !props.sortable ? {
              display: 'none'
            } : {}),
            class: {
              arrayListItem_btn: true,
              'arrayListItem_orderBtn-top': true
            },
            type: 'button',
            disabled: !props.sortable || index === 0,
            onClick: function onClick() {
              emit('arrayOperate', {
                command: 'moveUp',
                data: {
                  index: trueIndex
                }
              });
            }
          }, [vue.h(icons.IconCaretUp)]), vue.h('button', {
            // 配置不可排序不显示排序按钮
            style: _objectSpread2({}, !props.sortable ? {
              display: 'none'
            } : {}),
            class: {
              arrayListItem_btn: true,
              'arrayListItem_orderBtn-bottom': true
            },
            type: 'button',
            disabled: !props.sortable || index === props.vNodeList.length - 1,
            onClick: function onClick() {
              emit('arrayOperate', {
                command: 'moveDown',
                data: {
                  index: trueIndex
                }
              });
            }
          }, [vue.h(icons.IconCaretDown)]), vue.h('button', {
            // 配置不可移除不显示移除按钮
            style: _objectSpread2({}, !props.removable ? {
              display: 'none'
            } : {}),
            class: {
              arrayListItem_btn: true,
              'arrayListItem_btn-delete': true
            },
            type: 'button',
            disabled: !canRemove.value,
            onClick: function onClick() {
              emit('arrayOperate', {
                command: 'remove',
                data: {
                  index: trueIndex
                }
              });
            }
          }, [vue.h(icons.IconClose)])]), vue.h('div', _objectSpread2(_objectSpread2({}, !canAdd.value ? {
            paddingTop: '0px'
          } : {}), {}, {
            class: {
              arrayListItem_content: true
            }
          }), [VNodeItem])]);
        })), vue.h('div', {
          style: _objectSpread2({}, !canAdd.value ? {
            display: 'none'
          } : {}),
          class: {
            arrayOrderList_bottomAddBtn: true
          }
        }, [vue.h('div', {
          class: {
            bottomAddBtn: true,
            'is-plain': true,
            genFormBtn: true,
            'addOption-btn': true
          },
          // type: 'button',
          onClick: function onClick() {
            emit('arrayOperate', {
              command: 'add'
            });
          }
        }, [vue.h(icons.IconPlus, {
          style: {
            marginRight: '5px'
          }
        }), props.maxItems ? "\u6DFB\u52A0\u66F4\u591A(".concat(props.vNodeList.length, " / ").concat(props.maxItems ? props.maxItems : '∞', ")") : ''])]));
      };
    }
  };

  var ArrayFieldNormal = {
    name: 'ArrayFieldNormal',
    props: _objectSpread2(_objectSpread2({}, vueProps$1), {}, {
      itemsFormData: {
        type: Array
      }
    }),
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        var schema = props.schema,
            uiSchema = props.uiSchema,
            curNodePath = props.curNodePath,
            rootFormData = props.rootFormData,
            itemsFormData = props.itemsFormData,
            errorSchema = props.errorSchema,
            globalOptions = props.globalOptions;

        var _getUiOptions = formUtils.getUiOptions({
          schema: schema,
          uiSchema: uiSchema,
          curNodePath: curNodePath,
          rootFormData: rootFormData
        }),
            title = _getUiOptions.title,
            description = _getUiOptions.description,
            addable = _getUiOptions.addable,
            showIndexNumber = _getUiOptions.showIndexNumber,
            sortable = _getUiOptions.sortable,
            removable = _getUiOptions.removable,
            showTitle = _getUiOptions.showTitle,
            showDescription = _getUiOptions.showDescription,
            fieldClass = _getUiOptions.fieldClass,
            fieldAttrs = _getUiOptions.fieldAttrs,
            fieldStyle = _getUiOptions.fieldStyle;

        var arrayItemsVNodeList = itemsFormData.map(function (item, index) {
          var tempUiSchema = formUtils.replaceArrayIndex({
            schema: schema.items,
            uiSchema: uiSchema.items
          }, index);
          return {
            key: item.key,
            vNode: vue.h(SchemaField, _objectSpread2(_objectSpread2({
              key: item.key
            }, props), {}, {
              schema: schema.items,
              required: ![].concat(schema.items.type).includes('null'),
              uiSchema: _objectSpread2(_objectSpread2({}, uiSchema.items), tempUiSchema),
              errorSchema: errorSchema.items,
              curNodePath: vueUtils.computedCurPath(curNodePath, index)
            }))
          };
        });
        return vue.h(FieldGroupWrap__default['default'], {
          title: title,
          description: description,
          showTitle: showTitle,
          showDescription: showDescription,
          curNodePath: curNodePath,
          class: fieldClass,
          attrs: fieldAttrs,
          style: fieldStyle
        }, {
          default: function _default() {
            return vue.h(ArrayOrderList, _objectSpread2(_objectSpread2({}, attrs), {}, {
              vNodeList: arrayItemsVNodeList,
              showIndexNumber: showIndexNumber,
              addable: addable,
              sortable: sortable,
              removable: removable,
              maxItems: schema.maxItems || schema.maxUniqueItems,
              minItems: schema.minItems || schema.minUniqueItems,
              globalOptions: globalOptions
            }));
          }
        });
      };
    }
  };

  var ArrayFieldMultiSelect = {
    name: 'ArrayFieldMultiSelect',
    props: _objectSpread2({}, vueProps$1),
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        var schema = props.schema,
            rootSchema = props.rootSchema,
            uiSchema = props.uiSchema,
            curNodePath = props.curNodePath,
            rootFormData = props.rootFormData,
            globalOptions = props.globalOptions; // 这里需要索引当前节点，通过到schemaField组件的会统一处理

        var itemsSchema = retrieveSchema__default['default'](schema.items, rootSchema);
        var enumOptions = formUtils.optionsList(itemsSchema, uiSchema, curNodePath, rootFormData);
        var widgetConfig = formUtils.getWidgetConfig({
          schema: schema,
          uiSchema: uiSchema,
          curNodePath: curNodePath,
          rootFormData: rootFormData
        }, function () {
          return {
            widget: globalOptions.WIDGET_MAP.common.checkboxGroup
          };
        }); // 存在枚举数据列表 传入 enumOptions

        widgetConfig.uiProps.multiple = true;

        if (enumOptions && !widgetConfig.uiProps.enumOptions) {
          widgetConfig.uiProps.enumOptions = enumOptions;
        }

        return vue.h(Widget, _objectSpread2(_objectSpread2(_objectSpread2({}, attrs), props), widgetConfig));
      };
    }
  };

  var ArrayFieldTuple = {
    name: 'ArrayFieldTuple',
    props: _objectSpread2(_objectSpread2({}, vueProps$1), {}, {
      itemsFormData: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    }),
    emits: ['arrayOperate'],
    setup: function setup(props, _ref) {
      var emit = _ref.emit;
          _ref.attrs;

      // 兼容数据 长度不足的的场景
      var fixItemsFormData = function fixItemsFormData() {
        var isNoArray = !Array.isArray(props.itemsFormData);

        if (isNoArray || props.itemsFormData.length < props.schema.items.length) {
          // 这里需要补齐默认数据，计算出需要的数据
          var curSchemaState = getDefaultFormState__default['default'](props.schema, undefined, props.rootSchema);

          if (isNoArray) {
            // 数据修复 - 重置一个新的值
            emit('arrayOperate', {
              command: 'setNewTarget',
              data: {
                newTarget: curSchemaState
              }
            });
          } else {
            // 修复数据 - 追加不足的数据
            emit('arrayOperate', {
              command: 'batchPush',
              data: {
                pushArray: curSchemaState.slice(props.itemsFormData.length)
              }
            });
          }
        }
      };

      fixItemsFormData();
      return function () {
        if (!Array.isArray(props.itemsFormData)) return null;
        var schema = props.schema,
            uiSchema = props.uiSchema,
            errorSchema = props.errorSchema,
            curNodePath = props.curNodePath,
            globalOptions = props.globalOptions;

        var _getUiOptions = formUtils.getUiOptions({
          schema: schema,
          uiSchema: uiSchema,
          curNodePath: curNodePath,
          rootFormData: props.rootFormData
        }),
            title = _getUiOptions.title,
            description = _getUiOptions.description,
            addable = _getUiOptions.addable,
            showIndexNumber = _getUiOptions.showIndexNumber,
            sortable = _getUiOptions.sortable,
            removable = _getUiOptions.removable,
            showTitle = _getUiOptions.showTitle,
            showDescription = _getUiOptions.showDescription,
            fieldClass = _getUiOptions.fieldClass,
            fieldAttrs = _getUiOptions.fieldAttrs,
            fieldStyle = _getUiOptions.fieldStyle; // 拆分为 tuple 和 additional


        var cutOfArr = arrayMethods.cutOff(props.itemsFormData, props.schema.items.length - 1);
        var tupleVNodeArr = cutOfArr[0].map(function (item, index) {
          return vue.h(SchemaField, _objectSpread2(_objectSpread2({
            key: item.key
          }, props), {}, {
            required: ![].concat(schema.items[index].type).includes('null'),
            schema: schema.items[index],
            uiSchema: uiSchema.items ? uiSchema.items[index] : {},
            errorSchema: errorSchema.items ? errorSchema.items[index] : {},
            curNodePath: vueUtils.computedCurPath(curNodePath, index)
          }));
        }); // 通过order组件做可排序处理

        var additionalVNodeArr = cutOfArr[1].map(function (item, index) {
          var tempUiSchema = formUtils.replaceArrayIndex({
            schema: schema.additionalItems,
            uiSchema: uiSchema.additionalItems
          }, index);
          return {
            key: item.key,
            vNode: vue.h(SchemaField, _objectSpread2(_objectSpread2({
              key: item.key
            }, props), {}, {
              schema: schema.additionalItems,
              required: ![].concat(schema.additionalItems.type).includes('null'),
              uiSchema: _objectSpread2(_objectSpread2({}, uiSchema.additionalItems), tempUiSchema),
              errorSchema: errorSchema.additionalItems,
              curNodePath: vueUtils.computedCurPath(props.curNodePath, index + schema.items.length)
            }))
          };
        }); // 是否可添加同时受限于 additionalItems 属性

        var trueAddable = (addable === undefined ? true : addable) && formUtils.allowAdditionalItems(props.schema); // 默认循环固定配置的数据 长度外的使用ArrayOrderList渲染

        return vue.h(FieldGroupWrap__default['default'], _objectSpread2(_objectSpread2({
          title: title,
          description: description,
          showTitle: showTitle,
          showDescription: showDescription,
          curNodePath: curNodePath
        }, fieldAttrs), {}, {
          class: fieldClass,
          style: fieldStyle
        }), {
          default: function _default() {
            return [].concat(_toConsumableArray(tupleVNodeArr), [// additional items
            vue.h(ArrayOrderList, {
              onArrayOperate: function onArrayOperate() {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                return emit.apply(void 0, ['arrayOperate'].concat(args));
              },
              vNodeList: additionalVNodeArr,
              tupleItemsLength: schema.items.length,
              addable: trueAddable,
              showIndexNumber: showIndexNumber,
              sortable: sortable,
              removable: removable,
              maxItems: schema.maxItems || schema.maxUniqueItems,
              minItems: schema.minItems || schema.minUniqueItems,
              globalOptions: globalOptions
            })]);
          }
        });
      };
    }
  };

  var ArrayFieldSpecialFormat = {
    name: 'ArrayFieldSpecialFormat',
    props: vueProps$1,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      var widgetConfig = vue.computed(function () {
        return formUtils.getWidgetConfig({
          schema: _objectSpread2({
            'ui:widget': props.globalOptions.WIDGET_MAP.formats[props.schema.format]
          }, props.schema),
          uiSchema: props.uiSchema,
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData
        });
      });
      return function () {
        return vue.h(Widget, _objectSpread2(_objectSpread2(_objectSpread2({}, attrs), props), widgetConfig.value));
      };
    }
  };

  var ArrayField = {
    name: 'ArrayField',
    props: vueProps$1,
    setup: function setup(props) {
      var _this = this;

      // 获取当前的值
      var getCurFormData = function getCurFormData() {
        var rootFormData = props.rootFormData,
            curNodePath = props.curNodePath;
        var value = vueUtils.getPathVal(rootFormData, curNodePath);
        if (Array.isArray(value)) return value;
        console.error('error: type array，值必须为 array 类型');
        return [];
      }; // 通过维护一份key，一份值 来解决list key的问题


      var formKeys = vue.ref(getCurFormData().map(function () {
        return utils.genId();
      })); // 当前 formData

      var curFormData = vue.computed(function () {
        return getCurFormData();
      });
      vue.watch(curFormData, function (newVal, oldVal) {
        // 引用类型，当值不相等，说明是被重新赋值
        // 这里应该对比原始值
        if (newVal !== oldVal && vue.toRaw(newVal) !== vue.toRaw(oldVal) && Array.isArray(newVal)) {
          formKeys.value = newVal.map(function () {
            return utils.genId();
          });
        }
      }, {
        deep: true
      }); // 处理了key的formData

      var itemsFormData = vue.computed(function () {
        return curFormData.value.map(function (item, index) {
          return {
            key: formKeys.value[index],
            value: item
          };
        });
      }); // 当前节点的ui配置

      var uiOptions = vue.computed(function () {
        return formUtils.getUserUiOptions({
          schema: props.schema,
          uiSchema: props.uiSchema,
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData
        });
      }); // 获取一个新item

      var getNewFormDataRow = function getNewFormDataRow() {
        var schema = props.schema,
            rootSchema = props.rootSchema;
        var itemSchema = schema.items; // https://json-schema.org/understanding-json-schema/reference/array.html#tuple-validation
        // 数组为项的集合搭配additionalItems属性需要特殊处理

        if (formUtils.isFixedItems(schema) && formUtils.allowAdditionalItems(schema)) {
          itemSchema = schema.additionalItems;
        }

        return getDefaultFormState__default['default'](itemSchema, undefined, rootSchema);
      };

      var handleArrayOperate = function handleArrayOperate(_ref) {
        var command = _ref.command,
            data = _ref.data;
        // 统一处理数组数据的 新增，删除，排序等变更
        var strategyMap = {
          moveUp: function moveUp(target, _ref2) {
            var index = _ref2.index;
            arrayMethods.moveUpAt(target, index);
          },
          moveDown: function moveDown(target, _ref3) {
            var index = _ref3.index;
            arrayMethods.moveDownAt(target, index);
          },
          remove: function remove(target, _ref4) {
            var index = _ref4.index;
            arrayMethods.removeAt(target, index);
          },
          add: function add(target, _ref5) {
            var newRowData = _ref5.newRowData;
            target.unshift(newRowData);
          },
          batchPush: function batchPush(target, _ref6) {
            var pushArray = _ref6.pushArray;
            pushArray.forEach(function (item) {
              target.unshift(item);
            });
          },
          setNewTarget: function setNewTarget(target, _ref7) {
            var formData = _ref7.formData,
                nodePath = _ref7.nodePath,
                newTarget = _ref7.newTarget;
            vueUtils.setPathVal(formData, nodePath, newTarget);
          }
        };
        var curStrategy = strategyMap[command];

        if (curStrategy) {
          var formDataPrams = data;
          var keysParams = data;

          if (command === 'add') {
            // 单个添加
            formDataPrams = {
              newRowData: getNewFormDataRow()
            };
            keysParams = {
              newRowData: utils.genId()
            };
          } else if (command === 'batchPush') {
            // 批量添加
            keysParams = {
              pushArray: formDataPrams.pushArray.map(function (item) {
                return utils.genId();
              })
            };
          } else if (command === 'setNewTarget') {
            // 设置
            formDataPrams = {
              formData: props.rootFormData,
              nodePath: props.curNodePath,
              newTarget: formDataPrams.newTarget
            };
            keysParams = {
              formData: formKeys,
              nodePath: 'value',
              newTarget: formDataPrams.newTarget.map(function (item) {
                return utils.genId();
              })
            };
          } // 同步修改 formData keys


          curStrategy.apply(null, [formKeys.value, keysParams]); // 修改formData数据

          curStrategy.apply(null, [curFormData.value, formDataPrams]); // onArrayOperate

          if (uiOptions.value.afterArrayOperate) {
            _this.uiOptions.afterArrayOperate.call(null, curFormData.value, command, data);
          }
        } else {
          throw new Error("\u9519\u8BEF - \u672A\u77E5\u7684\u64CD\u4F5C\uFF1A[".concat(command, "]"));
        }
      };

      return function () {
        var schema = props.schema,
            uiSchema = props.uiSchema,
            rootSchema = props.rootSchema,
            rootFormData = props.rootFormData,
            curNodePath = props.curNodePath,
            globalOptions = props.globalOptions;

        if (!schema.hasOwnProperty('items')) {
          throw new Error("[".concat(schema, "] \u8BF7\u5148\u5B9A\u4E49 items\u5C5E\u6027"));
        } // 多选类型


        if (formUtils.isMultiSelect(schema, rootSchema)) {
          // item 为枚举固定值
          return vue.h(ArrayFieldMultiSelect, _objectSpread2(_objectSpread2({}, props), {}, {
            class: _defineProperty({}, utils.lowerCase(ArrayFieldMultiSelect.name), true)
          }));
        } // 特殊处理 date datetime time url-upload
        // array 支持配置 ui:widget
        // 时间日期区间 或者 ui:widget 特殊配置


        if (schema.format || schema['ui:widget'] || uiSchema['ui:widget']) {
          return vue.h(ArrayFieldSpecialFormat, _objectSpread2(_objectSpread2({}, props), {}, {
            class: _defineProperty({}, utils.lowerCase(ArrayFieldSpecialFormat.name), true)
          }));
        } // https://json-schema.org/understanding-json-schema/reference/array.html#list-validation
        // https://json-schema.org/understanding-json-schema/reference/array.html#tuple-validation


        var CurrentField = formUtils.isFixedItems(schema) ? ArrayFieldTuple : ArrayFieldNormal;
        return vue.h('div', [vue.h(CurrentField, _objectSpread2(_objectSpread2({
          itemsFormData: itemsFormData.value
        }, props), {}, {
          onArrayOperate: handleArrayOperate,
          class: _defineProperty({}, utils.lowerCase(CurrentField.name), true)
        })), // 插入一个Widget，校验 array - maxItems. minItems. uniqueItems 等items外的属性校验
        props.needValidFieldGroup ? vue.h(Widget, {
          key: 'validateWidget-array',
          class: {
            validateWidget: true,
            'validateWidget-array': true
          },
          schema: Object.entries(schema).reduce(function (preVal, _ref8) {
            var _ref9 = _slicedToArray(_ref8, 2),
                key = _ref9[0],
                value = _ref9[1];

            if (key !== 'items') preVal[key] = value;
            return preVal;
          }, {}),
          uiSchema: uiSchema,
          errorSchema: props.errorSchema,
          curNodePath: curNodePath,
          rootFormData: rootFormData,
          globalOptions: globalOptions
        }) : null]);
      };
    }
  };

  var SelectLinkageField = {
    name: 'SelectLinkageField',
    props: _objectSpread2(_objectSpread2({}, vueProps$1), {}, {
      combiningType: {
        type: String,
        default: 'anyOf' // anyOf oneOf

      },
      selectList: {
        type: Array,
        require: true
      }
    }),
    setup: function setup(props) {
      var computedCurSelectIndexByFormData = function computedCurSelectIndexByFormData(formData) {
        var index = validate.getMatchingOption(formData, props.selectList, props.rootSchema, true);
        return index || 0;
      }; // 当前选中 option 项


      var curSelectIndex = vue.ref(computedCurSelectIndexByFormData(vueUtils.getPathVal(props.rootFormData, props.curNodePath))); // 下拉选项 VNode

      var getSelectBoxVNode = function getSelectBoxVNode() {
        var _class;

        // 下拉选项参数
        var selectWidgetConfig = formUtils.getWidgetConfig({
          schema: props.schema["".concat(props.combiningType, "Select")] || {},
          // 扩展 oneOfSelect,anyOfSelect字段
          uiSchema: props.uiSchema["".concat(props.combiningType, "Select")] || {},
          // 通过 uiSchema['oneOf'] 配置ui信息
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData
        }, function () {
          return {
            // 枚举参数
            widget: 'SelectWidget'
          };
        }); // title description 回退到 schema 配置，但这里不使用 uiSchema配置
        // select ui配置需要使用 (oneOf|anyOf)Select

        selectWidgetConfig.label = selectWidgetConfig.label || props.schema.title;
        selectWidgetConfig.description = selectWidgetConfig.description || props.schema.description; // 下拉列表枚举值

        if (!selectWidgetConfig.uiProps.enumOptions) {
          var uiSchemaSelectList = props.uiSchema[props.combiningType] || [];
          selectWidgetConfig.uiProps.enumOptions = props.selectList.map(function (option, index) {
            var curUiOptions = formUtils.getUiOptions({
              schema: option,
              uiSchema: uiSchemaSelectList[index],
              containsSpec: false // curNodePath: props.curNodePath,
              // rootFormData: props.rootFormData,

            });
            var str = '';

            if (props.combiningType === 'anyOf') {
              if (index === 0) {
                str = '自定义输入';
              } else {
                str = '固有选项';
              }
            } else if (props.combiningType === 'oneOf') {
              if (index === 0) {
                str = '日期';
              } else {
                str = '日期（时分秒）';
              }
            }

            return {
              label: curUiOptions.title || str,
              value: index
            };
          });
        } // oneOf option 渲染
        // 选择框 VNode


        return vue.h(Widget, _objectSpread2(_objectSpread2({
          key: "fieldSelect_".concat(props.combiningType),
          class: (_class = {}, _defineProperty(_class, "fieldSelect_".concat(props.combiningType), true), _defineProperty(_class, "Custom_Options", true), _class),
          isFormData: false,
          curValue: curSelectIndex.value,
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData,
          globalOptions: props.globalOptions
        }, selectWidgetConfig), {}, {
          onOtherDataChange: function onOtherDataChange(event) {
            curSelectIndex.value = event;
          }
        }));
      }; // 对象 切换了select
      // 如果object 类型 option有添加属性 这里做移除
      // 对新option计算默认值


      vue.watch(curSelectIndex, function (newVal, oldVal) {
        var curFormData = vueUtils.getPathVal(props.rootFormData, props.curNodePath); // 计算出 新选项默认值

        var newOptionData = getDefaultFormState__default['default'](props.selectList[newVal], undefined, props.rootSchema);
        var hasOwn = Object.prototype.hasOwnProperty; // 移除旧key

        if (utils.isObject(curFormData)) {
          var oldSelectSchema = retrieveSchema__default['default'](props.selectList[oldVal], props.rootSchema);

          if (utils.getSchemaType(oldSelectSchema) === 'object') {
            // 移除旧schema添加的属性
            // Object.keys(oldSelectSchema.properties)
            for (var key in oldSelectSchema.properties) {
              if (hasOwn.call(oldSelectSchema.properties, key) && !hasOwn.call(newOptionData, key)) {
                vueUtils.deletePathVal(curFormData, key);
              }
            }
          }
        } // 设置新值


        if (utils.isObject(newOptionData)) {
          Object.entries(newOptionData).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            if (value !== undefined && (curFormData[key] === undefined || utils.isObject(value) || function () {
              var _newSelectSchema$prop;

              var newSelectSchema = retrieveSchema__default['default'](props.selectList[newVal], props.rootSchema);
              return ((_newSelectSchema$prop = newSelectSchema.properties[key]) === null || _newSelectSchema$prop === void 0 ? void 0 : _newSelectSchema$prop.const) !== undefined;
            }())) {
              // 这里没找到一个比较合理的新旧值合并方式
              //
              // 1. 如果anyOf里面同名属性中的schema包含了 const 配置，产生了新的值这里做覆盖处理
              // 2. 其它场景保留同名key的旧的值
              vueUtils.setPathVal(curFormData, key, value);
            }
          });
        } else {
          vueUtils.setPathVal(props.rootFormData, props.curNodePath, newOptionData === undefined && validate.isValid(retrieveSchema__default['default'](props.selectList[newVal], props.rootSchema), curFormData) ? curFormData : newOptionData);
        }
      });
      return function () {
        var _class4;

        var curNodePath = props.curNodePath;
        var pathClassName = vueUtils.nodePath2ClassName(curNodePath); // is object

        var isTypeObject = props.schema.type === 'object' || props.schema.properties; // 选择附加的节点

        var childrenVNodeList = [getSelectBoxVNode()]; // 当前option内容

        var curSelectSchema = props.selectList[curSelectIndex.value]; // 当前选中节点合并schema

        if (curSelectSchema) {
          // 覆盖父级的属性
          var _props$schema = props.schema,
              _props$combiningType = props.combiningType,
              _ref3 = "".concat(props.combiningType, "Select");
              _props$schema.properties;
              _props$schema[_props$combiningType];
              _props$schema[_ref3];
              var parentSchema = _objectWithoutProperties(_props$schema, ["properties", _props$combiningType, _ref3].map(_toPropertyKey));

          curSelectSchema = Object.assign({}, parentSchema, curSelectSchema);
        } // object类型但没有附加属性


        var isObjectEmptyAttachProperties = isTypeObject && utils.isEmptyObject(curSelectSchema && curSelectSchema.properties);

        if (curSelectSchema && !isObjectEmptyAttachProperties) {
          // 当前节点的ui err配置，用来支持所有选项的统一配置
          // 取出 oneOf anyOf 同级配置，然后再合并到 当前选中的schema中
          var userUiOptions = utils.filterObject(formUtils.getUiOptions({
            schema: props.schema,
            uiSchema: props.uiSchema,
            containsSpec: false,
            curNodePath: curNodePath,
            rootFormData: props.rootFormData
          }), function (key) {
            return key === props.combiningType ? undefined : "ui:".concat(key);
          });
          var userErrOptions = utils.filterObject(formUtils.getUserErrOptions({
            schema: props.schema,
            uiSchema: props.uiSchema,
            errorSchema: props.errorSchema
          }), function (key) {
            return key === props.combiningType ? undefined : "err:".concat(key);
          });
          childrenVNodeList.unshift(vue.h(SchemaField, _objectSpread2(_objectSpread2({
            key: "appendSchema_".concat(props.combiningType)
          }, props), {}, {
            schema: _objectSpread2({
              'ui:showTitle': false,
              // 默认不显示title
              'ui:showDescription': false
            }, curSelectSchema),
            required: props.required,
            uiSchema: _objectSpread2(_objectSpread2({}, userUiOptions), (props.uiSchema[props.combiningType] || [])[curSelectIndex.value]),
            errorSchema: _objectSpread2(_objectSpread2({}, userErrOptions), (props.errorSchema[props.combiningType] || [])[curSelectIndex.value]) // needValidFieldGroup: false // 单独校验，这里无需处理

          })));
        } // object 需要保持原有属性，如果存在原有属性这里单独渲染


        var originVNode = null;

        if (isTypeObject && !utils.isEmptyObject(props.schema.properties)) {
          var _class2;

          var _curSelectSchema = curSelectSchema;
              _curSelectSchema.title;
              _curSelectSchema.description;
              _curSelectSchema.properties;
              var optionSchema = _objectWithoutProperties(_curSelectSchema, ["title", "description", "properties"]); // object 原始项渲染也需要合并anyOf的内容


          var origSchema = Object.assign({}, props.schema, optionSchema);
          delete origSchema[props.combiningType];
          originVNode = vue.h(SchemaField, _objectSpread2(_objectSpread2({
            key: "origin_".concat(props.combiningType),
            class: (_class2 = {}, _defineProperty(_class2, "".concat(props.combiningType, "_originBox"), true), _defineProperty(_class2, "".concat(pathClassName, "-originBox"), true), _class2)
          }, props), {}, {
            schema: origSchema // needValidFieldGroup: false // 单独校验，这里无需处理

          }));
        } // oneOf 校验 VNode


        childrenVNodeList.unshift(vue.h(Widget, {
          key: "validateWidget-".concat(props.combiningType),
          class: _defineProperty({
            validateWidget: true
          }, "validateWidget-".concat(props.combiningType), true),
          schema: props.schema,
          uiSchema: props.uiSchema,
          errorSchema: props.errorSchema,
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData,
          globalOptions: props.globalOptions
        }));
        return vue.h('div', [originVNode, vue.h('div', {
          key: "appendBox_".concat(props.combiningType),
          class: (_class4 = {
            appendCombining_box: true
          }, _defineProperty(_class4, "".concat(props.combiningType, "_appendBox"), true), _defineProperty(_class4, "".concat(pathClassName, "-appendBox"), true), _class4)
        }, childrenVNodeList)]);
      };
    }
  };

  var AnyOfField = {
    name: 'AnyOfField',
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs,
          slots = _ref.slots;
      return function () {
        return vue.h(SelectLinkageField, _objectSpread2(_objectSpread2({}, attrs), {}, {
          combiningType: 'anyOf',
          selectList: attrs.schema.anyOf
        }), slots);
      };
    }
  };

  var OneOfField = {
    name: 'oneOfField',
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs,
          slots = _ref.slots;
      return function () {
        return vue.h(SelectLinkageField, _objectSpread2(_objectSpread2({}, attrs), {}, {
          combiningType: 'oneOf',
          selectList: attrs.schema.oneOf
        }), slots);
      };
    }
  };

  /**
   * Created by Liu.Jun on 2020/4/20 9:55 下午.
   */

  var FIELDS_MAPS = {
    array: ArrayField,
    boolean: BooleanField,
    integer: IntegerField,
    number: NumberField,
    object: ObjectField,
    string: StringField,
    null: {
      render: function render() {
        return null;
      }
    },
    anyOf: AnyOfField,
    oneOf: OneOfField
  };

  var SchemaField = {
    name: 'SchemaField',
    props: vueProps$1,
    setup: function setup(props) {
      return function () {
        var _class3;

        // 目前不支持schema依赖和additionalProperties 展示不需要传递formData
        // const schema = retrieveSchema(props.schema, props.rootSchema, formData);
        var schema = retrieveSchema__default['default'](props.schema, props.rootSchema); // 当前参数

        var curProps = _objectSpread2(_objectSpread2({}, props), {}, {
          schema: schema
        }); // 空数据


        if (Object.keys(schema).length === 0) return null; // 获取节点Ui配置渲染field组件

        var _getUiField = formUtils.getUiField(FIELDS_MAPS, curProps),
            fieldComponent = _getUiField.field,
            fieldProps = _getUiField.fieldProps; // hidden


        var hiddenWidget = formUtils.isHiddenWidget({
          schema: schema,
          uiSchema: props.uiSchema,
          curNodePath: props.curNodePath,
          rootFormData: props.rootFormData
        });
        var pathClassName = vueUtils.nodePath2ClassName(props.curNodePath);

        if (schema.anyOf && schema.anyOf.length > 0 && !formUtils.isSelect(schema)) {
          var _class;

          // anyOf
          return vue.h(vueUtils.resolveComponent(FIELDS_MAPS.anyOf), _objectSpread2({
            class: (_class = {}, _defineProperty(_class, "".concat(pathClassName, "-anyOf"), true), _defineProperty(_class, "fieldItem", true), _defineProperty(_class, "anyOfField", true), _class)
          }, curProps));
        }

        if (schema.oneOf && schema.oneOf.length > 0 && !formUtils.isSelect(schema)) {
          var _class2;

          // oneOf
          return vue.h(vueUtils.resolveComponent(FIELDS_MAPS.oneOf), _objectSpread2({
            class: (_class2 = {}, _defineProperty(_class2, "".concat(pathClassName, "-oneOf"), true), _defineProperty(_class2, "fieldItem", true), _defineProperty(_class2, "oneOfField", true), _class2)
          }, curProps));
        }

        return fieldComponent && !hiddenWidget ? vue.h(vueUtils.resolveComponent(fieldComponent), _objectSpread2(_objectSpread2({}, curProps), {}, {
          fieldProps: fieldProps,
          class: (_class3 = {}, _defineProperty(_class3, utils.lowerCase(fieldComponent.name) || fieldComponent, true), _defineProperty(_class3, "hiddenWidget", hiddenWidget), _defineProperty(_class3, "fieldItem", true), _defineProperty(_class3, pathClassName, true), _class3)
        })) : null;
      };
    }
  };

  function createForm() {
    var globalOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var Form = {
      name: 'VueForm',
      props: vueProps,
      emits: ['update:modelValue', 'change', 'cancel', 'submit', 'validation-failed', 'form-mounted'],
      setup: function setup(props, _ref) {
        var slots = _ref.slots,
            emit = _ref.emit;
        // global components
        var internalInstance = vue.getCurrentInstance();

        if (!Form.installed && globalOptions.WIDGET_MAP.widgetComponents) {
          Object.entries(globalOptions.WIDGET_MAP.widgetComponents).forEach(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
                componentName = _ref3[0],
                component = _ref3[1];

            return internalInstance.appContext.app.component(componentName, component);
          }); // 只注册一次

          Form.installed = true;
        } // 使用provide 传递跨组件数据


        var fallbackLabel = vue.toRef(props, 'fallbackLabel');
        vue.provide('genFormProvide', {
          fallbackLabel: fallbackLabel
        }); // rootFormData

        var rootFormData = vue.ref(getDefaultFormState__default['default'](props.schema, props.modelValue, props.schema, props.strictMode));
        var footerParams = vue.computed(function () {
          return _objectSpread2({
            show: true,
            okBtn: '保存',
            okBtnProps: {},
            cancelBtn: '取消'
          }, props.formFooter);
        }); // form组件实例，不需要响应式

        var formRef = null; // 更新formData

        var emitFormDataChange = function emitFormDataChange(newValue, oldValue) {
          // 支持v-model ，引用类型
          emit('update:modelValue', newValue); // change 事件，引用类型修改属性 newValue

          emit('change', {
            newValue: newValue,
            oldValue: oldValue
          });
        }; // 更新props


        var willReceiveProps = function willReceiveProps(newVal, oldVal) {
          if (!utils.deepEquals(newVal, oldVal)) {
            var tempVal = getDefaultFormState__default['default'](props.schema, props.modelValue, props.schema, props.strictMode);

            if (!utils.deepEquals(rootFormData.value, tempVal)) {
              rootFormData.value = tempVal;
            }
          }
        }; // emit v-model，同步值


        vue.watch(rootFormData, function (newValue, oldValue) {
          emitFormDataChange(newValue, oldValue);
        }, {
          deep: true
        }); // schema 被重新赋值

        vue.watch(function () {
          return props.schema;
        }, function (newVal, oldVal) {
          willReceiveProps(newVal, oldVal);
        }); // model value 变更

        vue.watch(function () {
          return props.modelValue;
        }, function (newVal, oldVal) {
          willReceiveProps(newVal, oldVal);
        }); // 保持v-model双向数据及时性

        emitFormDataChange(rootFormData.value, props.modelValue);

        var getDefaultSlot = function getDefaultSlot() {
          if (slots.default) {
            return slots.default({
              formData: rootFormData,
              formRefFn: function formRefFn() {
                return formRef;
              }
            });
          }

          if (footerParams.value.show) {
            return vue.h(FormFooter, {
              globalOptions: globalOptions,
              okBtn: footerParams.value.okBtn,
              okBtnProps: footerParams.value.okBtnProps,
              cancelBtn: footerParams.value.cancelBtn,
              formItemAttrs: footerParams.value.formItemAttrs,
              onCancel: function onCancel() {
                emit('cancel');
              },
              onSubmit: function onSubmit() {
                // 优先获取组件 $$validate 方法，方便对 validate方法转换
                (formRef.$$validate || formRef.validate)(function (isValid, resData) {
                  if (isValid) {
                    return emit('submit', rootFormData);
                  }

                  console.warn(resData);
                  return emit('validation-failed', resData);
                });
              }
            });
          }

          return [];
        };

        return function () {
          var _class;

          var _props$formProps = props.formProps,
              _props$formProps$layo = _props$formProps.layoutColumn,
              layoutColumn = _props$formProps$layo === void 0 ? 1 : _props$formProps$layo,
              inlineFooter = _props$formProps.inlineFooter;
              _props$formProps.labelSuffix;
              _props$formProps.isMiniDes;
              _props$formProps.defaultSelectFirstOption;
              _props$formProps.popover;
              var uiFormProps = _objectWithoutProperties(_props$formProps, ["layoutColumn", "inlineFooter", "labelSuffix", "isMiniDes", "defaultSelectFirstOption", "popover"]);

          var _uiFormProps$inline = uiFormProps.inline,
              inline = _uiFormProps$inline === void 0 ? false : _uiFormProps$inline,
              _uiFormProps$labelPos = uiFormProps.labelPosition,
              labelPosition = _uiFormProps$labelPos === void 0 ? 'top' : _uiFormProps$labelPos;
          var schemaProps = {
            schema: props.schema,
            uiSchema: props.uiSchema,
            errorSchema: props.errorSchema,
            customFormats: props.customFormats,
            customRule: props.customRule,
            rootSchema: props.schema,
            rootFormData: rootFormData.value,
            // 根节点的数据
            curNodePath: '',
            // 当前节点路径
            globalOptions: globalOptions,
            // 全局配置，差异化ui框架
            formProps: _objectSpread2({
              labelPosition: labelPosition,
              labelSuffix: '：',
              defaultSelectFirstOption: true,
              inline: inline
            }, props.formProps)
          };
          return vue.h(vueUtils.resolveComponent(globalOptions.COMPONENT_MAP.form), _objectSpread2({
            class: (_class = {
              genFromComponent: true,
              formInlineFooter: inlineFooter,
              formInline: inline
            }, _defineProperty(_class, "genFromComponent_".concat(props.schema.id, "Form"), !!props.schema.id), _defineProperty(_class, "layoutColumn", !inline), _defineProperty(_class, "layoutColumn-".concat(layoutColumn), !inline), _class),
            setFormRef: function setFormRef(form) {
              formRef = form;
              internalInstance.ctx.$$uiFormRef = formRef;
              emit('form-mounted', form, {
                formData: rootFormData.value
              });
            },
            // 阻止form默认submit
            onSubmit: function onSubmit(e) {
              e.preventDefault();
            },
            model: rootFormData,
            labelPosition: labelPosition,
            inline: inline
          }, uiFormProps), {
            default: function _default() {
              return [vue.h(SchemaField, schemaProps), getDefaultSlot()];
            }
          });
        };
      }
    };

    Form.install = function (vueApp) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      vueApp.component(options.name || Form.name, Form);
    };

    return Form;
  }

  // https://github.com/epoberezkin/ajv-i18n
  function localizeZh(errors) {
    if (!(errors && errors.length)) return;

    for (var i = 0; i < errors.length; i += 1) {
      var e = errors[i];
      var out = void 0;
      var n = void 0;
      var cond = void 0;

      switch (e.keyword) {
        case '$ref':
          out = "\u65E0\u6CD5\u627E\u5230\u5F15\u7528".concat(e.params.ref);
          break;

        case 'additionalItems':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5141\u8BB8\u8D85\u8FC7".concat(n, "\u4E2A\u5143\u7D20");
          break;

        case 'additionalProperties':
          out = '不允许有额外的属性';
          break;

        case 'anyOf':
          out = '数据应为 anyOf 所指定的其中一个';
          break;

        case 'const':
          out = '应当等于常量';
          break;

        case 'contains':
          out = '应当包含一个有效项';
          break;

        case 'custom':
          out = "\u5E94\u5F53\u901A\u8FC7 \"".concat(e.keyword, " \u5173\u952E\u8BCD\u6821\u9A8C\"");
          break;

        case 'dependencies':
          out = '';
          n = e.params.depsCount;
          out += "\u5E94\u5F53\u62E5\u6709\u5C5E\u6027".concat(e.params.property, "\u7684\u4F9D\u8D56\u5C5E\u6027").concat(e.params.deps);
          break;

        case 'enum':
          out = '应当是预设定的枚举值之一';
          break;

        case 'exclusiveMaximum':
          out = '';
          cond = "".concat(e.params.comparison, " ").concat(e.params.limit);
          out += "\u5E94\u5F53\u4E3A ".concat(cond);
          break;

        case 'exclusiveMinimum':
          out = '';
          cond = "".concat(e.params.comparison, " ").concat(e.params.limit);
          out += "\u5E94\u5F53\u4E3A ".concat(cond);
          break;

        case 'false schema':
          out = '布尔模式出错';
          break;

        case 'format':
          out = "\u5E94\u5F53\u5339\u914D\u683C\u5F0F \"".concat(e.params.format, "\"");
          break;

        case 'formatExclusiveMaximum':
          out = 'formatExclusiveMaximum 应当是布尔值';
          break;

        case 'formatExclusiveMinimum':
          out = 'formatExclusiveMinimum 应当是布尔值';
          break;

        case 'formatMaximum':
          out = '';
          cond = "".concat(e.params.comparison, " ").concat(e.params.limit);
          out += "\u5E94\u5F53\u662F ".concat(cond);
          break;

        case 'formatMinimum':
          out = '';
          cond = "".concat(e.params.comparison, " ").concat(e.params.limit);
          out += "\u5E94\u5F53\u662F ".concat(cond);
          break;

        case 'if':
          out = "\u5E94\u5F53\u5339\u914D\u6A21\u5F0F \"".concat(e.params.failingKeyword, "\" ");
          break;

        case 'maximum':
          out = '';
          cond = "".concat(e.params.comparison, " ").concat(e.params.limit);
          out += "\u5E94\u5F53\u4E3A ".concat(cond);
          break;

        case 'maxItems':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5E94\u591A\u4E8E ".concat(n, " \u4E2A\u9879");
          break;

        case 'maxLength':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5E94\u591A\u4E8E ".concat(n, " \u4E2A\u5B57\u7B26");
          break;

        case 'maxProperties':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5E94\u6709\u591A\u4E8E ".concat(n, " \u4E2A\u5C5E\u6027");
          break;

        case 'minimum':
          out = '';
          cond = "".concat(e.params.comparison, " ").concat(e.params.limit);
          out += "\u5E94\u5F53\u4E3A ".concat(cond);
          break;

        case 'minItems':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5E94\u5C11\u4E8E ".concat(n, " \u4E2A\u9879");
          break;

        case 'minLength':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5E94\u5C11\u4E8E ".concat(n, " \u4E2A\u5B57\u7B26");
          break;

        case 'minProperties':
          out = '';
          n = e.params.limit;
          out += "\u4E0D\u5E94\u6709\u5C11\u4E8E ".concat(n, " \u4E2A\u5C5E\u6027");
          break;

        case 'multipleOf':
          out = "\u5E94\u5F53\u662F ".concat(e.params.multipleOf, " \u7684\u6574\u6570\u500D");
          break;

        case 'not':
          out = '不应当匹配 "not" schema';
          break;

        case 'oneOf':
          out = '只能匹配一个 "oneOf" 中的 schema';
          break;

        case 'pattern':
          out = "\u5E94\u5F53\u5339\u914D\u6A21\u5F0F \"".concat(e.params.pattern, "\"");
          break;

        case 'patternRequired':
          out = "\u5E94\u5F53\u6709\u5C5E\u6027\u5339\u914D\u6A21\u5F0F ".concat(e.params.missingPattern);
          break;

        case 'propertyNames':
          out = "\u5C5E\u6027\u540D '".concat(e.params.propertyName, "' \u65E0\u6548");
          break;

        case 'required':
          out = "\u5E94\u5F53\u6709\u5FC5\u9700\u5C5E\u6027 ".concat(e.params.propertyNames); // out = `应当有必需属性 ${e.params.missingProperty}`;

          break;

        case 'switch':
          out = "\u7531\u4E8E ".concat(e.params.caseIndex, " \u5931\u8D25\uFF0C\u672A\u901A\u8FC7 \"switch\" \u6821\u9A8C, ");
          break;

        case 'type':
          out = "\u5E94\u5F53\u662F ".concat(e.params.type, " \u7C7B\u578B");
          break;

        case 'uniqueItems':
          out = "\u4E0D\u5E94\u5F53\u542B\u6709\u91CD\u590D\u9879 (\u7B2C ".concat(e.params.j, " \u9879\u4E0E\u7B2C ").concat(e.params.i, " \u9879\u662F\u91CD\u590D\u7684)");
          break;

        default:
          // eslint-disable-next-line no-continue
          continue;
      }

      e.message = out;
    }
  }

  /**
   * Created by Liu.Jun on 2020/4/30 11:22.
   */
  var index = {
    $$currentLocalizeFn: localizeZh,
    getCurrentLocalize: function getCurrentLocalize() {
      return this.$$currentLocalizeFn;
    },
    useLocal: function useLocal(fn) {
      this.$$currentLocalizeFn = fn;
    }
  };

  var numberTimeComponent = function numberTimeComponent(component) {
    return vue.defineComponent({
      inheritAttrs: false,
      setup: function setup(props, _ref) {
        var attrs = _ref.attrs,
            slots = _ref.slots;
        return function () {
          var isNumberValue = attrs.isNumberValue,
              isRange = attrs.isRange,
              value = attrs.value,
              otherAttrs = _objectWithoutProperties(attrs, ["isNumberValue", "isRange", "value"]); // antdv moment format 必须接受字符串时间戳


          var newValue = isNumberValue ? isRange ? (value || []).map(function (item) {
            return typeof item === 'number' ? String(item) : item;
          }) : typeof value === 'number' ? String(value) : value : value;

          var trueAttrs = _objectSpread2(_objectSpread2({}, attrs), {}, {
            value: newValue,
            'onUpdate:value': function updateValue(upValue) {
              if (isNumberValue) {
                upValue = isRange ? upValue.map(function (item) {
                  return +item;
                }) : +upValue;
              }

              otherAttrs['onUpdate:value'].call(this, upValue);
            }
          });

          return vue.h(vueUtils.resolveComponent(component), trueAttrs, slots);
        };
      }
    });
  };

  /**
   * Created by Liu.Jun on 2021/2/23 10:21 下午.
   */
  var baseComponent = {
    name: 'CheckboxesWidget',
    props: {
      enumOptions: {
        default: function _default() {
          return [];
        },
        type: [Array]
      }
    },
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        return vue.h(vueUtils.resolveComponent('a-checkbox-group'), attrs, {
          default: function _default() {
            return props.enumOptions.map(function (item, index) {
              return vue.h(vueUtils.resolveComponent('a-checkbox'), {
                key: index,
                value: item.value
              }, {
                default: function _default() {
                  return item.label;
                }
              });
            });
          }
        });
      };
    }
  };
  var moduleValeComponent = vueUtils.modelValueComponent(baseComponent, {
    model: 'value'
  });

  /**
   * Created by Liu.Jun on 2021/2/23 10:21 下午.
   */
  var baseComponent$1 = {
    name: 'RadioWidget',
    props: {
      enumOptions: {
        default: function _default() {
          return [];
        },
        type: [Array]
      }
    },
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        return vue.h(vueUtils.resolveComponent('a-radio-group'), attrs, {
          default: function _default() {
            return props.enumOptions.map(function (item, index) {
              return vue.h(vueUtils.resolveComponent('a-radio'), {
                key: index,
                value: item.value
              }, {
                default: function _default() {
                  return item.label;
                }
              });
            });
          }
        });
      };
    }
  };
  var moduleValeComponent$1 = vueUtils.modelValueComponent(baseComponent$1, {
    model: 'value'
  });

  var baseComponent$2 = {
    name: 'SelectWidget',
    props: {
      enumOptions: {
        default: function _default() {
          return [];
        },
        type: [Array]
      }
    },
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      var type = true;

      var fn = function fn(arr) {
        return !(['自定义输入', '日期'].includes(arr[0].label) && arr[0].value === 0 && ['固有选项', '日期（时分秒）'].includes(arr[1].label) && arr[1].value === 1);
      };

      props.enumOptions.length > 0 && (type = fn(props.enumOptions));
      return function () {
        return vue.h(vueUtils.resolveComponent('a-select'), _objectSpread2(_objectSpread2(_objectSpread2({}, attrs.multiple ? {
          mode: 'multiple'
        } : {}), attrs), {}, {
          showSearch: type,
          // filterOption: type,
          filterOption: filterOption,
          allowClear: type
        }), {
          default: function _default() {
            return props.enumOptions.map(function (item, index) {
              return vue.h(vueUtils.resolveComponent('a-select-option'), {
                key: item.label,
                value: item.value
              }, {
                default: function _default() {
                  return item.label;
                }
              });
            });
          }
        });
      };
    }
  }; // 筛选函数

  function filterOption(input, option) {
    return option.key.indexOf(input) >= 0;
  }

  var moduleValeComponent$2 = vueUtils.modelValueComponent(baseComponent$2, {
    model: 'value'
  });

  var baseComponent$3 = {
    name: 'DatePickerWidget',
    inheritAttrs: false,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        var isNumberValue = attrs.isNumberValue,
            isRange = attrs.isRange,
            otherAttrs = _objectWithoutProperties(attrs, ["isNumberValue", "isRange"]);

        return vue.h(vueUtils.resolveComponent(isRange ? 'a-range-picker' : 'a-date-picker'), _objectSpread2({
          valueFormat: isNumberValue ? 'x' : 'YYYY-MM-DD'
        }, otherAttrs));
      };
    }
  };
  var timeNumberComponent = numberTimeComponent(baseComponent$3);
  var moduleValeComponent$3 = vueUtils.modelValueComponent(timeNumberComponent, {
    model: 'value'
  });

  var baseComponent$4 = {
    name: 'DatePickerWidget',
    inheritAttrs: false,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        var isNumberValue = attrs.isNumberValue,
            isRange = attrs.isRange,
            otherAttrs = _objectWithoutProperties(attrs, ["isNumberValue", "isRange"]);

        return vue.h(vueUtils.resolveComponent(isRange ? 'a-range-picker' : 'a-date-picker'), _objectSpread2({
          valueFormat: isNumberValue ? 'x' : 'YYYY-MM-DDTHH:mm:ssZ',
          showTime: true
        }, otherAttrs));
      };
    }
  };
  var timeNumberComponent$1 = numberTimeComponent(baseComponent$4);
  var moduleValeComponent$4 = vueUtils.modelValueComponent(timeNumberComponent$1, {
    model: 'value'
  });

  var baseComponent$5 = {
    name: 'TimePickerWidget',
    inheritAttrs: false,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs;
      return function () {
        return vue.h(vueUtils.resolveComponent('a-time-picker'), _objectSpread2({
          'value-format': 'HH:mm:ss'
        }, attrs));
      };
    }
  };
  var moduleValeComponent$5 = vueUtils.modelValueComponent(baseComponent$5, {
    model: 'value'
  });

  // https://run.mocky.io/v3/518d7af7-204f-45ab-9628-a6e121dab8ca

  var UploadWidget = {
    name: 'UploadWidget',
    props: {
      modelValue: {
        default: null,
        type: [String, Array]
      },
      responseFileUrl: {
        default: function _default() {
          return function (res) {
            return res ? res.url || res.data && res.data.url : '';
          };
        },
        type: [Function]
      },
      btnText: {
        type: String,
        default: '点击上传'
      },
      // 传入 VNode
      slots: {
        type: null,
        default: null
      }
    },
    inheritAttrs: false,
    setup: function setup(props, _ref) {
      var attrs = _ref.attrs,
          emit = _ref.emit;
      // 设置默认 fileList
      var curModelValue = props.modelValue;
      var isArrayValue = Array.isArray(curModelValue);

      var defaultFileList = attrs.fileList || function () {
        if (isArrayValue) {
          return curModelValue.map(function (item, index) {
            return {
              uid: String(index),
              status: 'done',
              name: "\u5DF2\u4E0A\u4F20\u6587\u4EF6\uFF08".concat(index + 1, "\uFF09"),
              url: item
            };
          });
        }

        if (curModelValue) {
          return [{
            uid: '1',
            status: 'done',
            name: '已上传文件',
            url: curModelValue
          }];
        }

        return [];
      }(); // fileList


      var fileListRef = vue.ref(defaultFileList);

      var getUrl = function getUrl(fileItem) {
        return fileItem && (fileItem.response && props.responseFileUrl(fileItem.response) || fileItem.url) || '';
      };

      var emitValue = function emitValue(emitFileList) {
        // v-model
        var curValue;

        if (isArrayValue) {
          curValue = emitFileList.length ? emitFileList.reduce(function (pre, item) {
            var url = getUrl(item);

            if (url) {
              item.url = url;
              pre.push(url);
            }

            return pre;
          }, []) : [];
        } else {
          var fileItem = emitFileList[emitFileList.length - 1];
          curValue = getUrl(fileItem);

          if (fileItem && curValue) {
            fileItem.url = curValue;
            fileListRef.value = [fileItem];
          } else {
            fileListRef.value = [];
          }
        }

        emit('update:modelValue', curValue);
      };

      return function () {
        return vue.h(vueUtils.resolveComponent('a-upload'), _objectSpread2(_objectSpread2({}, attrs), {}, {
          fileList: fileListRef.value,
          'onUpdate:fileList': function updateFileList(val) {
            fileListRef.value = val;
          },
          onChange: function onChange(changeData) {
            if (changeData.file.status !== 'uploading') {
              emitValue(changeData.fileList);
            }

            if (attrs.onChange) {
              attrs.onChange.call(this, changeData);
            }
          }
        }), _objectSpread2({
          default: function _default() {
            return vue.h(vueUtils.resolveComponent('a-button'), {
              type: 'primary'
            }, {
              default: function _default() {
                return props.btnText;
              }
            });
          }
        }, props.slots || {}));
      };
    }
  };

  var widgetComponents = {
    CheckboxesWidget: moduleValeComponent,
    RadioWidget: moduleValeComponent$1,
    SelectWidget: moduleValeComponent$2,
    TimePickerWidget: moduleValeComponent$5,
    DatePickerWidget: moduleValeComponent$3,
    DateTimePickerWidget: moduleValeComponent$4,
    UploadWidget: UploadWidget,
    InputWidget: vueUtils.modelValueComponent('a-input'),
    ColorWidget: {
      setup: function setup(props, _ref) {
        var attrs = _ref.attrs;
        return function () {
          return vue.h(widgetComponents.InputWidget, _objectSpread2(_objectSpread2({}, attrs), {}, {
            style: _objectSpread2(_objectSpread2({}, attrs.style || {}), {}, {
              maxWidth: '180px'
            })
          }), {
            addonAfter: function addonAfter() {
              return vue.h('input', {
                disabled: attrs.disabled,
                readonly: attrs.readonly,
                value: attrs.modelValue,
                onInput: function onInput(e) {
                  attrs['onUpdate:modelValue'](e.target.value);
                },
                onChange: function onChange(e) {
                  attrs['onUpdate:modelValue'](e.target.value);
                },
                type: 'color',
                style: {
                  padding: '0',
                  width: '50px'
                }
              });
            }
          });
        };
      }
    },
    TextAreaWidget: vueUtils.modelValueComponent('a-textarea'),
    InputNumberWidget: vueUtils.modelValueComponent('a-input-number'),
    AutoCompleteWidget: vueUtils.modelValueComponent('a-auto-complete'),
    SliderWidget: vueUtils.modelValueComponent('a-slider'),
    RateWidget: vueUtils.modelValueComponent('a-rate'),
    SwitchWidget: vueUtils.modelValueComponent('a-switch', {
      model: 'checked'
    })
  };

  /**
   * Created by Liu.Jun on 2020/4/21 18:23.
   */
  var InputWidget = widgetComponents.InputWidget,
      InputNumberWidget = widgetComponents.InputNumberWidget,
      SwitchWidget = widgetComponents.SwitchWidget,
      CheckboxesWidget = widgetComponents.CheckboxesWidget,
      RadioWidget = widgetComponents.RadioWidget,
      SelectWidget = widgetComponents.SelectWidget,
      TimePickerWidget = widgetComponents.TimePickerWidget,
      DatePickerWidget = widgetComponents.DatePickerWidget,
      DateTimePickerWidget = widgetComponents.DateTimePickerWidget,
      ColorWidget = widgetComponents.ColorWidget;
  var WIDGET_MAP = {
    types: {
      boolean: SwitchWidget,
      string: InputWidget,
      number: InputNumberWidget,
      integer: InputNumberWidget
    },
    formats: {
      color: ColorWidget,
      time: TimePickerWidget,
      // 20:20:39+00:00
      date: DatePickerWidget,
      // 2018-11-13
      'date-time': DateTimePickerWidget // 2018-11-13T20:20:39+00:00

    },
    common: {
      select: SelectWidget,
      radioGroup: RadioWidget,
      checkboxGroup: CheckboxesWidget
    },
    widgetComponents: widgetComponents
  };

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".genFromComponent.ant-form-vertical .ant-form-item-label{line-height:26px;padding-bottom:6px;font-size:14px}.genFromComponent .ant-form-item{margin-bottom:22px}.genFromComponent .ant-form-item.ant-form-item-with-help{margin-bottom:2px}.genFromComponent .ant-form-explain{padding-top:2px;display:-webkit-box!important;text-overflow:ellipsis;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;white-space:normal;text-align:left;line-height:1.2;font-size:12px}.genFromComponent .validateWidget .ant-form-explain{padding:5px 0;position:relative}.genFromComponent .ant-form-item-label>label.ant-form-item-no-colon:after{display:none}.genFromComponent .validateWidget>.ant-form-item{margin-bottom:0!important;padding:0!important}.genFromComponent .validateWidget>.ant-form-item .formItemErrorBox{padding:5px 0;position:relative}";
  styleInject(css_248z);

  var globalOptions = {
    WIDGET_MAP: WIDGET_MAP,
    COMPONENT_MAP: {
      form: vue.defineComponent({
        inheritAttrs: false,
        setup: function setup(props, _ref) {
          var attrs = _ref.attrs,
              slots = _ref.slots;
          // 处理 labelPosition 参数和layout之间转换
          var labelPositionMap = {
            top: {
              layout: 'vertical'
            },
            left: {
              layout: 'horizontal',
              labelAlign: 'left'
            },
            right: {
              layout: 'horizontal',
              labelAlign: 'right'
            }
          }; // 返回当前的 form ref

          var formRef = vue.ref(null);

          if (attrs.setFormRef) {
            vue.onMounted(function () {
              // form组件实例上附加一个 validate 方法
              formRef.value.$$validate = function (callBack) {
                formRef.value.validate().then(function (res) {
                  callBack(true, res);
                }).catch(function (err) {
                  callBack(false, err.errorFields);
                });
              };

              attrs.setFormRef(formRef.value);
            });
          }

          return function () {
            attrs.setFormRef;
                var labelPosition = attrs.labelPosition;
                attrs.labelWidth;
                var model = attrs.model,
                otherAttrs = _objectWithoutProperties(attrs, ["setFormRef", "labelPosition", "labelWidth", "model"]);

            if (otherAttrs.inline) {
              Object.assign(otherAttrs, {
                layout: 'inline' // labelCol: undefined,
                // wrapperCol: undefined

              });
            }

            return vue.h(vueUtils.resolveComponent('a-form'), _objectSpread2(_objectSpread2(_objectSpread2({
              ref: formRef,
              model: model.value
            }, labelPositionMap[labelPosition || 'top']), otherAttrs), {}, {
              colon: false
            }), slots);
          };
        }
      }),
      formItem: vue.defineComponent({
        inheritAttrs: false,
        setup: function setup(props, _ref2) {
          var attrs = _ref2.attrs,
              slots = _ref2.slots;
          var formItemRef = vue.ref(null); // if (!attrs._title) {
          //     return null;
          // }

          return function () {
            var prop = attrs.prop,
                rules = attrs.rules,
                description = attrs.description,
                originAttrs = _objectWithoutProperties(attrs, ["prop", "rules", "description"]);

            return vue.h(vueUtils.resolveComponent('a-form-item'), _objectSpread2(_objectSpread2({}, originAttrs), {}, {
              ref: formItemRef,
              tooltip: description ? description : '',
              // 去掉callback 使用promise 模式
              rules: (rules || []).map(function (validateRule) {
                return _objectSpread2(_objectSpread2({}, validateRule), {}, {
                  validator: function validator(rule, value) {
                    return validateRule.validator.apply(this, [rule, value]);
                  }
                });
              }),
              name: prop ? prop.split('.') : prop
            }), _objectSpread2(_objectSpread2({}, slots), {}, {
              default: function proxySlotDefault() {
                // 解决 a-form-item 只对第一个子元素进行劫持，并监听 blur 和 change 事件，如果存在第一个元素description无法校验
                // @blur="() => {$refs.name.onFieldBlur()}"
                // @change="() => {$refs.name.onFieldChange()}"
                return slots.default.call(this, {
                  onBlur: function onBlur() {
                    if (formItemRef.value.$el.querySelector('.genFromWidget_des')) {
                      // 存在 description，需要手动触发校验事件
                      formItemRef.value.onFieldBlur();
                    }
                  },
                  onChange: function onChange() {
                    if (formItemRef.value.$el.querySelector('.genFromWidget_des')) {
                      // 存在 description，需要手动触发校验事件
                      formItemRef.value.onFieldChange();
                    }
                  }
                });
              }
            }));
          };
        }
      }),
      button: 'a-button',
      popover: vue.defineComponent({
        setup: function setup(props, _ref3) {
          var attrs = _ref3.attrs,
              slots = _ref3.slots;
          return function () {
            return vue.h(vueUtils.resolveComponent('a-popover'), attrs, {
              default: slots.reference,
              content: slots.default
            });
          };
        }
      })
    },
    HELPERS: {
      // 是否mini显示 description
      isMiniDes: function isMiniDes(formProps) {
        return formProps && (['left', 'right'].includes(formProps.labelPosition) || formProps.layout === 'horizontal' || formProps.inline === true);
      }
    }
  };
  var JsonSchemaForm = createForm(globalOptions);
  var JsonSchemaFormAntdV4 = createForm(_objectSpread2(_objectSpread2({}, globalOptions), {}, {
    COMPONENT_MAP: _objectSpread2(_objectSpread2({}, globalOptions.COMPONENT_MAP), {}, {
      formItem: vue.defineComponent({
        inheritAttrs: false,
        setup: function setup(props, _ref4) {
          var attrs = _ref4.attrs,
              slots = _ref4.slots;
          return function () {
            var style = attrs.style,
                className = attrs.class,
                originAttrs = _objectWithoutProperties(attrs, ["style", "class"]);

            return vue.h('div', {
              style: style,
              class: className
            }, [vue.h(globalOptions.COMPONENT_MAP.formItem, originAttrs, slots)]);
          };
        }
      })
    })
  }));

  Object.defineProperty(exports, 'modelValueComponent', {
    enumerable: true,
    get: function () {
      return vueUtils.modelValueComponent;
    }
  });
  exports.vueUtils = vueUtils__namespace;
  Object.defineProperty(exports, 'getDefaultFormState', {
    enumerable: true,
    get: function () {
      return getDefaultFormState__default['default'];
    }
  });
  exports.formUtils = formUtils__namespace;
  exports.schemaValidate = validate__namespace;
  exports.JsonSchemaFormAntdV4 = JsonSchemaFormAntdV4;
  exports.SchemaField = SchemaField;
  exports.default = JsonSchemaForm;
  exports.fieldProps = vueProps$1;
  exports.globalOptions = globalOptions;
  exports.i18n = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
