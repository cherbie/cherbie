<div
  class="flex justify-between items-center gap-3 px-6 py-4 font-sans text-gray-700"
>
  <div class="w-[84px]" />
  <h1
    class="font-extrabold text-2xl flex-grow flex-shrink basis-auto justify-center items-center text-center whitespace-nowrap overflow-hidden text-ellipsis m-0"
  >
    <slot name="topbar-title">Title</slot>
  </h1>
  <div class="flex flex-shrink-0 gap-2 min-w-[84px]">
    <slot name="topbar-buttons" />
  </div>
</div>
