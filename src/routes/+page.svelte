<script lang="ts">
  import { goto } from "$app/navigation";

  function handleGoto(page: string) {
    switch (page) {
      case "Recipes":
        goto("/recipes");
        break;
      case "Ingredients":
        goto("/ingredients");
        break;
    }
  }
</script>

<h1>Welcome to the CookBook</h1>
<button onclick={() => handleGoto("Recipes")}> Go to Recipes </button>
<button onclick={() => handleGoto("Ingredients")}> Go to Ingredients </button>
