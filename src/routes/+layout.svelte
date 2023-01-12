<script>
  import {
    TopbarButton,
    TopbarContent,
    SectionBar,
    MenuItem,
  } from "$lib/components";
  import { Bell, ThreeBars } from "@steeze-ui/octicons";
  import "../app.css";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="use-credentials"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=fallback"
    rel="stylesheet"
  />
</svelte:head>

<div>
  <div class="flex flex-col">
    <!-- Main Menu -->
    <div class="fixed w-full">
      <TopbarContent>
        <a href="/" slot="topbar-title">Clayton Herbst</a>
        <svelte:fragment slot="topbar-buttons">
          <TopbarButton class="border-slate-600" icon={Bell} />
          <TopbarButton class="border-slate-600" icon={ThreeBars} />
        </svelte:fragment>
      </TopbarContent>
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
  </div>

  <!-- Main Content -->
  <slot />
</div>
