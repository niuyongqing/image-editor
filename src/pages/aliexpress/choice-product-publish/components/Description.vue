<template>
  <a-card title="描述信息" class="mb-4">
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
        <WangEditor
          v-model="form.webDetail"
          ref="webDetailRef"
          :toolbar-config="toolbarConfig"
          :editor-config="editorConfig"
          :height="500"
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
        <WangEditor
          v-model="form.mobileDetail"
          ref="mobileDetailRef"
          :toolbar-config="toolbarConfig"
          :editor-config="editorConfig"
          :height="500"
        />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { useAliexpressChoiceProductStore } from '~@/stores/aliexpress-choice-product'
  import { uploadImageForSdkApi } from '../../apis/common'
  import { message, Modal } from 'ant-design-vue'

  export default {
    name: 'Description',
    components: { InfoCircleOutlined },
    data() {
      const validWebDetail = (rule, val) => {
        if (!val.length) {
          return Promise.reject('请填写PC端描述')
        } else {
          return Promise.resolve()
        }
      }
      return {
        store: useAliexpressChoiceProductStore(),
        uploadImageUrl: import.meta.env.VITE_APP_BASE_API_DEV + '/platform-aliexpress/platform/aliexpress/file/imageBank/uploadImageForSdk',
        form: {
          webDetail: '',
          mobileDetail: ''
        },
        rules: {
          webDetail: { validator: validWebDetail, required: true, trigger: 'change' }
        },
        // 工具栏配置
        toolbarConfig: {},
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
        }
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
            }
            if (mobileDetail) {
              // 将移动端格式转为富文本格式
              let richTextData = ''
              mobileDetail.moduleList.forEach(item => {
                if (item.type === 'text') {
                  item.texts.forEach(textItem => {
                    richTextData += '<p style="'
                    // 有 title 和 body 两种; 这里不做区分
                    for (const key in textItem.style) {
                      richTextData += `${key}: ${textItem.style[key]}${key === 'fontSize' ? 'px' : ''}; `
                    }
                    richTextData += `">${textItem.content}</p><br>`
                  })
                } else if (item.type === 'image') {
                  item.images.forEach(imageItem => {
                    let imageText = `<img src="${imageItem.url}" style="width: ${imageItem.style.width}px; height: ${imageItem.style.height}px;">`
                    if (imageItem.targetUrl) {
                      imageText = `<a href="${imageItem.targetUrl}">${imageText}</a>`
                    }
                    imageText = `<p>${imageText}</p>`
                    richTextData += imageText
                  })
                }
              })

              this.form.mobileDetail = richTextData
            }
          }
        },
        immediate: true
      }
    },
    methods: {
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
            this.form.mobileDetail = this.form.webDetail
          }
        })
      },
      async emitData({ isDraft = false }) {
        if (isDraft) {
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
                  content: this.form.webDetail
                }
              }
            ]
          }
          webDetail = JSON.stringify(res)
        }
        if (this.form.mobileDetail && this.form.mobileDetail !== '<p><br></p>') {
          // 将富文本格式转为移动端格式; 不要 title, 文字内容都转成 body; 简陋版, 会丢失数据
          const pattern = /<[a-z]+[1-6]?\b[^>]*>(.*?)<\/[a-z]+[1-6]?>/g
          const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
          const bodyList = []
          const imgList = []
          this.form.mobileDetail.split('<p><br></p>').forEach(paragraph => {
            if (paragraph.includes('<img src=')) {
              const pLabelList = paragraph.match(/<\/p>/g)
              const splitStr = pLabelList.length > 1 ? '</p>' : '><'
              let imgLabelList = paragraph.replaceAll('<p>', '').split(splitStr)
              // 去除空数据
              imgLabelList = imgLabelList.filter(img => img)
              imgLabelList.forEach(img => {
                const res = img.match(srcReg)
                res && imgList.push(res[1])
              })
            } else {
              let match
              while ((match = pattern.exec(paragraph)) !== null) {
                bodyList.push(match[1].trim())
              }
            }
          })

          let moduleList = []
          bodyList.forEach(body => {
            moduleList.push({
              type: 'text',
              texts: [
                {
                  class: 'body',
                  content: body,
                  style: {
                    fontSize: 14
                  }
                }
              ]
            })
          })
          imgList.forEach(img => {
            moduleList.push({
              type: 'image',
              images: [
                {
                  url: img,
                  style: {
                    // width: 800,
                    // height: 800,
                    hasMargin: false
                  }
                }
              ]
            })
          })

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
