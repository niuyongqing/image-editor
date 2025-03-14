<template>
  <div class="others">
    <a-card title="其他信息">
      <a-form
        :model="form"
        ref="form"
        :rules="rules"
        :label-col="{ style: { width: '180px' } }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item
          v-if="!(isEdit && productDetail.productId && !form.isSemiCustodial)"
          label="半托管服务"
        >
          <a-checkbox
            v-model:checked="form.isSemiCustodial"
            :disabled="productDetail.productId && isEdit"
            >参与</a-checkbox
          >
        </a-form-item>
        <a-form-item
          label="产品分组"
          name="groupIdList"
        >
          <a-cascader
            v-model:value="form.groupIdList"
            :options="groupOptions"
            multiple
            :fieldNames="{ label: 'groupName', value: 'groupId', children: 'childGroupList' }"
            show-checked-strategy="SHOW_CHILD"
            placeholder="请选择"
          />
        </a-form-item>
        <a-form-item>
          <template #label>
            <span class="mr-1">欧盟责任人</span>
            <a-popover>
              <template #content>
                <span>仅部分分类需要选择欧盟责任人, 其他分类选择不生效</span>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </template>
          <a-select
            v-model:value="form.msrEuId"
            :options="EUResponsibleOptions"
            :field-names="{ label: 'name', value: 'msrEuId' }"
            allow-clear
            placeholder="请选择"
          >
          </a-select>
        </a-form-item>
        <a-form-item>
          <template #label>
            <span class="mr-1">品牌制造商</span>
            <a-popover>
              <template #content>
                <span
                  >1、先在速卖通平台后台创建制造商信息并同步到ERP再选择要绑定的制造商；<br />
                  2、如果产品已经绑定过制造商，目前平台不支持解绑只支持替换；</span
                >
              </template>
              <InfoCircleOutlined
            /></a-popover>
          </template>
          <a-select
            v-model:value="form.manufacturerId"
            :options="manufacturerOptions"
            :field-names="{ label: 'name', value: 'id' }"
            allow-clear
            placeholder="请选择"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="资质信息">
          <span class="gray"> 1、商品的CPC认证和包装图都审核通过才算合规。CPC认证中的生产企业名称和商品信息需与商品外包装标签图中的一致，英文谐音可以接受。商品资质的审核结果查询请访问资质中心。</span>
          <br />
          <span class="gray"> 2、因接口限制，暂不支持上传PDF格式资质，PDF文件资质请到速卖通后台提交。</span>
          <a-form :label-col="{ style: { width: '180px' } }">
            <a-form-item
              v-for="(item, i) in qualificationList"
              :key="item.key"
              :label="item.label"
              :required="item.required"
            >
              <a-tag
                color="success"
                class="mb-1"
                >！说明</a-tag
              >
              <span class="gray"> {{ item.tips }}</span>
              <template v-if="item.type === 'image'">
                <div
                  v-if="item.value"
                  class="image"
                >
                  <a-image :src="item.value"></a-image>
                  <div class="image-info">
                    <a-button
                      type="link"
                      danger
                      @click="remove(i)"
                      ><DeleteOutlined
                    /></a-button>
                  </div>
                </div>
                <DropdownOfImage
                  v-else
                  :account="sellerId"
                  :img-group-list="imgGroupList"
                  @submit="imgData => fillImgData(imgData, i)"
                >
                  <div class="image-empty">
                    <a-empty description="添加图片" />
                  </div>
                </DropdownOfImage>
              </template>
              <a-textarea
                v-else
                v-model:value="item.value"
                :auto-size="{ minRows: 3, maxRows: 6 }"
                :maxlength="1000"
                show-count
                allow-clear
              ></a-textarea>
            </a-form-item>
          </a-form>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import DropdownOfImage from '@/components/dropdown-of-image/index.vue'
  import { listGroupApi } from '../../apis/media'
  import { syncEuPersonListApi, getProductGroupsApi, euPersonListApi, manufactureListApi, qualificationsApi } from '../../apis/product'
  import { useAliexpressPopProductStore } from '~@/stores/aliexpress-pop-product'
  import { Modal, Cascader } from 'ant-design-vue'
  import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue'

  // 找给定子 Id 的所有父级 Id, 以数组形式返回(含子 Id)
  function findParentIds(tree, id, parentIds = []) {
    for (const node of tree) {
      if (node.groupId === id) {
        parentIds.push(id)
        return parentIds
      }
      if (node.childGroupList && node.childGroupList.length > 0) {
        const result = findParentIds(node.childGroupList, id, [...parentIds, node.groupId])
        if (result.length > 0) {
          return result
        }
      }
    }
    return []
  }

  export default {
    name: 'Others',
    components: { InfoCircleOutlined, DeleteOutlined },
    data() {
      const validGroup = (rule, value) => {
        if (value.length > 3) {
          return Promise.reject('最多选择 3 个分组')
        } else {
          return Promise.resolve()
        }
      }
      return {
        store: useAliexpressPopProductStore(),
        Cascader,
        imgGroupList: [],
        form: {
          isSemiCustodial: false,
          groupIds: [],
          groupIdList: [],
          msrEuId: undefined,
          manufacturerId: undefined
        },
        isMsrEuIdFromDetail: false,
        isManufacturerIdFromDetail: false,
        rules: {
          groupIdList: { required: true, validator: validGroup, trigger: 'change' }
        },
        // 资质信息
        qualificationList: [],
        groupOptions: [],
        EUResponsibleOptions: [],
        manufacturerOptions: []
      }
    },
    computed: {
      isEdit() {
        return this.store.isEdit
      },
      sellerId() {
        return this.store.sellerId
      },
      categoryId() {
        return this.store.categoryId
      },
      productDetail() {
        return this.store.productDetail
      },
      params() {
        return {
          sellerId: this.sellerId,
          channel: 'AE_GLOBAL',
          channelSellerId: this.sellerId
        }
      }
    },
    watch: {
      sellerId: {
        handler: function () {
          this.form.groupIds = []
          this.getImgGroup()
          this.getProductGroups()
          this.getManufacturerOptions()
        }
      },
      categoryId: {
        handler: function () {
          // 同步/获取 欧盟责任人
          this.syncEuPersonList()
          // 获取资质信息
          this.getQualification()
        }
      },
      'form.isSemiCustodial': {
        handler: function (checked) {
          this.store.$patch(state => {
            state.isSemiCustodial = checked
          })
        }
      },
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          this.form.groupIds = detail.groupIds || []
          this.form.isSemiCustodial = detail.isSemiCustodial
          this.form.msrEuId = detail.msrEuId ? Number(detail.msrEuId) : detail.msrEuId
          this.isMsrEuIdFromDetail = true
          this.form.manufacturerId = detail.manufacturerId ? Number(detail.manufacturerId) : detail.manufacturerId
          this.isManufacturerIdFromDetail = true
        }
      }
    },
    methods: {
      getImgGroup() {
        listGroupApi({ sellerId: this.sellerId }).then(res => {
          this.imgGroupList = res.data.result.photoBankImageGroupList || []
        })
      },
      getProductGroups() {
        getProductGroupsApi({ channelSellerId: this.sellerId }).then(res => {
          this.groupOptions = res.data.result.targetList || []
          if (this.form.groupIds.length === 0) {
            this.form.groupIdList = []
          } else {
            this.form.groupIdList = this.form.groupIds.map(groupId => {
              return findParentIds(this.groupOptions, groupId)
            })
          }
        })
      },
      syncEuPersonList() {
        syncEuPersonListApi({ ...this.params, categoryId: this.categoryId }).finally(() => this.getEuPersonList())
      },
      getEuPersonList() {
        euPersonListApi({ channelSellerId: this.sellerId, categoryId: this.categoryId }).then(res => {
          this.EUResponsibleOptions = res.data || []
          if (!this.isMsrEuIdFromDetail) {
            this.form.msrEuId = undefined
            // 设默认值 'APEX ES SPECIALISTS,S.L.'
            const target = this.EUResponsibleOptions.find(item => item.name === 'APEX ES SPECIALISTS,S.L.')
            target && (this.form.msrEuId = target.msrEuId)
          } else {
            this.isMsrEuIdFromDetail = false
          }
        })
      },
      // 制造商列表
      getManufacturerOptions() {
        manufactureListApi(this.params).then(res => {
          this.manufacturerOptions = res.data || []
          if (!this.isManufacturerIdFromDetail) {
            this.form.manufacturerId = undefined
            // 设默认值 'Yiwu Xinzhan Technology Co.Ltd.' 这个名字会有拼写错误, 不一致的情况
            const target = this.manufacturerOptions.find(item => item.name.includes('Yiwu Xinzhan'))
            target && (this.form.manufacturerId = target.id)
          } else {
            this.isManufacturerIdFromDetail = false
          }
        })
      },
      // 资质信息
      getQualification() {
        this.qualificationList = []
        qualificationsApi({ channelSellerId: this.sellerId, categoryId: this.categoryId }).then(res => {
          this.qualificationList = res.data.qualificationModuleLists || []
          this.qualificationList.forEach(item => {
            item.value = ''
          })
          // 如果是编辑
          if (this.isEdit) {
            this.qualificationList.forEach(item => {
              const obj = this.productDetail.aeopQualificationStructList.find(ele => ele.key === item.key)
              obj && (item.value = obj.value)
            })
          }
        })
      },
      fillImgData(imgData, i) {
        this.qualificationList[i].value = imgData[0].url
      },
      remove(i) {
        this.qualificationList[i].value = ''
      },
      async emitData({ looseValidate = false }) {
        if (!looseValidate) {
          let valid = true
          await this.$refs.form.validate().catch(() => {
            valid = false
          })
          // 校验是否有必填的资质信息未填写
          let qualificationValid = this.qualificationList.some(item => item.required && !item.value)
          qualificationValid && Modal.warning({ title: '请补充资质信息' })
          if (!valid || qualificationValid) return
        }

        const groupIds = this.form.groupIdList.map(item => {
          return item[item.length - 1]
        })

        const aeopQualificationStructList = this.qualificationList.map(item => {
          return {
            key: item.key,
            type: item.type, // image | text
            value: item.value && item.value.replace('/prod-api', '') // 图片链接或文本
          }
        })

        return {
          isSemiCustodial: this.form.isSemiCustodial,
          groupIds, // 草稿用
          groupId: groupIds.join(','), // 速卖通后台用
          msrEuId: this.form.msrEuId,
          manufacturerId: this.form.manufacturerId,
          aeopQualificationStructList
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .others {
    .gray {
      color: #a0a3a6;
      margin-bottom: 4px;
    }
    .image {
      width: 178px;
      height: 178px;
      border-radius: 4px;
      margin-right: 16px;
      position: relative;
      overflow: hidden;
      .image-info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(5, 5, 5, 0.3);
        padding: 0 4px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 155px;
      }
    }
    .image-empty {
      width: 178px;
      height: 178px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      .empty-icon {
        color: #909399;
        font-size: 50px;
      }
    }
  }
</style>
