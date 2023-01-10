<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { Icon } from "@steeze-ui/svelte-icon";
  import type { IconSource } from "@steeze-ui/svelte-icon/types";

  interface $$Props extends HTMLAttributes<HTMLElementTagNameMap["button"]> {
    icon?: IconSource;
  }
</script>

<button class="border rounded-full p-2 border-inherit {$$props.class}">
  {#if $$slots.default}
    <slot />
  {:else if $$props?.icon}
    <Icon src={$$props.icon} size="20" theme="outline" class="color-gray-900" />
  {/if}
</button>
