<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import type { Recipe, RecipeIngredient } from "$lib/types";
  import IngredientList from "$lib/components/IngredientList.svelte";

  const id = page.url.pathname;
  let { data }: PageProps = $props();
  let ingredients: RecipeIngredient[] = $state(data.item?.ingredients ?? []);
  let recipe: Recipe | null = $state(data.item ?? null);
  let edit: Boolean = $state(false);

  function handleGoBack() {
    goto("/recipes");
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }
  function handleEdit() {
    edit = !edit;
    ingredients = data.item?.ingredients ?? [];
    ingredientError = null;
  }

  let ingredientError: string | null = $state(null);
  function handleErrors(error: string | null) {
    ingredientError = error;
  }
</script>

<h1>Test</h1>
{#if recipe}
  {#if edit}
    <h2>Edit</h2>
    <form method="POST">
      <input id="id" type="hidden" name="id" value={recipe.id} />
      <input
        id="name"
        name="name"
        type="text"
        value={recipe.name}
        required
      />
      <input
        id="description"
        name="description"
        type="text"
        value={recipe.description}
      />
      {#if ingredients}
        <IngredientList {ingredients} onErrorChange={handleErrors} />
      {/if}
      <button type="submit" disabled={ingredientError ? true : false}
        >Save</button
      >
      <button type="reset" onclick={() => handleEdit()}>Cancel</button>
    </form>
  {:else}
    <h2>Show</h2>
    {recipe.name}
    {recipe.description}
    {#if ingredients}
      <ul>
        {#each ingredients as ingredient}
          <li>
            {ingredient.name} : {ingredient.quantity}
          </li>
        {/each}
      </ul>
    {/if}
    <button onclick={() => handleEdit()}>Edit</button>
    <button onclick={() => handleDelete()}>Delete Recipe </button>
  {/if}
{:else if data.error}
  <p>Error Loading</p>
{:else}
  <p>Loading</p>
{/if}

<br />
<button onclick={() => handleGoBack()}> Go back </button>
