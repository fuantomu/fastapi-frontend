<script lang="ts">
  import { goto } from "$app/navigation";
  import IngredientList from "$lib/components/IngredientList.svelte";
  import type { RecipeIngredient } from "$lib/types";
  import { v4 as uuidv4 } from "uuid";

  let ingredients: RecipeIngredient[] = $state([]);

  function handleGoBack() {
    goto("/recipes");
  }

  let ingredientError: string | null = $state(null);
  function handleErrors(error: string | null) {
    ingredientError = error;
  }
</script>

<h1>Test</h1>
<form method="POST">
  <input id="id" type="hidden" name="id" value={uuidv4()} />
  <input id="name" name="name" type="text" placeholder="Name" required />
  <input
    id="description"
    name="description"
    type="text"
    placeholder="Description (Optional)"
  />
  <IngredientList {ingredients} onErrorChange={handleErrors} />
  <button type="submit" disabled={ingredientError ? true : false}>Save</button>
</form>
<button onclick={() => handleGoBack()}> Go back </button>
