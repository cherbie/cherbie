import { writable } from "svelte/store";

export type DrawerStore = {
  visible: boolean;
};

export const drawerStore = writable<DrawerStore>({ visible: false });
