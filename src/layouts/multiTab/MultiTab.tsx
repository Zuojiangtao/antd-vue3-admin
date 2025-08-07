import { defineComponent, watch, watchEffect } from 'vue';
import { Dropdown, Menu, MenuItem, message, TabPane, Tabs } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useMultiTabStore } from '@/stores/multi-tab';
import { useKeepAliveStore } from '@/stores/keep-alive';

import './index.less';

export default defineComponent({
  name: 'MultiTab',
  setup() {
    const router = useRouter();
    const multiTabState = useMultiTabStore();
    const { fullPathList, tabPages: pages, activePath: activeKey } = storeToRefs(multiTabState);

    const keepAliveStore = useKeepAliveStore();

    watch(
      () => router.currentRoute.value,
      route => {
        const { fullPath } = route;
        activeKey.value !== fullPath && multiTabState.setActivePath(fullPath);
        if (!fullPathList.value.includes(fullPath)) {
          multiTabState.pushMultiTabPages(route);
          multiTabState.pushFullPath(fullPath);
        }
        keepAliveStore.setKeepAliveWithRoute(route);
      },
      {
        immediate: true,
        deep: 1,
      },
    );

    watchEffect(
      () => {
        router.push({ path: activeKey.value });
      },
      {
        flush: 'post', // 使侦听器延迟到组件渲染之后再执行
      },
    );

    function remove(activePath) {
      multiTabState.removeFullPath(activePath); // 移除多页签关闭的路由
      keepAliveStore.removeKeepAlive(activePath); // 移除多页签对应路由keep-alive缓存
      if (activePath !== activeKey.value) return;
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!fullPathList.value.includes(activePath)) {
        multiTabState.setActivePath(fullPathList.value[fullPathList.value.length - 1]);
      }
    }

    // content menu event
    function onEdit(targetKey: string, action: 'add' | 'remove') {
      if (action === 'remove') {
        remove(targetKey);
      }
    }
    function onChange(activeKey: string) {
      router.push({ path: activeKey });
    }
    function closeMenuClick(key, route) {
      switch (key) {
        case 'closeThat':
          closeThat(route);
          break;
        case 'closeLeft':
          closeLeft(route);
          break;
        case 'closeRight':
          closeRight(route);
          break;
        case 'closeAll':
          closeAll(route);
          break;
        default:
          message.info('点击了关闭事件');
      }
    }
    function closeThat(e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (fullPathList.value.length > 1) {
        remove(e);
      } else {
        message.info('这是最后一个标签了, 无法被关闭');
      }
    }
    function closeLeft(e) {
      const currentIndex = fullPathList.value.indexOf(e);
      if (currentIndex > -1) {
        fullPathList.value.forEach((item, index) => {
          if (index < currentIndex) {
            remove(item);
          }
        });
      } else {
        message.info('左侧没有标签');
      }
    }
    function closeRight(e) {
      const currentIndex = fullPathList.value.indexOf(e);
      if (currentIndex < fullPathList.value.length - 1) {
        fullPathList.value.forEach((item, index) => {
          if (index > currentIndex) {
            remove(item);
          }
        });
      } else {
        message.info('右侧没有标签');
      }
    }
    function closeAll(e) {
      const currentIndex = fullPathList.value.indexOf(e);
      fullPathList.value.forEach((item, index) => {
        if (index !== currentIndex) {
          remove(item);
        }
      });
    }

    function renderTabPaneMenu(e) {
      return (
        <Menu onClick={({ key }) => closeMenuClick(key, e)}>
          <MenuItem key={'closeThat'}> 关闭当前标签 </MenuItem>
          <MenuItem key={'closeRight'}> 关闭右侧 </MenuItem>
          <MenuItem key={'closeLeft'}> 关闭左侧 </MenuItem>
          <MenuItem key={'closeAll'}> 关闭全部 </MenuItem>
        </Menu>
      );
    }

    function renderTabPane(route) {
      const { meta, fullPath } = route;
      const menu = renderTabPaneMenu(fullPath);
      return (
        <Dropdown overlay={menu} trigger={['contextmenu']} getPopupContainer={() => document.body}>
          <span style={{ userSelect: 'none' }}>{meta.title}</span>
        </Dropdown>
      );
    }

    return {
      pages,
      activeKey,
      remove,
      onEdit,
      onChange,
      // closeMenuClick,
      closeThat,
      closeLeft,
      closeRight,
      closeAll,
      // renderTabPaneMenu,
      renderTabPane,
    };
  },
  render(props) {
    const { pages, activeKey, onEdit, onChange, renderTabPane } = props;

    const tabPanes = pages.map(page => {
      return <TabPane key={page.fullPath} tab={renderTabPane(page)} />;
    });

    const tabsProps = reactive({
      hideAdd: true,
      type: pages.length > 1 ? 'editable-card' : 'card',
      activeKey,
      tabBarGutter: 10,
      tabBarStyle: { margin: 0, paddingLeft: '16px', paddingRight: '16px' },
    });

    return (
      <div class={['ant-pro-multi-tab', 'global-header']}>
        <Tabs
          hideAdd={tabsProps.hideAdd}
          type={tabsProps.type}
          activeKey={tabsProps.activeKey}
          tabBarGutter={tabsProps.tabBarGutter}
          tabBarStyle={tabsProps.tabBarStyle}
          onChange={onChange}
          onEdit={onEdit}
        >
          {tabPanes}
        </Tabs>
      </div>
    );
  },
});
