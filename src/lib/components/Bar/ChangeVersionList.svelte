<script lang="ts">
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import Menu from "@smui/menu";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import { GameVersionFactory } from "$lib/versions/GameVersionFactory";
  import { t } from "$lib/i18n/index.svelte";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";

  const gameVersion = getContext<GameVersionName>("gameVersion");
  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let selectedVersion: GameVersionName = $state(gameVersion);
  let open = $state(false);

  function handleChangeVersion(version: GameVersionName | undefined) {
    if (version) {
      let path = window.location.pathname.split("/").slice(2);
      window.location.href = `/${version}/${path.join("/")}`;
    }
    open = false;
  }
</script>

<div>
  <IconButton aria-label={t(`ui.changeVersion`)} onclick={() => (open = !open)}>
    <WarcraftIcon
      src={gameVersionFactory.iconProvider.getVersionIcon("56")}
      label={t(`ui.changeVersion`)}
    />
  </IconButton>
  <Menu bind:open>
    <List>
      {#each Object.values(GameVersionName) as version}
        <Item
          onclick={() => {
            handleChangeVersion(version);
          }}
          style={selectedVersion === version
            ? "background-color: var(--palette-success-dark);"
            : ""}
        >
          <WarcraftIcon
            src={GameVersionFactory.getContext(
              version
            ).iconProvider.getVersionIcon("56")}
            label={`version.${version}`}
          />
          <Text style={"margin: 20px"}>{t(`version.${version}`)}</Text>
        </Item>
      {/each}
    </List>
  </Menu>
</div>
