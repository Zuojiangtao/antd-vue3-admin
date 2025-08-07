import { defineComponent } from 'vue';
import { LayoutHeader, Dropdown, Menu, MenuItem, Avatar, Modal } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import type { CustomRender } from '../typings';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import './header.less';

export default defineComponent({
  name: 'GlobalHeader',
  props: {
    ...LayoutHeader.props,
  },
  setup() {
    const userStore = storeToRefs(useUserStore());
    const { userName, userAvatar, getRedirectUrl } = userStore;

    const handleLogout = (): void => {
      const modal = Modal.confirm();
      modal.update({
        title: '是否退出',
        okText: '退出登录',
        cancelText: '取消',
        onOk: () => {
          useUserStore()
            .Logout()
            .then(() => {
              window.location.href = getRedirectUrl.value;
              modal.destroy();
            });
        },
      });
    };

    return {
      userName,
      userAvatar,
      handleLogout,
    };
  },
  render() {
    const renderDropDownSlot = () => {
      return (
        <Menu>
          <MenuItem key={'1'} onClick={this.handleLogout}>
            退出登录
          </MenuItem>
        </Menu>
      );
    };

    const renderUserAvatar = (avatar: string): CustomRender => {
      if (avatar) {
        return <Avatar src={avatar} alt={'userAvatar'} />;
      } else {
        return <UserOutlined />;
      }
    };

    return (
      <LayoutHeader>
        <div class={'header-content'}>
          <div class={'header-right-content'}>
            <Dropdown
              getPopupContainer={triggerNode => triggerNode.parentNode.parentNode.parentNode}
              overlay={renderDropDownSlot()}
            >
              <div class={'content-avatar'}>
                {this.userName} {renderUserAvatar(this.userAvatar)}
              </div>
            </Dropdown>
          </div>
        </div>
      </LayoutHeader>
    );
  },
});
