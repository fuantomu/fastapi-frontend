<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";

  const id = page.url.pathname;

  let { data }: PageProps = $props();

  function handleGoBack() {
    goto(`${id}`.replace("/delete", ""));
  }
</script>

<h1>Test</h1>
{#if data.item}
  <form method="POST">
    Are you sure you want to delete the guild '{data.item.name}'?
    <input id="id" type="hidden" name="id" value={data.item.id} />
    <button type="submit">Delete</button>
  </form>
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}
<br />
<button onclick={() => handleGoBack()}> Go back </button>
