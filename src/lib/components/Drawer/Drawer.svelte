<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { MarkGithub } from "@steeze-ui/octicons";
  import { drawerStore } from ".";
  import { DropdownMenuItem } from "$lib/components";

  interface $$Props extends HTMLAttributes<HTMLElementTagNameMap["div"]> {}

  let isVisible = false;
  drawerStore.subscribe((state) => {
    isVisible = state.visible;
  });
</script>

<div
  class="absolute top-0 right-5 {isVisible ? 'flex' : 'hidden'} {$$props.class}"
>
  <div class="border border-slate-300 rounded-md p-2 m-2 flex-col bg-white justify-start max-w-[300px] shadow-lg">
    <DropdownMenuItem icon={MarkGithub} title="GitHub" href="https://github.com/cherbie" />
  </div>
</div>
