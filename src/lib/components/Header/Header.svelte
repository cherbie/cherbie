<script>
  import {
    TopbarButton,
    TopbarContent,
    SectionBar,
    MenuItem,
    HamburgerMenu,
    Drawer,
  } from "$lib/components";
  import { Bell } from "@steeze-ui/octicons";
</script>

<div class="fixed w-full">
  <TopbarContent>
    <a href="/" slot="topbar-title" class="text-2xl">Clayton Herbst</a>
    <svelte:fragment slot="topbar-buttons">
      <TopbarButton icon={Bell} />
      <HamburgerMenu />
    </svelte:fragment>
  </TopbarContent>
  <Drawer class=" top-[52px] z-10" />
  <SectionBar class="relative h-12 flex justify-center pl-1">
    <nav class="flex justify-center items-center h-full gap-3">
      <MenuItem href="/" selected>
        <svelte:fragment slot="text">Home</svelte:fragment>
      </MenuItem>
      <MenuItem href="/about">
        <svelte:fragment slot="text">About</svelte:fragment>
      </MenuItem>
    </nav>
  </SectionBar>
</div>
<div id="spacer" class="h-[120px]" />
