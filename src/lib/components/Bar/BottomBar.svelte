<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import ChangeVersionList from "./ChangeVersionList.svelte";
  import { t } from "$lib/i18n/index.svelte";
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";

  const gameVersion = getContext<GameVersionName>("gameVersion");
</script>

<div >
  <BottomAppBar variant="static" color={"secondary"} >
    <Section>
      <Wrapper>
        <button class="image-button" style="width: 32px; height: 32px" onclick={() =>
            window.open("https://github.com/fuantomu/fastapi-frontend/issues")}>
          <img
            style="width: 32px; height: 32px"
            src="/image/icon_bug.png"
            alt={t(`ui.reportBug`)}
          />
        </button>
        <Tooltip yPos="above">{t(`ui.reportBug`)}</Tooltip>
      </Wrapper>
    </Section>
    <Section>
      <div style="width: 300px; height: 56px; align-self: center; border: 1px solid black;">
      <button class="image-button" style="width: 100%; height:100%;  color: var(--ui-colour-quest)" type="button" onclick={() => goto(`/${gameVersion}/armory/characters`)} title={t("ui.armory")}>
        {t("ui.armory")}
      </button>
      </div>
    </Section>
    <Section>
      <div style="width: 300px; height: 56px; align-self: center; border: 1px solid black;">
      <button class="image-button" style="width: 100%; height:100%; color: var(--ui-colour-guild)" type="button" onclick={() => goto(`/${gameVersion}/guilds`)} title={t("ui.guild")}>
        {t("ui.guild")}
      </button>
      </div>
    </Section>

    <Section >
      <Wrapper>
        <ChangeVersionList></ChangeVersionList>
      </Wrapper>
    </Section>
  </BottomAppBar>
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
