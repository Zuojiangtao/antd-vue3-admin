import { ref, watch, onMounted, onActivated } from 'vue';
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/core';
// import type { AxiosPromise } from 'axios';
import { useTable } from '@/hooks/useTable';

// interface CurdMethod {
//   fetch?: AxiosPromise<Function>;
//   add?: AxiosPromise<Function>;
//   del?: AxiosPromise<Function>;
//   edit?: AxiosPromise<Function>;
// }

interface TableOptionsType {
  immediate?: boolean;
  hasPagination?: boolean;
}

export function useCurd(
  curdMethod,
  params: object,
  options: TableOptionsType = { immediate: true, hasPagination: true },
) {
  // modelRef - list curd formModel ref名称固定为 ‘formModelRef’
  const formModelRef = ref(null);

  // 查询
  const fuzzyContent = ref('');
  // const paramsRef = toRefs(params);

  // 是否第一次加载 - 在使用keep-alive时保证请求列表数据接口函数只执行一次
  const hasMounted = ref<boolean>(false);

  const { data, loading, pagination } = useTable();

  // 请求数据的参数
  const getQueryParams = computed(() => {
    if (options.hasPagination) {
      return {
        pageNo: pagination.current,
        size: pagination.pageSize,
        query: {
          fuzzyContent: fuzzyContent.value ?? undefined,
          params,
        },
      };
    } else {
      return params;
    }
  });

  /**
   * 通用的提示封装
   */
  const submitSuccessNotify = () => message.success('提交成功', 2);
  const submitFailNotify = () => message.error('提交失败', 2);
  const addSuccessNotify = () => message.success('新增成功', 2);
  const addFailNotify = () => message.error('新增失败', 2);
  const editSuccessNotify = () => message.success('编辑成功', 2);
  const editFailNotify = () => message.error('编辑失败', 2);
  const delSuccessNotify = () => message.success('删除成功', 2);
  const delFailNotify = () => message.error('删除失败', 2);

  /**
   * 获取列表
   * */
  const fetchMethod = async () => {
    loading.value = true;
    try {
      const res = await curdMethod.fetch(getQueryParams.value);
      if (options.hasPagination) {
        data.value = res.data.list;
        pagination.total = +res.data.total;
      } else {
        data.value = res.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };
  /**
   * 新增方法
   */
  const addMethod = async values => {
    console.log('新增表单提交form数据::' + JSON.stringify(values));
    loading.value = true;
    try {
      const res = await curdMethod.add(values);
      if (res.code === 0) {
        cancel();
        addSuccessNotify();
        await fetchMethod();
      } else {
        message.error(res.message, 2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };
  /**
   * 通用的删除
   */
  const delMethod = async id => {
    try {
      const res = await curdMethod.del(id);
      if (res.code === 0) {
        delChangePage(undefined);
        delSuccessNotify();
        await fetchMethod();
      } else {
        message.error(res.message, 2);
      }
    } catch (e) {
      console.error(e);
    }
  };
  /**
   * 通用的编辑方法
   */
  const editMethod = async values => {
    console.log('编辑表单提交form数据::' + JSON.stringify(values));
    loading.value = true;
    try {
      const res = await curdMethod.edit({ ...values });
      if (res.code === 0) {
        cancel();
        editSuccessNotify();
        await fetchMethod();
      } else {
        message.error(res.message, 2);
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const cancel = () => {
    formModelRef.value && formModelRef.value.close();
  };
  // 预防删除最后一页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
  const delChangePage = (size: number | undefined) => {
    if (size === undefined) {
      size = 1;
    }
    if (pagination.total === size && pagination.current > 1) {
      pagination.current--;
    }
  };

  /**
   * 显示删除提示弹窗
   */
  const [modal, contextHolder] = Modal.useModal();
  const showDelTableFormDialog = (id: string): void => {
    modal.confirm({
      title: '删除',
      content: '确定删除该信息?',
      closable: true,
      onOk() {
        console.log(id);
        delMethod(id);
      },
      onCancel() {},
    });
  };

  /**
   * 提交
   */
  const submitMethod = async (values, status) => {
    await [addMethod, editMethod][status](values);
  };

  // 参数变化自动加载（带防抖）
  const debounceLoad = useDebounceFn(fetchMethod, 250);
  watch(() => params, debounceLoad, { deep: true });
  watch(() => fuzzyContent.value, debounceLoad);

  // 分页变化
  const handlePageChange = ({ current, pageSize }) => {
    pagination.current = current;
    pagination.pageSize = pageSize;
    fetchMethod();
  };

  onMounted(() => {
    // 立即执行首次加载
    if (options.immediate) fetchMethod();
  });

  onActivated(() => {
    if (hasMounted.value) {
      fetchMethod();
    } else {
      hasMounted.value = true;
    }
  });

  return {
    // 属性
    formModelRef,
    fuzzyContent,
    data,
    loading,
    pagination,
    // 显示状态
    submitSuccessNotify,
    submitFailNotify,
    addSuccessNotify,
    addFailNotify,
    editSuccessNotify,
    editFailNotify,
    delSuccessNotify,
    delFailNotify,
    // 方法
    fetchMethod,
    addMethod,
    delMethod,
    editMethod,
    submitMethod,
    handlePageChange,
    showDelTableFormDialog,
    // modal获取上下文专用标签，有使用modal且使用ref指定的页面都应该引入
    contextHolder,
  };
}
