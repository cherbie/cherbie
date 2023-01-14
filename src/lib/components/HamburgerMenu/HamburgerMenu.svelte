<script lang="ts">
  export const open = false;
  import TopbarButton from "$lib/components/TopbarButton/TopbarButton.svelte";
  import { drawerStore } from "$lib/components/Drawer";
  import { ThreeBars } from "@steeze-ui/octicons";
  import type { HTMLAttributes } from "svelte/elements";

  interface $$Props extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
  }

  drawerStore.set({ visible: open });

  const toggleDrawer = () =>
    drawerStore.update(({ visible, ...state }) => ({
      ...state,
      visible: !visible,
    }));
</script>

<TopbarButton
  icon={ThreeBars}
  class="border-slate-600"
  onClick={toggleDrawer}
/>
