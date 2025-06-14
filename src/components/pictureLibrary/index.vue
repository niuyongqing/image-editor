<template>
<div id="pictureLibrary_index" class="pictureLibrary_index">
  <div class="index-left">
    <div class="left-title box-title">图片空间的分类</div>
    <div class="left-tree-box">
      <div class="box-input">
        <a-input-search
          v-model:value="treeData.keyword"
          placeholder="input search text"
          @search="treeSearch"
        />
      </div>
      <a-tree
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="treeData.tree"
      >
        <template #title="{ title, key }">
          <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
          <template v-else>{{ title }}</template>
        </template>
      </a-tree>
    </div>
  </div>
  <div class="index-right">
    <div class="right-btn">
      <a-space>
        <a-input-search
          v-model:value="imgData.keyword"
          style="width: 300px;"
          placeholder="input search text"
          enter-button="搜索"
          @search="imgSearch"
        />
        <a-button type="primary">上传图片</a-button>
      </a-space>
    </div>
    <div class="right-box">
      <div class="right-box-title box-title">
        <span>图片>{{ 'sdgsdfsdfgs' }}</span>
        <span>已选中{{ 56 }}张图片</span>
      </div>
      <div class="right-box-content">
        <div class="img-box"
          v-for="item in imgData.data"
          :key="item.id"
        >
          <a-image
            :width="150"
            :preview="{
              visible: false,
              onVisibleChange: (visible, prevVisible) => onVisibleChange(item),
            }"  
            :src="item.path"
          >
            <template #previewMask>点击{{ item.checked ? '取消':'选中' }}</template>
          </a-image>
          <div class="img-size">
            <span>{{ `${item.width} × ${item.height}` }}</span>
            <span>{{ item.size }}</span>
          </div>
          <div class="img-box-foot">
            <a-checkbox v-model:checked="item.checked"></a-checkbox>
            <div class="img-name">
              <a-tooltip>
                <template #title>{{ item.name }}</template>
                {{ item.name }}
              </a-tooltip>
            </div>
            <a-popconfirm
              title="是否删除！"
              ok-text="是"
              cancel-text="否"
              @confirm="delImg(item)"
            >
              <DeleteOutlined style="color: red; cursor: pointer;" />
            </a-popconfirm>
          </div>
        </div>
      </div>
      <div class="right-box-pagination">
        <a-pagination 
          v-model:current="imgData.pageNum" 
          v-model:page-size="imgData.pageSize"
          :pageSizeOptions="[20, 40]"
          show-quick-jumper 
          :total="imgData.total" 
          :show-total="total => `共 ${imgData.total} 张`"
          @change="pageChange" 
        />
      </div>
      <div class="selectedImg-content">
        <div class="selectedImg-content-item" v-for="item in imgData.selectedImgList" :key="item.id">
          <a-image
            :width="70"
            :preview="false"  
            :src="item.path"
          >
          </a-image>
          <div class="item-icon" @click="delSelectImg(item)">×</div>
        </div>
      </div>
      <div class="right-box-foot">
        <a-space>
          <a-button type="primary">确定</a-button>
          <a-button type="primary">取消</a-button>
        </a-space>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue';
defineOptions({ name: "pictureLibrary_index" })
const { proxy: _this } = getCurrentInstance()
// const treeData = [

// ];
const expandedKeys = ref(['0-0-0', '0-0-1']);
const selectedKeys = ref(['0-0-0', '0-0-1']);
const checkedKeys = ref(['0-0-0', '0-0-1']);
const value = ref('');
const onSearch = searchValue => {
  console.log('use value', searchValue);
  console.log('or use this.value', value.value);
};
watch(expandedKeys, () => {
  console.log('expandedKeys', expandedKeys);
});
watch(selectedKeys, () => {
  console.log('selectedKeys', selectedKeys);
});
watch(checkedKeys, () => {
  console.log('checkedKeys', checkedKeys);
});

const treeData = reactive({
  tree: [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              key: '0-0-1-0',
              title: 'sss',
            },
          ],
        },
      ],
    },
  ],
  keyword: ''
})
const imgData = reactive({
  data: [],
  selectedImgList: [],
  keyword: '',
  total: 200,
  pageNum: 1, // 分页参数
  pageSize: 20 // 每页数量
})
// 树搜索
function treeSearch(val) {

}
// 图片搜索
async function imgSearch(val) { 
  for (let index = 0; index < 100; index++) {
    let obj = {
      path: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      name: '的若干似懂非sdgasdgfsdfasfda懂',
      width: 200 + index,
      height: 200 + index,
      size: 4331,
      checked: false,
      id: index + '',
    }
    imgData.data.push(obj)
  }
}
// 页码变化
function pageChange(val) {
  
}
// 浮层
function onVisibleChange(img) {
  img.checked = !img.checked;
  if (img.checked) {
    imgData.selectedImgList.push(img)
  } else {
    imgData.selectedImgList = imgData.selectedImgList.filter(i => i.id !== img.id)
  }
}
// 删除选中照片
function delSelectImg(val) {
  let obj = imgData.data.find(i => i.id === val.id)
  obj.checked = false
  imgData.selectedImgList = imgData.selectedImgList.filter(i => i.id !== val.id)
}
// 删除空间图片
function delImg(val) {
  console.log({val});
}

</script>
<style lang="less" scoped>
.pictureLibrary_index {
  display: flex;
  border: 1px solid red; 
  padding: 10px;
  width: 1200px;
  .index-left {
    width: 300px;
    margin-right: 15px;
    .left-tree-box {
      width: 80%;
      margin: 10px 0;
    }
  }
  .index-right {
    width: 850px;
    .right-btn {
      display: flex;
      // justify-content: space-between;
    }
    .right-box {
      margin-top: 10px;
      .right-box-content {
        width: 100%;
        height: 500px;
        padding: 10px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        .img-box {
          width: 150px;
          margin: 0 10px 10px 0;
          position: relative;
          .img-size {
            width: 100%;
            height: 20px;
            position: absolute;
            top: 130px;
            background-color: rgba(0, 0, 0, .2);
            opacity: 0.8;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 6px;
          }
          .img-box-foot {
            width: 100%;
            height: 22px;
            display: flex;
            justify-content: space-between;
            .img-name {
              width: calc(100% - 45px);
              text-align: left;
              overflow: hidden;
              text-overflow:ellipsis; 
              white-space: nowrap;
            }
          }
        }
      }
      .right-box-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
      .selectedImg-content {
        width: 100%;
        height: 100px;
        overflow-y: auto;
        background: #eeeeee;
        margin: 10px 0;
        display: flex;
        flex-wrap: wrap;
        .selectedImg-content-item {
          width: 70px;
          height: 70px;
          margin: 10px;
          position: relative;
          .item-icon {
            width: 20px;
            height: 20px;
            background: #000;
            color: #fff;
            font-size: 700;
            font-size: 24px;
            display: flex;
            justify-items: center;
            align-items: center;
            position: absolute;
            top: -8px;
            right: -8px;
            cursor: pointer;
            border-radius: 50%;
            padding: 0 0 3px 2px;
          }
        }
      }
      .right-box-foot {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .box-title {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0 10px;
  }
}
</style>