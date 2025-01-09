<template>
  <div class="package-info">
    <a-card title="包装信息">
      <a-form
        :model="form"
        :rules="rules"
        ref="form"
        :label-col="{ style: { width: '180px' } }"
      >
        <a-form-item
          label="包装后重量："
          name="grossWeight"
        >
          <a-input-number
            v-model:value="form.grossWeight"
            :min="0"
            :max="70"
            :controls="false"
          ></a-input-number>
          <span> (kg/件/个)</span>
        </a-form-item>
        <div class="one-row">
          <a-form-item
            label="自定义计重："
            name="isPackSell"
          >
            <a-checkbox v-model:checked="form.isPackSell"></a-checkbox>
          </a-form-item>
          <template v-if="form.isPackSell">
            <span class="one-row-text">买家购买</span>
            <a-form-item
              name="baseUnit"
              :label-col="{ style: { width: 0 } }"
            >
              <a-input-number
                v-model:value="form.baseUnit"
                :min="1"
                :max="9999"
                :controls="false"
              ></a-input-number>
            </a-form-item>
            <span class="one-row-text">件/个以内，不增加运费;</span>
            <span class="one-row-text">每多购买</span>
            <a-form-item
              name="addUnit"
              :label-col="{ style: { width: 0 } }"
            >
              <a-input-number
                v-model:value="form.addUnit"
                :min="1"
                :max="1000"
                :controls="false"
              ></a-input-number>
            </a-form-item>
            <span class="one-row-text">件/个，增加</span>
            <a-form-item
              name="addWeight"
              :label-col="{ style: { width: 0 } }"
            >
              <a-input-number
                v-model:value="form.addWeight"
                :min="0"
                :max="70"
                :controls="false"
              ></a-input-number>
            </a-form-item>
            <span class="one-row-text">kg</span>
          </template>
        </div>
        <a-form-item
          label="包装后尺寸："
          class="manual-asterisk"
        >
          <div class="one-row">
            <a-form-item
              name="packageLength"
              :label-col="{ style: { width: 0 } }"
            >
              <a-input-number
                v-model:value="form.packageLength"
                :min="1"
                :max="700"
                :precision="0"
                :controls="false"
              ></a-input-number>
            </a-form-item>
            <span class="one-row-text">X</span>
            <a-form-item name="packageWidth">
              <a-input-number
                v-model:value="form.packageWidth"
                :min="1"
                :max="700"
                :precision="0"
                :controls="false"
              ></a-input-number>
            </a-form-item>
            <span class="one-row-text">X</span>
            <a-form-item
              name="packageHeight"
              :label-col="{ style: { width: 0 } }"
            >
              <a-input-number
                v-model:value="form.packageHeight"
                :min="1"
                :max="700"
                :precision="0"
                :controls="false"
              ></a-input-number>
            </a-form-item>
            <span class="one-row-text">(单位：厘米； 每件/个 {{ volume }} cm³)</span>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import { useAliexpressPopProductStore } from '~@/stores/aliexpress-pop-product'
  export default {
    name: 'PackageInfo',
    data() {
      return {
        store: useAliexpressPopProductStore(),
        form: {
          grossWeight: undefined,
          isPackSell: false,
          baseUnit: undefined,
          addUnit: undefined,
          addWeight: undefined,
          packageLength: undefined,
          packageWidth: undefined,
          packageHeight: undefined
        },
        rules: {
          grossWeight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
          baseUnit: [{ required: true, message: '请输入数量', trigger: 'blur' }],
          addUnit: [{ required: true, message: '请输入数量', trigger: 'blur' }],
          addWeight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
          packageLength: [{ required: true, message: '请输入长度', trigger: 'blur' }],
          packageWidth: [{ required: true, message: '请输入宽度', trigger: 'blur' }],
          packageHeight: [{ required: true, message: '请输入高度', trigger: 'blur' }]
        }
      }
    },
    computed: {
      productDetail() {
        return this.store.productDetail
      },
      volume() {
        if (!this.form.packageLength || !this.form.packageWidth || !this.form.packageHeight) {
          return '--'
        } else {
          return this.form.packageLength * this.form.packageWidth * this.form.packageHeight
        }
      }
    },
    watch: {
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          this.form.grossWeight = detail.grossWeight
          this.form.isPackSell = detail.isPackSell
          this.form.baseUnit = detail.baseUnit
          this.form.addUnit = detail.addUnit
          this.form.addWeight = detail.addWeight
          this.form.packageLength = detail.packageLength
          this.form.packageWidth = detail.packageWidth
          this.form.packageHeight = detail.packageHeight
        },
        immediate: true
      }
    },
    methods: {
      emitData({ looseValidate = false }) {
        if (looseValidate) {
          this.$refs.form.clearValidate()
        } else {
          let valid = true
          this.$refs.form.validate(val => (valid = val))
          if (!valid) return
        }

        return this.form
      }
    }
  }
</script>

<style lang="less" scoped>
  .package-info {
    margin-bottom: 12px;
    .one-row {
      display: flex;
      .one-row-text {
        margin: 4px 6px 0;
      }
    }

    .manual-asterisk {
      ::v-deep .a-form-item__label::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
</style>
