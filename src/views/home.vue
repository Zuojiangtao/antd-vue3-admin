<template>
  <h4>Mouse: {{ x }} x {{ y }} {{ title }}</h4>
</template>

<script lang="ts" setup>
  const { x, y } = useMouse();

  const title = useTitle('VueUse Set title');
</script>
