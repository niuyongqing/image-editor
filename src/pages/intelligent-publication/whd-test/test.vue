<template>
  <div class="ui-demo-page">
    <!-- 页面标题区 -->
    <div class="ui-demo-page__header">
      <h1 class="ui-demo-page__title">Vue 3 Demo</h1>
      <p class="ui-demo-page__desc">基础演示</p>
    </div>
    <!-- 一、基础设计规范模块 -->
    <a-card
      class="ui-demo-page__module"
      bordered
    >
      <div
        slot="title"
        class="ui-demo-card__title"
      >
        1. 基础设计规范
      </div>
      <!-- 1.1 色彩规范 -->
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">1.1 色彩规范（主色/辅助色/中性色）</h3>
        <a-row
          gutter="16"
          class="ui-demo-color-group"
        >
          <!-- 主色&辅助色 -->
          <a-col
            :span="4"
            class="ui-demo-color-item"
          >
            <div
              class="ui-demo-color-item__block"
              style="background-color: #1677ff"
            ></div>
            <p class="ui-demo-color-item__name">主色 #1677ff</p>
          </a-col>
          <a-col
            :span="4"
            class="ui-demo-color-item"
          >
            <div
              class="ui-demo-color-item__block"
              style="background-color: #52c41a"
            ></div>
            <p class="ui-demo-color-item__name">成功 #52c41a</p>
          </a-col>
          <a-col
            :span="4"
            class="ui-demo-color-item"
          >
            <div
              class="ui-demo-color-item__block"
              style="background-color: #faad14"
            ></div>
            <p class="ui-demo-color-item__name">警告 #faad14</p>
          </a-col>
          <a-col
            :span="4"
            class="ui-demo-color-item"
          >
            <div
              class="ui-demo-color-item__block"
              style="background-color: #ff4d4f"
            ></div>
            <p class="ui-demo-color-item__name">错误 #ff4d4f</p>
          </a-col>
        </a-row>
        <a-row gutter="16">
          <!-- 中性色 -->
          <a-col
            :span="4"
            class="ui-demo-color-item"
            style="margin-top: 16px"
          >
            <div
              class="ui-demo-color-item__block"
              style="background-color: #1f2329"
            ></div>
            <p class="ui-demo-color-item__name">主文字 #1f2329</p>
          </a-col>
          <a-col
            :span="4"
            class="ui-demo-color-item"
            style="margin-top: 16px"
          >
            <div
              class="ui-demo-color-item__block"
              style="background-color: #4e5969"
            ></div>
            <p class="ui-demo-color-item__name">次文字 #4e5969</p>
          </a-col>
        </a-row>
      </div>
      <!-- 1.2 字体规范 -->
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">1.2 字体规范（18px/16px/14px/12px）</h3>
        <a-row
          gutter="24"
          class="ui-demo-font-group"
        >
          <a-col
            :span="6"
            class="ui-demo-font-item"
          >
            <p class="ui-demo-font-item__text ui-demo-font-item__text--18">页面标题（18px/600粗体）</p>
          </a-col>
          <a-col
            :span="6"
            class="ui-demo-font-item"
          >
            <p class="ui-demo-font-item__text ui-demo-font-item__text--16">卡片标题（16px/600粗体）</p>
          </a-col>
          <a-col
            :span="6"
            class="ui-demo-font-item"
          >
            <p class="ui-demo-font-item__text ui-demo-font-item__text--14">正文文字（14px/常规）</p>
          </a-col>
          <a-col
            :span="6"
            class="ui-demo-font-item"
          >
            <p class="ui-demo-font-item__text ui-demo-font-item__text--12">辅助文字（12px/常规）</p>
          </a-col>
        </a-row>
      </div>
      <!-- 1.3 间距规范（8px网格） -->
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">1.3 间距规范（8px网格）</h3>
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }"
        >
          <div
            :style="{
              width: '4px',
              height: '4px',
              backgroundColor: '#1677ff',
              borderRadius: '50%',
            }"
          ></div>
          <span>4px（半网格）</span>
          <div
            :style="{
              width: '8px',
              height: '8px',
              backgroundColor: '#1677ff',
              borderRadius: '2px',
            }"
          ></div>
          <span>8px（基础网格）</span>
          <div
            :style="{
              width: '16px',
              height: '8px',
              backgroundColor: '#1677ff',
              borderRadius: '2px',
            }"
          ></div>
          <span>16px（2×网格）</span>
          <div
            :style="{
              width: '24px',
              height: '8px',
              backgroundColor: '#1677ff',
              borderRadius: '2px',
            }"
          ></div>
          <span>24px（3×网格）</span>
          <div
            :style="{
              width: '32px',
              height: '8px',
              backgroundColor: '#1677ff',
              borderRadius: '2px',
            }"
          ></div>
          <span>32px（4×网格）</span>
        </div>
      </div>
    </a-card>
    <!-- 二、组件使用规范模块 -->
    <a-card
      class="ui-demo-page__module"
      bordered
    >
      <div
        slot="title"
        class="ui-demo-card__title"
      >
        2. 组件使用规范
      </div>
      <!-- 2.1 表单组件 -->
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">2.1 表单（Form）- 标签右对齐(栅格布局?)</h3>
        <a-form
          :model="componentDemo.formData.form"
          labelAlign="right"
          labelWidth="100px"
          layout="inline"
          colon
          class="ui-demo-form"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="componentDemo.formData.rules.username"
          >
            <a-input
              v-model:value="componentDemo.formData.form.username"
              placeholder="请输入用户名"
            />
          </a-form-item>
          <a-form-item
            label="手机号"
            name="phone"
            :rules="componentDemo.formData.rules.phone"
          >
            <a-input
              v-model:value="componentDemo.formData.form.phone"
              placeholder="请输入手机号"
              :maxLength="11"
            />
          </a-form-item>
          <a-form-item
            label="状态"
            name="status"
            :rules="componentDemo.formData.rules.status"
          >
            <a-select
              v-model:value="componentDemo.formData.form.status"
              placeholder="请选择状态"
              allowClear
              style="width: 180px"
            >
              <a-option value="1">启用</a-option>
              <a-option value="0">禁用</a-option>
            </a-select>
          </a-form-item>
          <div class="ui-demo-form__button-col">
            <a-space size="small">
              <a-button
                type="primary"
                @click="handleFormSubmit"
              >
                提交
              </a-button>
              <a-button
                type="default"
                @click="handleFormReset"
              >
                重置
              </a-button>
            </a-space>
          </div>
        </a-form>
        <br />
        <a-form
          :model="componentDemo.formData.form"
          labelAlign="right"
          labelWidth="100px"
          class="ui-demo-form-horizontal"
        >
          <a-form-item
            label="用户名"
            name="username"
            :rules="componentDemo.formData.rules.username"
          >
            <a-input
              v-model:value="componentDemo.formData.form.username"
              placeholder="请输入用户名"
            />
          </a-form-item>
          <a-form-item
            label="手机号"
            name="phone"
            :rules="componentDemo.formData.rules.phone"
          >
            <a-input
              v-model:value="componentDemo.formData.form.phone"
              placeholder="请输入手机号"
              :maxLength="11"
            />
          </a-form-item>
          <a-form-item
            label="状态"
            name="status"
            :rules="componentDemo.formData.rules.status"
          >
            <a-select
              v-model:value="componentDemo.formData.form.status"
              placeholder="请选择状态"
              allowClear
              style="width: 180px"
            >
              <a-option value="1">启用</a-option>
              <a-option value="0">禁用</a-option>
            </a-select>
          </a-form-item>
          <div class="ui-demo-form__button-col">
            <a-space size="small">
              <a-button
                type="primary"
                @click="handleFormSubmit"
              >
                提交
              </a-button>
              <a-button
                type="default"
                @click="handleFormReset"
              >
                重置
              </a-button>
            </a-space>
          </div>
        </a-form>
      </div>
      <!-- 2.2 表格组件 -->
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">2.2 表格（Table）- 边框&操作列规范</h3>
        <a-table
          :data-source="componentDemo.tableData.list"
          :columns="componentDemo.tableData.columns"
          :bordered="true"
          :row-height="48"
          row-key="id"
          :pagination="false"
          class="ui-demo-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'operation'">
              <a-space size="small">
                <a-button
                  type="text"
                  size="small"
                  @click="handleTableView(record)"
                >
                  查看
                </a-button>
                <a-button size="small">编辑</a-button>
                <a-popconfirm
                  title="确定删除该数据吗？"
                  @confirm="() => handleTableDelete(record.id)"
                >
                  <a-button
                    type="text"
                    size="small"
                    danger
                  >
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <a-tag :color="componentDemo.tableData.statesList.find(i => i.val === record[column.dataIndex]).type">
                {{ componentDemo.tableData.statesList.find(i => i.val === record[column.dataIndex]).label }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </div>
      <!-- 2.1 按钮组件 -->
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">2.3 按钮（Button）</h3>
        <div :style="{ marginBottom: '16px' }">
          <p :style="{ fontSize: '12px', color: '#4e5969', marginBottom: '8px' }">类型规范</p>
          <a-space :size="8">
            <a-button
              type="primary"
              size="middle"
            >
              主要操作
            </a-button>
            <a-button
              type="default"
              size="middle"
            >
              次要操作
            </a-button>
            <a-button
              danger
              size="middle"
            >
              危险操作
            </a-button>
            <a-button
              type="text"
              size="middle"
            >
              文字按钮
            </a-button>
          </a-space>
        </div>
        <div>
          <p :style="{ fontSize: '12px', color: '#4e5969', marginBottom: '8px' }">尺寸规范（表格内用small）</p>
          <a-space :size="8">
            <a-button
              type="primary"
              size="small"
            >
              小尺寸（表格内）
            </a-button>
            <a-button
              type="text"
              size="small"
            >
              小尺寸（表格内）
            </a-button>
            <a-button size="small">小尺寸（表格内）</a-button>
            <a-button
              type="primary"
              size="middle"
            >
              中尺寸（默认）
            </a-button>
          </a-space>
        </div>
      </div>
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">2.4 标签（Tag）</h3>
        <div>
          <a-tag color="success">成功</a-tag>
          <a-tag color="processing">等待</a-tag>
          <a-tag color="error">错误</a-tag>
          <a-tag color="warning">警告</a-tag>
          <a-tag color="default">默认</a-tag>
        </div>
        <br />
        <p class="ui-demo-color-item__name">成功：已上架、正在售卖等已经开始正常工作的状态</p>
        <p class="ui-demo-color-item__name">等待：待提交、待申请等草案阶段</p>
        <p class="ui-demo-color-item__name">错误：已驳回、已删除等有错误的，严禁进入正常流程</p>
        <p class="ui-demo-color-item__name">警告：等待审核等需要谨慎操作的状态</p>
        <p class="ui-demo-color-item__name">默认：被下架的正常商品等正常流程但是现在不启用的状态</p>
      </div>
    </a-card>
    <!-- 三、列表页布局规范模块 -->
    <a-card
      class="ui-demo-page__module"
      bordered
    >
      <div
        slot="title"
        class="ui-demo-card__title"
      >
        3. 页面布局规范（列表页示例,栅格布局）
      </div>
      <div class="ui-demo-list-page">
        <!-- 3.1 列表页标题区 -->
        <div class="ui-demo-list-page__header">
          <h3 class="ui-demo-list-page__title">用户管理列表</h3>
          <a-button
            type="primary"
            @click="handleListAdd"
          >
            <plus-outlined />
            新增用户
          </a-button>
        </div>
        <!-- 3.2 列表页搜索区 -->
        <a-card
          :bordered="true"
          class="ui-demo-list-page__search-card"
        >
          <a-form
            :model="listPage.searchForm"
            labelAlign="right"
            labelWidth="100px"
            class="ui-demo-list-page__search-form"
          >
            <a-row :gutter="[16, 0]">
              <a-col :xl="4">
                <a-form-item
                  label="用户名"
                  name="username"
                >
                  <a-input
                    v-model:value="listPage.searchForm.username"
                    placeholder="请输入用户名"
                    allowClear
                  />
                </a-form-item>
              </a-col>
              <a-col :xl="4">
                <a-form-item
                  label="部门"
                  name="dept"
                >
                  <a-select
                    v-model:value="listPage.searchForm.dept"
                    placeholder="请选择部门"
                    allowClear
                  >
                    <a-option value="tech">技术部</a-option>
                    <a-option value="operation">运营部</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xl="4">
                <a-form-item
                  label="状态"
                  name="status"
                >
                  <a-select
                    v-model:value="listPage.searchForm.status"
                    placeholder="请选择状态"
                    allowClear
                  >
                    <a-option value="1">启用</a-option>
                    <a-option value="0">禁用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :xl="24">
                <a-form-item
                  class="tradeName-item"
                  label="模糊查找"
                  name="tradeName"
                >
                  <a-form-item-rest>
                    <div
                      flex
                      gap-10px
                    >
                      <a-input
                        v-model:value="listPage.searchForm.productName"
                        placeholder="商品名"
                      ></a-input>
                      <a-input
                        v-model:value="listPage.searchForm.skuCode"
                        placeholder="SKU"
                      ></a-input>
                      <a-input
                        v-model:value="listPage.searchForm.skuCode"
                        placeholder="SKU"
                      ></a-input>
                    </div>
                  </a-form-item-rest>
                </a-form-item>
              </a-col>
              <a-col
                :xl="24"
                class="ui-demo-list-page__search-button"
              >
                <a-space size="small">
                  <a-button
                    type="primary"
                    @click="handleListSearch"
                  >
                    查询
                  </a-button>
                  <a-button
                    type="default"
                    @click="handleListReset"
                  >
                    重置
                  </a-button>
                </a-space>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
        <!-- 3.3 列表页数据区+分页 -->
        <a-card
          :bordered="true"
          class="ui-demo-list-page__data-card"
        >
          <div class="ui-demo-list-toolBox">
            <a-space size="small">
              <a-button
                type="primary"
                @click="handleListAdd"
              >
                <plus-outlined />
                新增用户
              </a-button>
              <a-button
                type="primary"
                danger
                @click="handleListAdd"
              >
                <DeleteOutlined />
                删除
              </a-button>
              <a-button
                type="text"
                @click="handleListAdd"
              >
                <CloudDownloadOutlined />
                下载
              </a-button>
            </a-space>
            <a-space size="small">
              <a-button
                type="primary"
                @click="handleListAdd"
              >
                <plus-outlined />
                表格设置
              </a-button>
              <a-button
                type="primary"
                @click="handleListAdd"
              >
                <plus-outlined />
                隐藏/显示列
              </a-button>
              <a-button
                type="primary"
                danger
                @click="handleListAdd"
              >
                <plus-outlined />
                重置表格设置
              </a-button>
            </a-space>
          </div>
          <a-table
            :data-source="listPage.tableData"
            :columns="listPage.tableColumns"
            :pagination="false"
            row-key="id"
          />
          <div class="ui-demo-list-page__pagination">
            <a-pagination
              :current="listPage.pagination.current"
              :page-size="listPage.pagination.pageSize"
              :total="listPage.pagination.total"
              show-quick-jumper
              :page-size-options="[10, 20, 30, 40, 50]"
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
            />
            <a-pagination
              :current="listPage.pagination.current"
              :page-size="listPage.pagination.pageSize"
              :total="listPage.pagination.total"
              show-quick-jumper
              :page-size-options="[10, 20, 30, 40, 50]"
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
            />
            <a-pagination
              :current="listPage.pagination.current"
              :page-size="listPage.pagination.pageSize"
              :total="listPage.pagination.total"
              show-quick-jumper
              :page-size-options="[10, 20, 30, 40, 50]"
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
            />
            <a-pagination
              :current="listPage.pagination.current"
              :page-size="listPage.pagination.pageSize"
              :total="listPage.pagination.total"
              show-quick-jumper
              :page-size-options="[10, 20, 30, 40, 50]"
              @change="handlePageChange"
              @showSizeChange="handleSizeChange"
            ></a-pagination>
          </div>
        </a-card>
      </div>
    </a-card>
    <!-- 四、反馈组件规范模块 -->
    <a-card
      class="ui-demo-page__module"
      bordered
    >
      <div
        slot="title"
        class="ui-demo-card__title"
      >
        4. 反馈组件规范
      </div>
      <div class="ui-demo-section">
        <h3 class="ui-demo-section__title">4.1 消息提示/弹窗</h3>
        <div class="ui-demo-feedback-group">
          <a-space size="16">
            <a-button
              type="primary"
              @click="handleShowmessage"
              style="margin-right: 8px"
            >
              显示消息提示
            </a-button>
            <a-button
              type="default"
              @click="handleShowModal"
            >
              打开弹窗
            </a-button>
          </a-space>
        </div>
        <!-- 弹窗实例 -->
        <a-modal
          v-model:open="feedback.modalOpen"
          :title="feedback.modalTitle"
          width="70%"
          :mask-closable="false"
        >
          <p>标准弹窗（宽度70%）</p>
          <p>用于表单编辑、详情查看等场景</p>
          <template #footer>
            <a-space size="small">
              <a-button
                type="default"
                @click="feedback.modalOpen = false"
              >
                取消
              </a-button>
              <a-button
                type="primary"
                @click="handleModalConfirm"
              >
                确定
              </a-button>
            </a-space>
          </template>
        </a-modal>
      </div>
    </a-card>
  </div>
</template>

<script setup>
/**
 * 模块拆分说明：
 * 1. 每个功能模块单独使用 reactive 包裹
 * 2. 避免顶层大 reactive 导致的多层 .value 访问
 * 3. 模块内数据嵌套不超过3层，保持响应式性能
 */
import { CloudDownloadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { reactive } from 'vue';

// 1. 基础设计规范模块（无交互，仅展示）
const basicSpec = reactive({});
const loadingFlag = ref(true);
// 2. 组件示例模块
const componentDemo = reactive({
  // 表单数据（嵌套2层：formData → form/rules）
  formData: {
    form: {
      username: '',
      phone: '',
      status: '',
    },
    rules: {
      // username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
      phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur',
        },
      ],
      status: [{ required: true, message: '请选择状态', trigger: 'change' }],
    },
  },
  // 表格数据（嵌套2层：tableData → list/columns）
  tableData: {
    list: [
      { id: '1', name: '张三', age: 28, status: 1, createTime: '2024-01-01' },
      { id: '2', name: '李四', age: 32, status: 2, createTime: '2024-02-15' },
      { id: '3', name: '王五', age: 25, status: 3, createTime: '2024-03-20' },
      { id: '4', name: '赵六', age: 25, status: 4, createTime: '2024-03-20' },
      { id: '5', name: '冯七', age: 25, status: 5, createTime: '2024-03-20' },
    ],
    columns: [
      { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
      { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
      { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
      },
      { title: '操作', dataIndex: 'operation', key: 'operation', width: 180 },
    ],
    statesList: [
      { label: '已上架', val: 1, type: 'success' },
      { label: '待提交', val: 2, type: 'processing' },
      { label: '已删除', val: 3, type: 'error' },
      { label: '待审核', val: 4, type: 'warning' },
      { label: '已下架', val: 5, type: 'default' },
    ],
  },
});
let a = 'true';
let b = a ? 1 : 2;
[].forEach(item => {});

// 3. 列表页布局模块
const listPage = reactive({
  // 搜索表单（嵌套1层）
  searchForm: {
    username: '',
    dept: '',
    status: '',
    productName: '',
    skuCode: '',
  },
  // 表格数据（嵌套1层）
  tableData: [
    {
      id: '1',
      username: 'admin',
      dept: '技术部',
      role: '超级管理员',
      status: '启用',
    },
    {
      id: '2',
      username: 'editor',
      dept: '运营部',
      role: '编辑',
      status: '启用',
    },
    {
      id: '3',
      username: 'viewer',
      dept: '产品部',
      role: '查看者',
      status: '禁用',
    },
  ],
  tableColumns: [
    { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
    { title: '部门', dataIndex: 'dept', key: 'dept', width: 150 },
    { title: '角色', dataIndex: 'role', key: 'role', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    { title: '操作', dataIndex: 'operation', key: 'operation', width: 180 },
  ],
  // 分页数据（嵌套1层）
  pagination: {
    current: 1,
    pageSize: 10,
    total: 300,
  },
});

// 4. 反馈组件模块
const feedback = reactive({
  modalOpen: false,
  modalTitle: '标准大弹窗（70%）',
});

// —— 表单相关方法 ——
function handleFormSubmit() {
  // 直接访问模块属性，无需 .value
  console.log('表单提交数据：', componentDemo.formData.form);
  message.success('表单提交成功');
}

function handleFormReset() {
  // 重置表单时直接操作 reactive 对象属性
  componentDemo.formData.form = {
    username: '',
    phone: '',
    status: '',
  };
}

// —— 表格相关方法 ——
function handleTableView(record) {
  message.info(`查看：${record.name}`);
}

function handleTableEdit(record) {
  message.info(`编辑：${record.name}`);
}

function handleTableDelete(id) {
  // 直接操作表格数据（reactive 数组支持响应式修改）
  componentDemo.tableData.list = componentDemo.tableData.list.filter(item => item.id !== id);
  message.success('删除成功');
}

// —— 列表页相关方法 ——
function handleListAdd() {
  message.info('打开新增用户弹窗');
}

function handleListSearch() {
  console.log('搜索参数：', listPage.searchForm);
  message.success('执行查询');
}

function handleListReset() {
  listPage.searchForm = {
    username: '',
    dept: '',
    status: '',
  };
}

function handlePageChange(current) {
  listPage.pagination.current = current;
}

function handleSizeChange(current, pageSize) {
  listPage.pagination.pageSize = pageSize;
  listPage.pagination.current = 1;
}

// —— 反馈组件相关方法 ——
function handleShowmessage() {
  message.success('消息提示（2秒后关闭）', 2);
}

function handleShowModal() {
  feedback.modalOpen = true;
}

function handleModalConfirm() {
  feedback.modalOpen = false;
  message.success('弹窗确认操作');
}
</script>

<style scoped lang="less">
/* BEM命名规范：block__element--modifier */
.ui-demo-page {
  padding: 24px;
  background-color: #fafafa;
  min-height: calc(100vh - 64px);
  text-align: left;

  :deep(.ant-form-item-label) {
    width: 100px;
  }

  :deep(.ant-form-item-control-input-content) {
    text-align: left;
  }

  :deep(.ant-select-selector) {
    width: 180px;
  }

  :deep(.ant-input) {
    width: 180px;
  }
}

/* 页面标题区 */
.ui-demo-page__header {
  margin-bottom: 24px;
}

.ui-demo-page__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 8px;
}

.ui-demo-page__desc {
  font-size: 14px;
  color: #4e5969;
}

/* 模块卡片 */
.ui-demo-page__module {
  margin-bottom: 24px;
}

/* 卡片标题 */
.ui-demo-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

/* 章节样式 */
.ui-demo-section {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  margin-top: 16px;

  .ui-demo-form-horizontal {
    width: 400px;
  }
}

.ui-demo-section:first-child {
  margin-top: 0;
}

.ui-demo-section__title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 16px;
}

/* 色彩示例 */
.ui-demo-color-group {
  margin-top: 8px;
}

.ui-demo-color-item {
  text-align: center;
}

.ui-demo-color-item__block {
  width: 100%;
  height: 60px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.ui-demo-color-item__name {
  font-size: 12px;
  color: #4e5969;
}

/* 字体示例 */
.ui-demo-font-group {
  margin-top: 8px;
}

.ui-demo-font-item__text {
  line-height: 1.57;
  color: #1f2329;
}

.ui-demo-font-item__text--18 {
  font-size: 18px;
  font-weight: 600;
}

.ui-demo-font-item__text--16 {
  font-size: 16px;
  font-weight: 600;
}

.ui-demo-font-item__text--14 {
  font-size: 14px;
}

.ui-demo-font-item__text--12 {
  font-size: 12px;
  color: #86909c;
}

/* 间距示例 */
.ui-demo-space-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.ui-demo-space-item {
  height: 24px;
  background-color: #1677ff;
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}

/* 表单样式 */
.ui-demo-form__button-col {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

/* 列表页样式 */
.ui-demo-list-page {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;

  .ui-demo-list-toolBox {
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }
}

.ui-demo-list-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ui-demo-list-page__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.ui-demo-list-page__search-card {
  margin-bottom: 16px;
  padding: 16px;
}

.ui-demo-list-page__search-button {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.ui-demo-list-page__pagination {
  margin-top: 16px;
  // text-align: right;
  display: flex;
  justify-content: flex-end;

  :deep(.ant-select-selector) {
    width: 100px !important;
    text-align: left;
  }
}

/* 反馈组件样式 */
.ui-demo-feedback__modal-content {
  font-size: 14px;
  color: #4e5969;
  line-height: 1.57;
}

.ui-demo-feedback__modal-content p {
  margin-bottom: 8px;
}

.ui-demo-feedback__modal-content p:last-child {
  margin-bottom: 0;
}

/* 第三方组件穿透样式（按规范用:deep()） */
:deep(.a-modal-header) {
  border-bottom: 1px solid #e8e8e8;
}

:deep(.a-pagination-options-size-changer) {
  margin-left: 8px;
}

/* 保持原有样式规范，此处省略重复样式 */
.ui-demo-page {
  padding: 24px;
  background-color: #fafafa;
  min-height: calc(100vh - 64px);
}

.ui-demo-page__module {
  margin-bottom: 24px;
}

.ui-demo-section {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  margin-top: 16px;
}

/* 其他样式保持BEM规范 */
</style>
