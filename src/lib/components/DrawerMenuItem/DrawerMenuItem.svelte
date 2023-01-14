<script lang="ts">
  import type { Icon as IconType } from "@steeze-ui/svelte-icon";
  import { Icon } from "@steeze-ui/svelte-icon";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  interface $$Props extends HTMLAnchorAttributes {
    icon?: IconType["src"];
    title: string;
  }
</script>

<a
  href={$$props.href}
  class="flex justify-start p-1 align-middle rounded font-normal text-slate-600 min-w-[150px] hover:bg-slate-100"
>
  {#if $$props.icon}
    <Icon
      src={$$props.icon}
      size="24"
      theme="outline"
      class="color-gray-900 mr-4"
    />
  {/if}
  <slot name="title">
    <span class="text-clip overflow-hidden text-left">{$$props.title}</span>
  </slot>
</a>
