<template>
  <appVerifyUpload 
    @uploadEnd="uploadEnd" 
    url="/report-aliexpress/report/aliexpress/config-item-org/import"
  ></appVerifyUpload>
  <appTableBox
    ref="tableRef"
    :table-header="tableColumns"
    :data-source="treeTableData"
    :reset-set-menu="'testTable'"
    bordered
    :row-class-name="rowClassNameFn"
    :default-expand-all-rows="true"
    v-model:expandedRowKeys="expandedRowKeys.data"
    :rowKey="rowKeyFn"
    :row-drag="expandedRowKeys.rowDrag"
    @dragEnd="dragEnd"
  >
    <template #leftTool>
      <a-button type="primary" @click="aaaaa">{{ expandedRowKeys.rowDrag ? '完成拖拽':'开始拖拽' }}</a-button>
      <appUpload 
        @uploadEnd="uploadEnd" 
        url="/report-aliexpress/report/aliexpress/config-item-org/import"
      ></appUpload>
    </template>
  </appTableBox>
  <appFullLoading :loading="loading"></appFullLoading>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import appTableBox from '~@/components/common/appTableBox.vue';
import appUpload from '~@/components/common/appUpload.vue';
import appFullLoading from '~@/components/common/appFullLoading.vue';
import appVerifyUpload from '~@/components/common/appVerifyUpload.vue';
import Sortable from 'sortablejs';

// const tableColumns = [
//   {
//     title: 'ID',
//     dataIndex: 'id',
//     key: 'id',
//     width: 80
//   },
//   {
//     title: '名称',
//     dataIndex: 'name',
//     key: 'name',
//     width: 180
//   },
//   {
//     title: '属性1',
//     dataIndex: 'attr1',
//     key: 'attr1',
//     width: 100
//   },
//   {
//     title: '属性2',
//     dataIndex: 'attr2',
//     key: 'attr2',
//     width: 100
//   },
//   {
//     title: '状态',
//     dataIndex: 'status',
//     key: 'status',
//     width: 100
//   },
//   {
//     title: '创建时间',
//     dataIndex: 'createTime',
//     key: 'createTime',
//     width: 160
//   },
//   {
//     title: '负责人',
//     dataIndex: 'owner',
//     key: 'owner',
//     width: 120
//   },
//   {
//     title: '所属部门',
//     dataIndex: 'dept',
//     key: 'dept',
//     width: 140
//   },
//   {
//     title: '备注',
//     dataIndex: 'remark',
//     key: 'remark',
//     width: 200
//   },
//   {
//     title: '操作',
//     dataIndex: 'operation',
//     key: 'operation',
//     width: 120
//   }
// ];
const tableColumns =  [
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    width: 150,
    align: 'center'
  },
  {
    title: '年份',
    key: 'dataYear',
    dataIndex: 'dataYear',
    width: 100,
    align: 'center'
  },
  {
    title: '月份',
    key: 'dataMonth',
    dataIndex: 'dataMonth',
    width: 100,
    align: 'center'
  },
  {
    title: 'GMV基础目标（万元）',
    key: 'gmvBaseTarget',
    dataIndex: 'gmvBaseTarget',
    width: 180,
    align: 'right'
  },
  {
    title: 'GMV上浮目标（万元）',
    key: 'gmvIncreaseTarget',
    dataIndex: 'gmvIncreaseTarget',
    width: 180,
    align: 'right'
  },
  {
    title: 'GMV挑战目标（万元）',
    key: 'gmvChallengeTarget',
    dataIndex: 'gmvChallengeTarget',
    width: 180,
    align: 'right'
  },
  {
    title: '创建人',
    key: 'createUserName',
    dataIndex: 'createUserName',
    width: 150,
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 150,
    align: 'center'
  },
  {
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    width: 150,
    align: 'center'
  }
];
// const treeTableData = [
//   // 第一层级（4个节点）
//   {
//     id: '1',
//     name: '一级分类1',
//     attr1: 'A1',
//     attr2: 100,
//     status: '启用',
//     createTime: '2025-01-01',
//     owner: '管理员A',
//     dept: '研发部',
//     remark: '一级分类主节点1',
//     operation: '编辑|删除',
//     children: [
//       // 第二层级（4个节点）
//       {
//         id: '1-1',
//         name: '二级分类1-1',
//         attr1: 'B1',
//         attr2: 80,
//         status: '启用',
//         createTime: '2025-01-02',
//         owner: '管理员B',
//         dept: '前端组',
//         remark: '二级分类子节点1-1',
//         operation: '编辑|删除',
//         children: [
//           // 第三层级（4个节点）
//           {
//             id: '1-1-1',
//             name: '三级分类1-1-1',
//             attr1: 'C1',
//             attr2: 60,
//             status: '启用',
//             createTime: '2025-01-03',
//             owner: '管理员C',
//             dept: 'Vue组',
//             remark: '三级分类叶子节点1-1-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-1-2',
//             name: '三级分类1-1-2',
//             attr1: 'C2',
//             attr2: 58,
//             status: '启用',
//             createTime: '2025-01-04',
//             owner: '管理员C',
//             dept: 'Vue组',
//             remark: '三级分类叶子节点1-1-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-1-3',
//             name: '三级分类1-1-3',
//             attr1: 'C3',
//             attr2: 56,
//             status: '禁用',
//             createTime: '2025-01-05',
//             owner: '管理员C',
//             dept: 'Vue组',
//             remark: '三级分类叶子节点1-1-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-1-4',
//             name: '三级分类1-1-4',
//             attr1: 'C4',
//             attr2: 54,
//             status: '启用',
//             createTime: '2025-01-06',
//             owner: '管理员C',
//             dept: 'Vue组',
//             remark: '三级分类叶子节点1-1-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '1-2',
//         name: '二级分类1-2',
//         attr1: 'B2',
//         attr2: 78,
//         status: '启用',
//         createTime: '2025-01-07',
//         owner: '管理员B',
//         dept: '后端组',
//         remark: '二级分类子节点1-2',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '1-2-1',
//             name: '三级分类1-2-1',
//             attr1: 'C5',
//             attr2: 52,
//             status: '启用',
//             createTime: '2025-01-08',
//             owner: '管理员C',
//             dept: 'Java组',
//             remark: '三级分类叶子节点1-2-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-2-2',
//             name: '三级分类1-2-2',
//             attr1: 'C6',
//             attr2: 50,
//             status: '禁用',
//             createTime: '2025-01-09',
//             owner: '管理员C',
//             dept: 'Java组',
//             remark: '三级分类叶子节点1-2-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-2-3',
//             name: '三级分类1-2-3',
//             attr1: 'C7',
//             attr2: 48,
//             status: '启用',
//             createTime: '2025-01-10',
//             owner: '管理员C',
//             dept: 'Java组',
//             remark: '三级分类叶子节点1-2-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-2-4',
//             name: '三级分类1-2-4',
//             attr1: 'C8',
//             attr2: 46,
//             status: '启用',
//             createTime: '2025-01-11',
//             owner: '管理员C',
//             dept: 'Java组',
//             remark: '三级分类叶子节点1-2-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '1-3',
//         name: '二级分类1-3',
//         attr1: 'B3',
//         attr2: 76,
//         status: '禁用',
//         createTime: '2025-01-12',
//         owner: '管理员B',
//         dept: '测试组',
//         remark: '二级分类子节点1-3',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '1-3-1',
//             name: '三级分类1-3-1',
//             attr1: 'C9',
//             attr2: 44,
//             status: '启用',
//             createTime: '2025-01-13',
//             owner: '管理员C',
//             dept: '功能测试组',
//             remark: '三级分类叶子节点1-3-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-3-2',
//             name: '三级分类1-3-2',
//             attr1: 'C10',
//             attr2: 42,
//             status: '启用',
//             createTime: '2025-01-14',
//             owner: '管理员C',
//             dept: '功能测试组',
//             remark: '三级分类叶子节点1-3-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-3-3',
//             name: '三级分类1-3-3',
//             attr1: 'C11',
//             attr2: 40,
//             status: '禁用',
//             createTime: '2025-01-15',
//             owner: '管理员C',
//             dept: '性能测试组',
//             remark: '三级分类叶子节点1-3-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-3-4',
//             name: '三级分类1-3-4',
//             attr1: 'C12',
//             attr2: 38,
//             status: '启用',
//             createTime: '2025-01-16',
//             owner: '管理员C',
//             dept: '性能测试组',
//             remark: '三级分类叶子节点1-3-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '1-4',
//         name: '二级分类1-4',
//         attr1: 'B4',
//         attr2: 74,
//         status: '启用',
//         createTime: '2025-01-17',
//         owner: '管理员B',
//         dept: '运维组',
//         remark: '二级分类子节点1-4',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '1-4-1',
//             name: '三级分类1-4-1',
//             attr1: 'C13',
//             attr2: 36,
//             status: '禁用',
//             createTime: '2025-01-18',
//             owner: '管理员C',
//             dept: '服务器运维组',
//             remark: '三级分类叶子节点1-4-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-4-2',
//             name: '三级分类1-4-2',
//             attr1: 'C14',
//             attr2: 34,
//             status: '启用',
//             createTime: '2025-01-19',
//             owner: '管理员C',
//             dept: '服务器运维组',
//             remark: '三级分类叶子节点1-4-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-4-3',
//             name: '三级分类1-4-3',
//             attr1: 'C15',
//             attr2: 32,
//             status: '启用',
//             createTime: '2025-01-20',
//             owner: '管理员C',
//             dept: '数据库运维组',
//             remark: '三级分类叶子节点1-4-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '1-4-4',
//             name: '三级分类1-4-4',
//             attr1: 'C16',
//             attr2: 30,
//             status: '禁用',
//             createTime: '2025-01-21',
//             owner: '管理员C',
//             dept: '数据库运维组',
//             remark: '三级分类叶子节点1-4-4',
//             operation: '编辑|删除'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: '2',
//     name: '一级分类2',
//     attr1: 'A2',
//     attr2: 98,
//     status: '启用',
//     createTime: '2025-02-01',
//     owner: '管理员A',
//     dept: '产品部',
//     remark: '一级分类主节点2',
//     operation: '编辑|删除',
//     children: [
//       {
//         id: '2-1',
//         name: '二级分类2-1',
//         attr1: 'B5',
//         attr2: 72,
//         status: '启用',
//         createTime: '2025-02-02',
//         owner: '管理员B',
//         dept: '产品策划组',
//         remark: '二级分类子节点2-1',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '2-1-1',
//             name: '三级分类2-1-1',
//             attr1: 'C17',
//             attr2: 28,
//             status: '启用',
//             createTime: '2025-02-03',
//             owner: '管理员C',
//             dept: '需求分析组',
//             remark: '三级分类叶子节点2-1-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-1-2',
//             name: '三级分类2-1-2',
//             attr1: 'C18',
//             attr2: 26,
//             status: '禁用',
//             createTime: '2025-02-04',
//             owner: '管理员C',
//             dept: '需求分析组',
//             remark: '三级分类叶子节点2-1-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-1-3',
//             name: '三级分类2-1-3',
//             attr1: 'C19',
//             attr2: 24,
//             status: '启用',
//             createTime: '2025-02-05',
//             owner: '管理员C',
//             dept: '产品设计组',
//             remark: '三级分类叶子节点2-1-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-1-4',
//             name: '三级分类2-1-4',
//             attr1: 'C20',
//             attr2: 22,
//             status: '启用',
//             createTime: '2025-02-06',
//             owner: '管理员C',
//             dept: '产品设计组',
//             remark: '三级分类叶子节点2-1-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '2-2',
//         name: '二级分类2-2',
//         attr1: 'B6',
//         attr2: 70,
//         status: '禁用',
//         createTime: '2025-02-07',
//         owner: '管理员B',
//         dept: '产品运营组',
//         remark: '二级分类子节点2-2',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '2-2-1',
//             name: '三级分类2-2-1',
//             attr1: 'C21',
//             attr2: 20,
//             status: '启用',
//             createTime: '2025-02-08',
//             owner: '管理员C',
//             dept: '用户运营组',
//             remark: '三级分类叶子节点2-2-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-2-2',
//             name: '三级分类2-2-2',
//             attr1: 'C22',
//             attr2: 18,
//             status: '启用',
//             createTime: '2025-02-09',
//             owner: '管理员C',
//             dept: '用户运营组',
//             remark: '三级分类叶子节点2-2-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-2-3',
//             name: '三级分类2-2-3',
//             attr1: 'C23',
//             attr2: 16,
//             status: '禁用',
//             createTime: '2025-02-10',
//             owner: '管理员C',
//             dept: '内容运营组',
//             remark: '三级分类叶子节点2-2-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-2-4',
//             name: '三级分类2-2-4',
//             attr1: 'C24',
//             attr2: 14,
//             status: '启用',
//             createTime: '2025-02-11',
//             owner: '管理员C',
//             dept: '内容运营组',
//             remark: '三级分类叶子节点2-2-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '2-3',
//         name: '二级分类2-3',
//         attr1: 'B7',
//         attr2: 68,
//         status: '启用',
//         createTime: '2025-02-12',
//         owner: '管理员B',
//         dept: '市场组',
//         remark: '二级分类子节点2-3',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '2-3-1',
//             name: '三级分类2-3-1',
//             attr1: 'C25',
//             attr2: 12,
//             status: '禁用',
//             createTime: '2025-02-13',
//             owner: '管理员C',
//             dept: '品牌推广组',
//             remark: '三级分类叶子节点2-3-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-3-2',
//             name: '三级分类2-3-2',
//             attr1: 'C26',
//             attr2: 10,
//             status: '启用',
//             createTime: '2025-02-14',
//             owner: '管理员C',
//             dept: '品牌推广组',
//             remark: '三级分类叶子节点2-3-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-3-3',
//             name: '三级分类2-3-3',
//             attr1: 'C27',
//             attr2: 8,
//             status: '启用',
//             createTime: '2025-02-15',
//             owner: '管理员C',
//             dept: '渠道推广组',
//             remark: '三级分类叶子节点2-3-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-3-4',
//             name: '三级分类2-3-4',
//             attr1: 'C28',
//             attr2: 6,
//             status: '禁用',
//             createTime: '2025-02-16',
//             owner: '管理员C',
//             dept: '渠道推广组',
//             remark: '三级分类叶子节点2-3-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '2-4',
//         name: '二级分类2-4',
//         attr1: 'B8',
//         attr2: 66,
//         status: '启用',
//         createTime: '2025-02-17',
//         owner: '管理员B',
//         dept: '销售组',
//         remark: '二级分类子节点2-4',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '2-4-1',
//             name: '三级分类2-4-1',
//             attr1: 'C29',
//             attr2: 4,
//             status: '启用',
//             createTime: '2025-02-18',
//             owner: '管理员C',
//             dept: '大客户销售组',
//             remark: '三级分类叶子节点2-4-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-4-2',
//             name: '三级分类2-4-2',
//             attr1: 'C30',
//             attr2: 2,
//             status: '禁用',
//             createTime: '2025-02-19',
//             owner: '管理员C',
//             dept: '大客户销售组',
//             remark: '三级分类叶子节点2-4-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-4-3',
//             name: '三级分类2-4-3',
//             attr1: 'C31',
//             attr2: 1,
//             status: '启用',
//             createTime: '2025-02-20',
//             owner: '管理员C',
//             dept: '中小客户销售组',
//             remark: '三级分类叶子节点2-4-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '2-4-4',
//             name: '三级分类2-4-4',
//             attr1: 'C32',
//             attr2: 3,
//             status: '启用',
//             createTime: '2025-02-21',
//             owner: '管理员C',
//             dept: '中小客户销售组',
//             remark: '三级分类叶子节点2-4-4',
//             operation: '编辑|删除'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: '3',
//     name: '一级分类3',
//     attr1: 'A3',
//     attr2: 96,
//     status: '禁用',
//     createTime: '2025-03-01',
//     owner: '管理员A',
//     dept: '财务部',
//     remark: '一级分类主节点3',
//     operation: '编辑|删除',
//     children: [
//       {
//         id: '3-1',
//         name: '二级分类3-1',
//         attr1: 'B9',
//         attr2: 74,
//         status: '启用',
//         createTime: '2025-03-02',
//         owner: '管理员B',
//         dept: '会计组',
//         remark: '二级分类子节点3-1',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '3-1-1',
//             name: '三级分类3-1-1',
//             attr1: 'C33',
//             attr2: 58,
//             status: '启用',
//             createTime: '2025-03-03',
//             owner: '管理员C',
//             dept: '总账会计组',
//             remark: '三级分类叶子节点3-1-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-1-2',
//             name: '三级分类3-1-2',
//             attr1: 'C34',
//             attr2: 56,
//             status: '禁用',
//             createTime: '2025-03-04',
//             owner: '管理员C',
//             dept: '总账会计组',
//             remark: '三级分类叶子节点3-1-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-1-3',
//             name: '三级分类3-1-3',
//             attr1: 'C35',
//             attr2: 54,
//             status: '启用',
//             createTime: '2025-03-05',
//             owner: '管理员C',
//             dept: '成本会计组',
//             remark: '三级分类叶子节点3-1-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-1-4',
//             name: '三级分类3-1-4',
//             attr1: 'C36',
//             attr2: 52,
//             status: '启用',
//             createTime: '2025-03-06',
//             owner: '管理员C',
//             dept: '成本会计组',
//             remark: '三级分类叶子节点3-1-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '3-2',
//         name: '二级分类3-2',
//         attr1: 'B10',
//         attr2: 72,
//         status: '禁用',
//         createTime: '2025-03-07',
//         owner: '管理员B',
//         dept: '出纳组',
//         remark: '二级分类子节点3-2',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '3-2-1',
//             name: '三级分类3-2-1',
//             attr1: 'C37',
//             attr2: 50,
//             status: '启用',
//             createTime: '2025-03-08',
//             owner: '管理员C',
//             dept: '现金出纳组',
//             remark: '三级分类叶子节点3-2-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-2-2',
//             name: '三级分类3-2-2',
//             attr1: 'C38',
//             attr2: 48,
//             status: '启用',
//             createTime: '2025-03-09',
//             owner: '管理员C',
//             dept: '现金出纳组',
//             remark: '三级分类叶子节点3-2-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-2-3',
//             name: '三级分类3-2-3',
//             attr1: 'C39',
//             attr2: 46,
//             status: '禁用',
//             createTime: '2025-03-10',
//             owner: '管理员C',
//             dept: '银行出纳组',
//             remark: '三级分类叶子节点3-2-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-2-4',
//             name: '三级分类3-2-4',
//             attr1: 'C40',
//             attr2: 44,
//             status: '启用',
//             createTime: '2025-03-11',
//             owner: '管理员C',
//             dept: '银行出纳组',
//             remark: '三级分类叶子节点3-2-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '3-3',
//         name: '二级分类3-3',
//         attr1: 'B11',
//         attr2: 70,
//         status: '启用',
//         createTime: '2025-03-12',
//         owner: '管理员B',
//         dept: '税务组',
//         remark: '二级分类子节点3-3',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '3-3-1',
//             name: '三级分类3-3-1',
//             attr1: 'C41',
//             attr2: 42,
//             status: '禁用',
//             createTime: '2025-03-13',
//             owner: '管理员C',
//             dept: '国税组',
//             remark: '三级分类叶子节点3-3-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-3-2',
//             name: '三级分类3-3-2',
//             attr1: 'C42',
//             attr2: 40,
//             status: '启用',
//             createTime: '2025-03-14',
//             owner: '管理员C',
//             dept: '国税组',
//             remark: '三级分类叶子节点3-3-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-3-3',
//             name: '三级分类3-3-3',
//             attr1: 'C43',
//             attr2: 38,
//             status: '启用',
//             createTime: '2025-03-15',
//             owner: '管理员C',
//             dept: '地税组',
//             remark: '三级分类叶子节点3-3-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-3-4',
//             name: '三级分类3-3-4',
//             attr1: 'C44',
//             attr2: 36,
//             status: '禁用',
//             createTime: '2025-03-16',
//             owner: '管理员C',
//             dept: '地税组',
//             remark: '三级分类叶子节点3-3-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '3-4',
//         name: '二级分类3-4',
//         attr1: 'B12',
//         attr2: 68,
//         status: '启用',
//         createTime: '2025-03-17',
//         owner: '管理员B',
//         dept: '审计组',
//         remark: '二级分类子节点3-4',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '3-4-1',
//             name: '三级分类3-4-1',
//             attr1: 'C45',
//             attr2: 34,
//             status: '启用',
//             createTime: '2025-03-18',
//             owner: '管理员C',
//             dept: '内部审计组',
//             remark: '三级分类叶子节点3-4-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-4-2',
//             name: '三级分类3-4-2',
//             attr1: 'C46',
//             attr2: 32,
//             status: '禁用',
//             createTime: '2025-03-19',
//             owner: '管理员C',
//             dept: '内部审计组',
//             remark: '三级分类叶子节点3-4-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-4-3',
//             name: '三级分类3-4-3',
//             attr1: 'C47',
//             attr2: 30,
//             status: '启用',
//             createTime: '2025-03-20',
//             owner: '管理员C',
//             dept: '外部审计组',
//             remark: '三级分类叶子节点3-4-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '3-4-4',
//             name: '三级分类3-4-4',
//             attr1: 'C48',
//             attr2: 28,
//             status: '启用',
//             createTime: '2025-03-21',
//             owner: '管理员C',
//             dept: '外部审计组',
//             remark: '三级分类叶子节点3-4-4',
//             operation: '编辑|删除'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: '4',
//     name: '一级分类4',
//     attr1: 'A4',
//     attr2: 94,
//     status: '启用',
//     createTime: '2025-04-01',
//     owner: '管理员A',
//     dept: '人事部',
//     remark: '一级分类主节点4',
//     operation: '编辑|删除',
//     children: [
//       {
//         id: '4-1',
//         name: '二级分类4-1',
//         attr1: 'B13',
//         attr2: 76,
//         status: '禁用',
//         createTime: '2025-04-02',
//         owner: '管理员B',
//         dept: '招聘组',
//         remark: '二级分类子节点4-1',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '4-1-1',
//             name: '三级分类4-1-1',
//             attr1: 'C49',
//             attr2: 58,
//             status: '启用',
//             createTime: '2025-04-03',
//             owner: '管理员C',
//             dept: '校园招聘组',
//             remark: '三级分类叶子节点4-1-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-1-2',
//             name: '三级分类4-1-2',
//             attr1: 'C50',
//             attr2: 56,
//             status: '启用',
//             createTime: '2025-04-04',
//             owner: '管理员C',
//             dept: '校园招聘组',
//             remark: '三级分类叶子节点4-1-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-1-3',
//             name: '三级分类4-1-3',
//             attr1: 'C51',
//             attr2: 54,
//             status: '禁用',
//             createTime: '2025-04-05',
//             owner: '管理员C',
//             dept: '社会招聘组',
//             remark: '三级分类叶子节点4-1-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-1-4',
//             name: '三级分类4-1-4',
//             attr1: 'C52',
//             attr2: 52,
//             status: '启用',
//             createTime: '2025-04-06',
//             owner: '管理员C',
//             dept: '社会招聘组',
//             remark: '三级分类叶子节点4-1-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '4-2',
//         name: '二级分类4-2',
//         attr1: 'B14',
//         attr2: 74,
//         status: '启用',
//         createTime: '2025-04-07',
//         owner: '管理员B',
//         dept: '培训组',
//         remark: '二级分类子节点4-2',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '4-2-1',
//             name: '三级分类4-2-1',
//             attr1: 'C53',
//             attr2: 50,
//             status: '禁用',
//             createTime: '2025-04-08',
//             owner: '管理员C',
//             dept: '新员工培训组',
//             remark: '三级分类叶子节点4-2-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-2-2',
//             name: '三级分类4-2-2',
//             attr1: 'C54',
//             attr2: 48,
//             status: '启用',
//             createTime: '2025-04-09',
//             owner: '管理员C',
//             dept: '新员工培训组',
//             remark: '三级分类叶子节点4-2-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-2-3',
//             name: '三级分类4-2-3',
//             attr1: 'C55',
//             attr2: 46,
//             status: '启用',
//             createTime: '2025-04-10',
//             owner: '管理员C',
//             dept: '老员工培训组',
//             remark: '三级分类叶子节点4-2-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-2-4',
//             name: '三级分类4-2-4',
//             attr1: 'C56',
//             attr2: 44,
//             status: '禁用',
//             createTime: '2025-04-11',
//             owner: '管理员C',
//             dept: '老员工培训组',
//             remark: '三级分类叶子节点4-2-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '4-3',
//         name: '二级分类4-3',
//         attr1: 'B15',
//         attr2: 72,
//         status: '启用',
//         createTime: '2025-04-12',
//         owner: '管理员B',
//         dept: '绩效组',
//         remark: '二级分类子节点4-3',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '4-3-1',
//             name: '三级分类4-3-1',
//             attr1: 'C57',
//             attr2: 42,
//             status: '启用',
//             createTime: '2025-04-13',
//             owner: '管理员C',
//             dept: 'KPI考核组',
//             remark: '三级分类叶子节点4-3-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-3-2',
//             name: '三级分类4-3-2',
//             attr1: 'C58',
//             attr2: 40,
//             status: '禁用',
//             createTime: '2025-04-14',
//             owner: '管理员C',
//             dept: 'KPI考核组',
//             remark: '三级分类叶子节点4-3-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-3-3',
//             name: '三级分类4-3-3',
//             attr1: 'C59',
//             attr2: 38,
//             status: '启用',
//             createTime: '2025-04-15',
//             owner: '管理员C',
//             dept: 'OKR考核组',
//             remark: '三级分类叶子节点4-3-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-3-4',
//             name: '三级分类4-3-4',
//             attr1: 'C60',
//             attr2: 36,
//             status: '启用',
//             createTime: '2025-04-16',
//             owner: '管理员C',
//             dept: 'OKR考核组',
//             remark: '三级分类叶子节点4-3-4',
//             operation: '编辑|删除'
//           }
//         ]
//       },
//       {
//         id: '4-4',
//         name: '二级分类4-4',
//         attr1: 'B16',
//         attr2: 70,
//         status: '禁用',
//         createTime: '2025-04-17',
//         owner: '管理员B',
//         dept: '员工关系组',
//         remark: '二级分类子节点4-4',
//         operation: '编辑|删除',
//         children: [
//           {
//             id: '4-4-1',
//             name: '三级分类4-4-1',
//             attr1: 'C61',
//             attr2: 34,
//             status: '启用',
//             createTime: '2025-04-18',
//             owner: '管理员C',
//             dept: '考勤组',
//             remark: '三级分类叶子节点4-4-1',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-4-2',
//             name: '三级分类4-4-2',
//             attr1: 'C62',
//             attr2: 32,
//             status: '启用',
//             createTime: '2025-04-19',
//             owner: '管理员C',
//             dept: '考勤组',
//             remark: '三级分类叶子节点4-4-2',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-4-3',
//             name: '三级分类4-4-3',
//             attr1: 'C63',
//             attr2: 30,
//             status: '禁用',
//             createTime: '2025-04-20',
//             owner: '管理员C',
//             dept: '福利组',
//             remark: '三级分类叶子节点4-4-3',
//             operation: '编辑|删除'
//           },
//           {
//             id: '4-4-4',
//             name: '三级分类4-4-4',
//             attr1: 'C64',
//             attr2: 28,
//             status: '启用',
//             createTime: '2025-04-21',
//             owner: '管理员C',
//             dept: '福利组',
//             remark: '三级分类叶子节点4-4-4',
//             operation: '编辑|删除'
//           }
//         ]
//       }
//     ]
//   }
// ];
const treeTableData = ref([])
const expandedRowKeys = reactive({
  data: [
    '031e13c829a34e0580e7c7a19168be6c',
    '573944d307d04c5f856a94dd3736b33a'
  ],
  rowDrag: false,
})
const loading = ref(false)
const fileList = ref([])
function aaaaa(a) {
  // expandedRowKeys.data.shift()
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  expandedRowKeys.rowDrag = !expandedRowKeys.rowDrag
}
function uploadEnd(res) {
  console.log({res});
  
}
setTimeout(() => {
  treeTableData.value = [
    {
      "createTime": 1764407333087,
      "createUserName": "admin",
      "createUserId": 1,
      "updateTime": 1764407333087,
      "updateUserName": "admin",
      "updateUserId": 1,
      "id": "031e13c829a34e0580e7c7a19168be6c",
      "parentId": "0",
      "dataYear": "2025",
      "dataMonth": "10",
      "serialNumber": null,
      "name": "速卖通一部",
      "sort": 1,
      "dataType": "dept",
      "gmvBaseTarget": 164.5,
      "gmvIncreaseTarget": 176.5,
      "gmvChallengeTarget": 224.5,
      "children": [
        {
          "createTime": 1764407333166,
          "createUserName": "admin",
          "createUserId": 1,
          "updateTime": 1764407333166,
          "updateUserName": "admin",
          "updateUserId": 1,
          "id": "1fe8dd7b6bea4812bb2532b3d56b8bb0",
          "parentId": "031e13c829a34e0580e7c7a19168be6c",
          "dataYear": "2025",
          "dataMonth": "10",
          "serialNumber": null,
          "name": "速卖通一部（一组）",
          "sort": 1,
          "dataType": "group",
          "gmvBaseTarget": 54,
          "gmvIncreaseTarget": 58,
          "gmvChallengeTarget": 74,
          "children": [
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "70dff72b953c4082a43dec20a6e6aa9e",
              "parentId": "1fe8dd7b6bea4812bb2532b3d56b8bb0",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "杨媛媛",
              "sort": 1,
              "dataType": "operator",
              "gmvBaseTarget": 16,
              "gmvIncreaseTarget": 17,
              "gmvChallengeTarget": 21
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "863971f008c647bcb1a232d501fe5ed3",
              "parentId": "1fe8dd7b6bea4812bb2532b3d56b8bb0",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "华艳琴",
              "sort": 2,
              "dataType": "operator",
              "gmvBaseTarget": 10,
              "gmvIncreaseTarget": 11,
              "gmvChallengeTarget": 15
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "d7eda62fc2284d2188d87e82cdbbb6bf",
              "parentId": "1fe8dd7b6bea4812bb2532b3d56b8bb0",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "杨贞",
              "sort": 3,
              "dataType": "operator",
              "gmvBaseTarget": 15,
              "gmvIncreaseTarget": 16,
              "gmvChallengeTarget": 20
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "dd7a2d3e89514ffdb91a8e117ea51301",
              "parentId": "1fe8dd7b6bea4812bb2532b3d56b8bb0",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "傅雪静",
              "sort": 4,
              "dataType": "operator",
              "gmvBaseTarget": 13,
              "gmvIncreaseTarget": 14,
              "gmvChallengeTarget": 18
            }
          ]
        },
        {
          "createTime": 1764407333166,
          "createUserName": "admin",
          "createUserId": 1,
          "updateTime": 1764407333166,
          "updateUserName": "admin",
          "updateUserId": 1,
          "id": "14045474f4b64cc79966f46f969a4aa6",
          "parentId": "031e13c829a34e0580e7c7a19168be6c",
          "dataYear": "2025",
          "dataMonth": "10",
          "serialNumber": null,
          "name": "速卖通一部（二组）",
          "sort": 2,
          "dataType": "group",
          "gmvBaseTarget": 40,
          "gmvIncreaseTarget": 43,
          "gmvChallengeTarget": 55,
          "children": [
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "7c0ee32cef1b4460949a4c166bced9d7",
              "parentId": "14045474f4b64cc79966f46f969a4aa6",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "余安微",
              "sort": 5,
              "dataType": "operator",
              "gmvBaseTarget": 15,
              "gmvIncreaseTarget": 16,
              "gmvChallengeTarget": 20
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "021c9a44d6874f8fbbb70ae589205bcb",
              "parentId": "14045474f4b64cc79966f46f969a4aa6",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "杨媛媛(代)",
              "sort": 6,
              "dataType": "operator",
              "gmvBaseTarget": 13,
              "gmvIncreaseTarget": 14,
              "gmvChallengeTarget": 18
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "8bea9aa64cb8469e9e724a37e9d70e27",
              "parentId": "14045474f4b64cc79966f46f969a4aa6",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "李核函",
              "sort": 7,
              "dataType": "operator",
              "gmvBaseTarget": 12,
              "gmvIncreaseTarget": 13,
              "gmvChallengeTarget": 17
            }
          ]
        },
        {
          "createTime": 1764407333166,
          "createUserName": "admin",
          "createUserId": 1,
          "updateTime": 1764407333166,
          "updateUserName": "admin",
          "updateUserId": 1,
          "id": "cff56f4b12b34a8cbf79c789d891f6ca",
          "parentId": "031e13c829a34e0580e7c7a19168be6c",
          "dataYear": "2025",
          "dataMonth": "10",
          "serialNumber": null,
          "name": "速卖通一部（三组）",
          "sort": 3,
          "dataType": "group",
          "gmvBaseTarget": 70.5,
          "gmvIncreaseTarget": 75.5,
          "gmvChallengeTarget": 95.5,
          "children": [
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "4587263b60314487af5130bcd07ac953",
              "parentId": "cff56f4b12b34a8cbf79c789d891f6ca",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "张杨",
              "sort": 8,
              "dataType": "operator",
              "gmvBaseTarget": 14,
              "gmvIncreaseTarget": 15,
              "gmvChallengeTarget": 19
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "1aef1ca9f4f54e4095923dc91c60f28e",
              "parentId": "cff56f4b12b34a8cbf79c789d891f6ca",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "刘梦丽",
              "sort": 9,
              "dataType": "operator",
              "gmvBaseTarget": 13,
              "gmvIncreaseTarget": 14,
              "gmvChallengeTarget": 18
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "667f93928508455db7fca30605b4a0e4",
              "parentId": "cff56f4b12b34a8cbf79c789d891f6ca",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "赵妍",
              "sort": 10,
              "dataType": "operator",
              "gmvBaseTarget": 14,
              "gmvIncreaseTarget": 15,
              "gmvChallengeTarget": 19
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "7f71f150b4a24ca28e1f38d3fb96086b",
              "parentId": "cff56f4b12b34a8cbf79c789d891f6ca",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "闵红艳",
              "sort": 11,
              "dataType": "operator",
              "gmvBaseTarget": 14.5,
              "gmvIncreaseTarget": 15.5,
              "gmvChallengeTarget": 19.5
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "74bcbf8883c74b5a8a823c8aa3343ed6",
              "parentId": "cff56f4b12b34a8cbf79c789d891f6ca",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "王泽佳",
              "sort": 12,
              "dataType": "operator",
              "gmvBaseTarget": 15,
              "gmvIncreaseTarget": 16,
              "gmvChallengeTarget": 20
            }
          ]
        }
      ]
    },
    {
      "createTime": 1764407333087,
      "createUserName": "admin",
      "createUserId": 1,
      "updateTime": 1764407333087,
      "updateUserName": "admin",
      "updateUserId": 1,
      "id": "573944d307d04c5f856a94dd3736b33a",
      "parentId": "0",
      "dataYear": "2025",
      "dataMonth": "10",
      "serialNumber": null,
      "name": "速卖通二部",
      "sort": 2,
      "dataType": "dept",
      "gmvBaseTarget": 157.5,
      "gmvIncreaseTarget": 166.5,
      "gmvChallengeTarget": 202.5,
      "children": [
        {
          "createTime": 1764407333166,
          "createUserName": "admin",
          "createUserId": 1,
          "updateTime": 1764407333166,
          "updateUserName": "admin",
          "updateUserId": 1,
          "id": "e788e47093ae42d89077c19b840c3dd3",
          "parentId": "573944d307d04c5f856a94dd3736b33a",
          "dataYear": "2025",
          "dataMonth": "10",
          "serialNumber": null,
          "name": "速卖通二部（一组）",
          "sort": 4,
          "dataType": "group",
          "gmvBaseTarget": 48,
          "gmvIncreaseTarget": 51,
          "gmvChallengeTarget": 63,
          "children": [
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "22d40c4bf47447179f17a9c90536e697",
              "parentId": "e788e47093ae42d89077c19b840c3dd3",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "刘欣欣",
              "sort": 13,
              "dataType": "operator",
              "gmvBaseTarget": 15.5,
              "gmvIncreaseTarget": 16.5,
              "gmvChallengeTarget": 20.5
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "d0aa91d416c74c28aa4afcbf6a04325e",
              "parentId": "e788e47093ae42d89077c19b840c3dd3",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "沈梦雨",
              "sort": 14,
              "dataType": "operator",
              "gmvBaseTarget": 16,
              "gmvIncreaseTarget": 17,
              "gmvChallengeTarget": 21
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "1845e513abff4ad290ad8a9256861238",
              "parentId": "e788e47093ae42d89077c19b840c3dd3",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "袁梦",
              "sort": 15,
              "dataType": "operator",
              "gmvBaseTarget": 16.5,
              "gmvIncreaseTarget": 17.5,
              "gmvChallengeTarget": 21.5
            }
          ]
        },
        {
          "createTime": 1764407333166,
          "createUserName": "admin",
          "createUserId": 1,
          "updateTime": 1764407333166,
          "updateUserName": "admin",
          "updateUserId": 1,
          "id": "c10e0d654ef2472b8d39ff2b0c7597bc",
          "parentId": "573944d307d04c5f856a94dd3736b33a",
          "dataYear": "2025",
          "dataMonth": "10",
          "serialNumber": null,
          "name": "速卖通二部（二组）",
          "sort": 5,
          "dataType": "group",
          "gmvBaseTarget": 52.5,
          "gmvIncreaseTarget": 55.5,
          "gmvChallengeTarget": 67.5,
          "children": [
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "cffeb96ecd89405982e0ca649aabc570",
              "parentId": "c10e0d654ef2472b8d39ff2b0c7597bc",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "罗晓搁",
              "sort": 16,
              "dataType": "operator",
              "gmvBaseTarget": 17,
              "gmvIncreaseTarget": 18,
              "gmvChallengeTarget": 22
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "e7db2f3f7f894a2da770a8d76d1588bf",
              "parentId": "c10e0d654ef2472b8d39ff2b0c7597bc",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "彭珍琪",
              "sort": 17,
              "dataType": "operator",
              "gmvBaseTarget": 17.5,
              "gmvIncreaseTarget": 18.5,
              "gmvChallengeTarget": 22.5
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "e0c38ec0bbc943b58de025b5e9088b64",
              "parentId": "c10e0d654ef2472b8d39ff2b0c7597bc",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "黄慧珍",
              "sort": 18,
              "dataType": "operator",
              "gmvBaseTarget": 18,
              "gmvIncreaseTarget": 19,
              "gmvChallengeTarget": 23
            }
          ]
        },
        {
          "createTime": 1764407333166,
          "createUserName": "admin",
          "createUserId": 1,
          "updateTime": 1764407333166,
          "updateUserName": "admin",
          "updateUserId": 1,
          "id": "298d997118a5459dbceecd87a1771b88",
          "parentId": "573944d307d04c5f856a94dd3736b33a",
          "dataYear": "2025",
          "dataMonth": "10",
          "serialNumber": null,
          "name": "速卖通二部（三组）",
          "sort": 6,
          "dataType": "group",
          "gmvBaseTarget": 57,
          "gmvIncreaseTarget": 60,
          "gmvChallengeTarget": 72,
          "children": [
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "b8fa5812b95c4c229a292998ab745bd3",
              "parentId": "298d997118a5459dbceecd87a1771b88",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "雷金萍",
              "sort": 19,
              "dataType": "operator",
              "gmvBaseTarget": 18.5,
              "gmvIncreaseTarget": 19.5,
              "gmvChallengeTarget": 23.5
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "52a0ce1a41b94816bbd92280c12ee37d",
              "parentId": "298d997118a5459dbceecd87a1771b88",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "胡妹",
              "sort": 20,
              "dataType": "operator",
              "gmvBaseTarget": 19,
              "gmvIncreaseTarget": 20,
              "gmvChallengeTarget": 24
            },
            {
              "createTime": 1764407333195,
              "createUserName": "admin",
              "createUserId": 1,
              "updateTime": 1764407333195,
              "updateUserName": "admin",
              "updateUserId": 1,
              "id": "c5be7334f9d24c04bfa3191278e1b5cc",
              "parentId": "298d997118a5459dbceecd87a1771b88",
              "dataYear": "2025",
              "dataMonth": "10",
              "serialNumber": null,
              "name": "吕杏花",
              "sort": 21,
              "dataType": "operator",
              "gmvBaseTarget": 19.5,
              "gmvIncreaseTarget": 20.5,
              "gmvChallengeTarget": 24.5
            }
          ]
        }
      ]
    }
  ];
}, 500);
function rowKeyFn(row, index) {
  // console.log({row, index});
  return row.id
}
function dragEnd({ node, parentNode, findParentChildren }) {
  // console.log({ node, parentNode, findParentChildren });
}
// 模拟树形表格数据（含层级、父节点标识）
const treeData = ref([
  {
    key: '1',
    name: '父节点1',
    children: [
      { key: '1-1', name: '子节点1-1', level: 1, parentKey: '1' },
      { key: '1-2', name: '子节点1-2', level: 1, parentKey: '1' },
      { key: '1-3', name: '子节点1-3', level: 1, parentKey: '1' },
    ],
    level: 0,
    parentKey: '',
  },
  {
    key: '2',
    name: '父节点2dfgdfgasdfgasdgasdfgasdgfsgsdgsdgsadgs',
    children: [
      { key: '2-1', name: '子节点2-1', level: 1, parentKey: '2' },
      {
        key: '2-2',
        name: '子节点2-2',
        level: 1,
        parentKey: '2',
        children: [
          { key: '2-2-1', name: '孙节点2-2-1', level: 2, parentKey: '2-2' },
          { key: '2-2-2', name: '孙节点2-2-2', level: 2, parentKey: '2-2' },
        ],
      },
    ],
    level: 0,
    parentKey: '',
  },
]);

// 表格列配置
const columns = ref([
  { title: '名称', dataIndex: 'name', key: 'name', width: 100 },
  { title: '层级', dataIndex: 'level', key: 'level', width: 200 },
  { title: '层级', dataIndex: 'sdgsdg', key: 'sdgsdg', width: 200 },
  { title: '层级', dataIndex: 'ergdfg', key: 'ergdfg', width: 200 },
  { title: '层级', dataIndex: 'er5sdfs', key: 'er5sdfs', width: 200 },
  { title: '层级', dataIndex: 'ertsdf', key: 'ertsdf', width: 200 },
]);
function rowClassNameFn(record, index) {
  // console.log({record, index});
  
  // 斑马纹设定
  // return (index % 2 === 1 ? '111' : '222');
};

</script>

<style scoped>
/* 拖拽样式优化 */
.ant-table-row {
  cursor: move;
}
.sortable-ghost {
  background-color: #f5f5f5;
}
</style>
