import { ref, reactive } from 'vue';

export function useFormModel(visible: boolean, initialForm = {}, emit) {
  // ref
  const ruleFormRef = ref(null);
  // 表单数据
  const formState = reactive({ ...initialForm });
  // 表单类型 - 0: 初始化；1：新建；2：编辑；
  const formStatus = ref<number>(-1);
  // 表单加载状态
  const confirmLoading = ref<boolean>(false);
  // 表单布局
  const formItemLayout = reactive({
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  });

  // 标题
  const title = computed(() => {
    const status = unref(formStatus);
    if (status === 0) {
      return '新建';
    } else {
      return '编辑';
    }
  });

  // 提交处理
  const handleSubmit = (bytes: BufferSource) => {
    confirmLoading.value = true;
    ruleFormRef.value
      .validate(bytes)
      .then(() => {
        emit('submit', { ...initialForm }, formStatus.value);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  // 重置表单
  const resetForm = () => {
    // initialForm = {};
    formStatus.value = -1;
    ruleFormRef.value && ruleFormRef.value.resetFields();
  };

  // 取消提交
  const handleCancel = () => {
    visible.value = false;
    resetForm();
    confirmLoading.value = false;
  };

  return {
    ruleFormRef,
    formState,
    formStatus,
    confirmLoading,
    formItemLayout,
    title,
    handleSubmit,
    resetForm,
    handleCancel,
  };
}
