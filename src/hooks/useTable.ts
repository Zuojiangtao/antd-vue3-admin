import { ref, reactive } from 'vue';
import type { PaginationType } from 'ant-design-vue';
import { qiankunWindow } from 'vite-plugin-qiankun/es/helper';

export function useTable() {
  // 表格
  const data = ref<object[]>([]);
  const loading = ref<boolean>(false);

  // 分页
  const pagination: PaginationType = reactive({
    current: 1,
    pageSize: 20,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: total => `共${total}项`, // 显示总数
    pageSizeOptions: ['5', '10', '20', '50', '100'], // 分页选项
  });

  // 行选择
  const rowSelection = reactive({
    selectedRows: [],
    selectedRowKeys: [],
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      rowSelection.selectedRowKeys = selectedRowKeys;
      rowSelection.selectedRows = selectedRows;
    },
    onSelect: (record, selected, selectedRows) => {
      rowSelection.selectedRows = selectedRows;
    },
    onSelectAll: (selected, selectedRows) => {
      rowSelection.selectedRows = selectedRows;
    },
  });

  // 动态计算表格滚动高度 - 不分页
  const calcTableScrollYHeightWithoutPagination = computed(() => {
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      return document.body.clientHeight - 154;
    } else {
      return document.body.clientHeight - 245;
    }
  });
  // 动态计算表格滚动高度 - 分页
  const calcTableScrollYHeightWithPagination = computed(() => {
    if (qiankunWindow.__POWERED_BY_QIANKUN__) {
      return document.body.clientHeight - 218;
    } else {
      return document.body.clientHeight - 309;
    }
  });

  return {
    data,
    loading,
    pagination,
    rowSelection,
    calcTableScrollYHeightWithoutPagination,
    calcTableScrollYHeightWithPagination,
  };
}
