<script lang="ts">
  import type { RecipeIngredient } from "$lib/types";

  export let ingredients: RecipeIngredient[] = [];
  let error: string | null = null;

  function addItem() {
    ingredients = [...ingredients, { name: "", quantity: "" }];
  }
  function deleteItem(index: number, name: string) {
    ingredients = ingredients.filter((_, i) => i !== index);
    checkDuplicate(index, name);
  }

  export let onErrorChange: (error: string | null) => void = () => {};

  function checkDuplicate(currentIndex: number, name: string) {
    error = ingredients.some(
      (ingredient, i) =>
        i !== currentIndex && ingredient.name.trim().toLowerCase() === name
    )
      ? `"${ingredients[currentIndex].name}" already exists.`
      : null;
    onErrorChange(error);
  }

  function handleInput(index: number) {
    const name = ingredients[index].name.trim().toLowerCase();

    checkDuplicate(index, name);
  }
</script>

<ul id="ingredientList">
  {#each ingredients as ingredient, i}
    <li>
      <input
        id="ingredient_name"
        name="ingredient_name"
        type="text"
        bind:value={ingredient.name}
        required
        oninput={() => handleInput(i)}
      />

      :
      <input
        id="ingredient_quantity"
        name="ingredient_quantity"
        type="text"
        bind:value={ingredient.quantity}
        required
      />
      <button type="button" onclick={() => deleteItem(i, ingredient.name)}
        >X</button
      >
    </li>
  {/each}
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <br />
  <button type="button" onclick={() => addItem()}>Add Ingredient</button>
</ul>
