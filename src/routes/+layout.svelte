<script>
  import { Header } from "$lib/components";
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

<Header />

<!-- Main Content -->
<slot />
