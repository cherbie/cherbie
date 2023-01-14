<script lang="ts">
  import type { HTMLButtonAttributes, EventHandler } from "svelte/elements";
  import { Icon } from "@steeze-ui/svelte-icon";
  import type { IconSource } from "@steeze-ui/svelte-icon/types";

  interface $$Props extends HTMLButtonAttributes {
    icon?: IconSource;
    onClick?: EventHandler;
  }
</script>

<button
  class="border rounded-full p-2 border-slate-600 {$$props.class}"
  on:click={$$props.onClick}
>
  {#if $$slots.default}
    <slot />
  {:else if $$props.icon}
    <Icon src={$$props.icon} size="20" theme="outline" class="color-gray-900" />
  {/if}
</button>
