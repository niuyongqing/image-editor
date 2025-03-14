<template>
  <a-card
    title="描述信息"
    class="mb-4"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ style: { width: '180px' } }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-item
        label="PC端描述"
        name="webDetail"
      >
        <span class="text-[#a0a3a6]">详细描述一般包含产品功能属性、产品细节图片、支付物流、售后服务、公司实力等内容。</span>
        <WangEditorPlus
          v-model="form.webDetail"
          ref="webDetailRef"
          :editor-config="editorConfig"
          @edit-image-size="editImageSize"
        />
      </a-form-item>
      <a-form-item label="APP端描述">
        <a-popover>
          <template #content>
            <span>当前编辑器生成的内容提交到速卖通可能会丢失部分内容和格式!</span>
          </template>
          <InfoCircleOutlined />
        </a-popover>
        <a-button
          style="margin: 0 6px 6px"
          @click="cloneWebDetail"
          >根据PC端描述生成</a-button
        >
        <MobileDetailEditor
          :mobile-detail="mobileModuleList"
          :seller-id="store.sellerId"
          @clear="clear"
          @mobile-detail-edit="mobileDetailEdit"
        />
      </a-form-item>
    </a-form>

    <!-- 批量编辑图片尺寸 -->
    <EditImageBatch
      v-model:open="open"
      :image-list="imgUrls"
      @confirm="editImageConfirm"
    />
  </a-card>
</template>

<script>
  import MobileDetailEditor from '@/components/mobile-detail-editor/index.vue'
  import EditImageBatch from '@/components/edit-image-batch/index.vue'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { useAliexpressPopProductStore } from '~@/stores/aliexpress-pop-product'
  import { uploadImageForSdkApi } from '../../apis/common'
  import { message, Modal } from 'ant-design-vue'
  import { replaceTagsWithRegex, extractTextFromHTML, extractImageUrls } from '@/utils'

  export default {
    name: 'Description',
    components: {
      MobileDetailEditor,
      InfoCircleOutlined,
      EditImageBatch
    },
    data() {
      const validWebDetail = (rule, val) => {
        if (!val.length || val === '<p><br></p>') {
          return Promise.reject('请填写PC端描述')
        } else {
          return Promise.resolve()
        }
      }
      return {
        store: useAliexpressPopProductStore(),
        form: {
          webDetail: ''
        },
        mobileModuleList: [],
        rules: {
          webDetail: { validator: validWebDetail, required: true, trigger: 'change' }
        },
        // 编辑器配置
        editorConfig: {
          placeholder: '请输入内容...',
          MENU_CONF: {
            uploadImage: {
              maxFileSize: 10 * 1024 * 1024, // 10M
              // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
              allowedFileTypes: ['image/*'],
              customUpload(file, insertFn) {
                if (!useAliexpressPopProductStore().sellerId) {
                  message.warning('请先选择店铺')

                  return
                }

                const formData = new FormData()
                formData.append('file', file)
                formData.append('sellerId', useAliexpressPopProductStore().sellerId)
                formData.append('fileName', file.name)
                uploadImageForSdkApi(formData).then(res => {
                  insertFn(res.data.result.photobankUrl)
                  message.success('上传成功')
                })
              }
            }
          }
        },
        // 编辑图片尺寸
        open: false,
        imgUrls: []
      }
    },
    computed: {
      productDetail() {
        return this.store.productDetail
      }
    },
    watch: {
      productDetail: {
        handler: function (detail) {
          if (Object.keys(detail).length === 0) return

          if (detail.detailSourceList[0]) {
            const webDetail = JSON.parse(detail.detailSourceList[0].webDetail)
            const mobileDetail = JSON.parse(detail.detailSourceList[0].mobileDetail)

            if (webDetail) {
              const richTextData = webDetail.moduleList.find(item => item.type === 'html')
              richTextData && (this.form.webDetail = richTextData.html.content)
              this.$nextTick(() => {
                if (!this.form.webDetail.includes('<img')) {
                  this.form.webDetail = replaceTagsWithRegex(richTextData.html.content)
                }
              })
            }
            if (mobileDetail) {
              this.mobileModuleList = mobileDetail.moduleList || []
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      // 清空移动端详情
      clear() {
        this.mobileModuleList = []
      },
      // 移动端详情编辑
      mobileDetailEdit(res) {
        this.mobileModuleList = res
      },
      // 复制 PC 描述到 APP 描述
      cloneWebDetail() {
        if (!this.form.webDetail || this.form.webDetail === '<p><br></p>') {
          message.warning('PC端描述为空')
          return
        }
        Modal.confirm({
          title: '确定生成吗？',
          content: '将PC端描述生成到APP端描述可能存在一定的格式损耗和内容丢失，且之前已有的APP端描述将被覆盖，确定要生成吗？',
          onOk: () => {
            // 将富文本格式转为移动端格式; 不要 title, 文字内容都转成 body; 简陋版, 会丢失数据
            const text = extractTextFromHTML(this.form.webDetail)
            const imgUrls = extractImageUrls(this.form.webDetail)

            const moduleList = []
            moduleList.push({
              type: 'text',
              texts: [
                {
                  class: 'body',
                  content: text,
                  style: {}
                }
              ]
            })

            let images = []
            imgUrls.forEach((img, i) => {
              images.push({
                url: img,
                style: {
                  hasMargin: false
                }
              })
              // 最多 10 张图片一个集合; 遍历到最后一张 push 一下
              if ((i !== 0 && (i + 1) % 10 === 0) || i === imgUrls.length - 1) {
                moduleList.push({
                  type: 'image',
                  images
                })
                images = []
              }
            })

            this.mobileModuleList = moduleList
          }
        })
      },
      // 批量修改图片尺寸
      editImageSize() {
        // 提取所有图片
        // 编辑过的图片需要移除前面的 origin(IP)
        const origin = window.location.origin
        this.imgUrls = extractImageUrls(this.form.webDetail).map(url => url.replace(origin, ''))
        if (this.imgUrls.length === 0) {
          message.error('未检测到图片')

          return
        }

        this.open = true
      },
      // 编辑后返回的数据
      editImageConfirm(imageList) {
        this.form.webDetail = this.form.webDetail.replaceAll('&amp;', '&')
        imageList.forEach(item => {
          this.form.webDetail = this.form.webDetail.replace(item.originUrl, item.url)
        })
      },

      async emitData({ looseValidate = false }) {
        if (looseValidate) {
          this.$refs.form.clearValidate()
        } else {
          let valid = true
          await this.$refs.form.validate().catch(() => {
            valid = false
          })
          if (!valid) return
        }

        let webDetail, mobileDetail

        if (this.form.webDetail && this.form.webDetail !== '<p><br></p>') {
          const res = {
            version: '2.0.0',
            moduleList: [
              {
                type: 'html',
                html: {
                  content: this.form.webDetail.replaceAll('/prod-api', '')
                }
              }
            ]
          }
          webDetail = JSON.stringify(res)
        }

        if (this.mobileModuleList.length) {
          let mobileModuleListStr = JSON.stringify(this.mobileModuleList)
          mobileModuleListStr = mobileModuleListStr.replaceAll('/prod-api', '')
          const moduleList = JSON.parse(mobileModuleListStr)
          const res = {
            version: '2.0.0',
            moduleList
          }

          mobileDetail = JSON.stringify(res)
        }

        const detailSourceList = [
          {
            locale: 'en_US',
            webDetail,
            mobileDetail
          }
        ]
        return { detailSourceList }
      }
    }
  }
</script>
