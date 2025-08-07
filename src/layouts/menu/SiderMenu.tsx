import type { PropType } from 'vue';
import type { MenuInfo } from 'ant-design-vue';
import { defineComponent, toRefs, ref, computed, h, watchEffect } from 'vue';
import { Menu } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import type { MenuDataItem } from '../typings';

import './siderMenu.less';

export default defineComponent({
  name: 'SiderMenu',
  props: {
    ...Menu.props,
    menuData: {
      type: Array as PropType<MenuDataItem[]>,
      default: () => [],
    },
  },
  emit: ['click'],
  setup(props, { emit }) {
    const collapsed = inject('collapsed');

    const { menuData } = toRefs(props);

    const router = useRouter();
    const selectedKeys = ref([router.currentRoute.path]);

    const menuProps = computed(() => ({
      ...props,
      selectedKeys: selectedKeys.value,
    }));

    const routesToMenus = (routes, menus = []) => {
      for (const route of routes) {
        if (!route.children || !route.children.length) {
          if (route.hidden) continue;
          menus.push({
            key: route.path,
            label: route.meta?.title,
            title: route.meta?.title,
            icon: route.meta?.icon && h(route.meta?.icon),
          });
        } else {
          if (route.hidden) continue;
          menus.push({
            key: route.path,
            label: route.meta?.title,
            title: route.meta?.title,
            icon: route.meta?.icon && h(route.meta?.icon),
            children: routesToMenus(route.children, []),
          });
        }
      }
      return menus;
    };

    const menus: MenuInfo[] = routesToMenus(menuData.value, []);

    const handleClickMenu = (args: MenuInfo) => {
      selectedKeys.value = [args.key];
      emit('click', args);
    };

    watchEffect(
      () => {
        const route = router.currentRoute.value;
        selectedKeys.value = [route.path];
      },
      {
        flush: 'post', // 使侦听器延迟到组件渲染之后再执行
      },
    );

    return {
      collapsed,
      menuProps,
      menus,
      // renderMenu,
      handleClickMenu,
    };
  },
  render() {
    if (!this.menus.length) {
      return null;
    } else {
      return <Menu {...this.menuProps} items={this.menus} onClick={this.handleClickMenu} />;
    }
  },
});
