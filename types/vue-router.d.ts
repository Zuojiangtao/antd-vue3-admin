export {};

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    // title
    title: string;
    // icon
    icon?: string;
    // orderNo
    orderNo?: number;
    // dynamic router level.
    dynamicLevel?: number;
    // dynamic router real route path (For performance).
    realPath?: string;
    // Whether to ignore permissions
    ignoreAuth?: boolean;
    // keepAlive
    keepAlive?: boolean;
    // Is it fixed on tab
    affix?: boolean;
    // iframe src
    iframeSrc?: string;
    // current page transition
    transitionName?: string;
    // Carrying parameters
    carryParam?: boolean;
    // Used internally to mark single-level menus
    single?: boolean;
    // Currently active menu
    currentActiveMenu?: string;
    // type
    routerType?: 'router' | 'iframe' | 'link' | unknown;
    // only build for Menu
    ignoreRoute?: boolean;
    // Never show in tab
    hideTab?: boolean;
    // Never show in menu
    hideInMenu?: boolean;
    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean;
    // Hide submenu
    hideChildrenInMenu?: boolean;
    // Hide path for children
    hidePathForChildren?: boolean;
  }

  interface RouteItem {
    path: string;
    component: any;
    meta: RouteMeta;
    name?: string;
    alias?: string | string[];
    redirect?: string;
    caseSensitive?: boolean;
    children?: RouteItem[];
  }
}
