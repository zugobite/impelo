<template>
  <main class="fallback">
    <h1>Impelo</h1>
    <p>The requested page could not be found.</p>
    <NuxtLink to="/">Return home</NuxtLink>
  </main>
</template>

<style>
:root {
  color-scheme: light;
  font-family: system-ui, sans-serif;
}

body {
  margin: 0;
}

.fallback {
  display: grid;
  min-height: 100vh;
  place-content: center;
  padding: 2rem;
  text-align: center;
}
</style>
