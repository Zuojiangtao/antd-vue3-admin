import type { Slot, VNode, VNodeChild, Component } from 'vue';

// Node
export type VueNode =
  | Slot
  | VNodeChild
  | VNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...props: any[]) => Slot)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...props: any[]) => VNode)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...args: any[]) => VNode)
  | VNode[]
  | JSX.Element
  | string
  | null
  | undefined;

export interface MetaRecord {
  title?: string;
  hidden?: boolean;
  icon?: string | Component;
  permission?: string[];
}

export interface MenuDataItem {
  path: string;
  name?: string | symbol;
  meta?: MetaRecord;
  redirect?: string;
  children?: MenuDataItem[];
  component?: Component;
}

export type CustomRender = VueNode;
export type WithFalse<T> = T | false;
export type ProProps = Record<never, never>;
export type HeaderRender = WithFalse<(props: ProProps) => CustomRender>;
