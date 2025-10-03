<script lang="ts">
  import { goto } from "$app/navigation";

  function handleGoto(page: string) {
    switch (page) {
      case "Characters":
        goto("/characters");
        break;
      case "Guilds":
        goto("/guilds");
        break;
    }
  }
</script>

<h1>Welcome to the Armory</h1>
<button onclick={() => handleGoto("Characters")}> Go to Characters </button>
<button onclick={() => handleGoto("Guilds")}> Go to Guilds </button>
