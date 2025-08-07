import { ref, reactive } from 'vue';

export function useForm(formSearch) {
  const formRef = ref(null);
  const form = reactive({});

  // 提交处理
  const handleSubmit = (bytes: BufferSource) => {
    formRef.value
      .validate(bytes)
      .then(() => {
        formSearch(form);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  // 重置表单
  const resetForm = () => {
    form.value = {};
    formRef.value && formRef.value.resetFields();
  };

  return {
    formRef,
    form,
    handleSubmit,
    resetForm,
  };
}
