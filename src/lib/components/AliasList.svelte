<script lang="ts">

  export let aliasList: string[] = [];
  let error: string | null = null;

  function addItem() {
    aliasList = [...aliasList, ""];
  }
  function deleteItem(index: number, name: string) {
    aliasList = aliasList.filter((_, i) => i !== index);
    checkDuplicate(index, name);
  }

  export let onErrorChange: (error: string | null) => void = () => {};

  function checkDuplicate(currentIndex: number, name: string) {
    error = aliasList.some(
      (alias, i) =>
        i !== currentIndex && alias.trim().toLowerCase() === name
    )
      ? `"${aliasList[currentIndex]}" already exists.`
      : null;
    onErrorChange(error);
  }

  function handleInput(index: number) {
    const name = aliasList[index].trim().toLowerCase();

    checkDuplicate(index, name);
  }
</script>

<ul id="aliasList">
  {#each aliasList as alias, i}
    <li>
      <input
        id="alias_name"
        name="alias_name"
        type="text"
        bind:value={alias}
        required
        oninput={() => handleInput(i)}
      />
      <button type="button" onclick={() => deleteItem(i, alias)}
        >X</button
      >
    </li>
  {/each}
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <br />
  <button type="button" onclick={() => addItem()}>Add Alias</button>
</ul>
