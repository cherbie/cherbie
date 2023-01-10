<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  interface $$Props extends HTMLAttributes<HTMLElementTagNameMap["a"]> {
    selected?: boolean;
    href: string;
  }
  const { class: ctnClass, selected, ...props } = $$props as $$Props;
  $: selectedClass = selected
    ? "font-semibold text-sky-600 border-sky-600"
    : "font-normal text-slate-600 border-transparent";
</script>

<a
  href={props.href}
  class="flex justify-center border-b-2 items-center p-0 h-full {selectedClass} {ctnClass}"
>
  <span class="inline-block text-center px-3">
    <slot name="text" />
  </span>
</a>
