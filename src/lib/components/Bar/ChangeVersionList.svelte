<script lang="ts">
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import Menu from "@smui/menu";
  import List, { Item, Text } from "@smui/list";
  import { GameVersionFactory } from "$lib/versions/GameVersionFactory";
  import { t } from "$lib/i18n/index.svelte";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let selectedVersion: GameVersionName = $state(
    gameVersionFactory.gameVersion.getName()
  );
  let open = $state(false);

  function handleChangeVersion(version: GameVersionName | undefined) {
    if (version) {
      let path = window.location.pathname.split("/").slice(2);
      window.location.href = `/${version}/${path.join("/")}`;
    }
    open = false;
  }
</script>

<div style="width: 112px; height: 56px; margin: 0; align-self: center;">
  <button class="image-button" onclick={() => (open = !open)}>
    <img
      style="width: fit-content; height: 56px"
      src="/image/expansion/gamelogo_{gameVersionFactory.gameVersion.getName()}.png"
      alt={t(`version.${gameVersionFactory.gameVersion.getName()}`)}
    />
  </button>
  <Menu bind:open>
    <List>
      {#each Object.values(GameVersionName) as version}
        <Item
          onclick={() => {
            handleChangeVersion(version);
          }}
          style={selectedVersion === version
            ? "background-color: var(--palette-success-dark); padding: 10px"
            : "padding: 10px"}
        >
          <img
            style="width: fit-content; height: 56px"
            src="/image/expansion/gamelogo_{version}.png"
            alt={t(`version.${gameVersionFactory.gameVersion.getName()}`)}
          />
          <Text style={"margin: 20px"}>{t(`version.${version}`)}</Text>
        </Item>
      {/each}
    </List>
  </Menu>
</div>

<style>
  .image-button {
    position: relative;
    display: inline-block;
    border: none;
    padding: 0;
    cursor: pointer;
    background: transparent;
  }
</style>
