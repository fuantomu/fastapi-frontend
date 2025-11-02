<script lang="ts">
  import BottomAppBar, { Section } from "@smui-extra/bottom-app-bar";
  import Tooltip, { Wrapper } from "@smui/tooltip";
  import ChangeVersionList from "./ChangeVersionList.svelte";
  import { t } from "$lib/i18n/index.svelte";
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import type { GameVersionName } from "$lib/versions/GameVersion";
  import type { Account } from "$lib/types";

  const gameVersion = getContext<GameVersionName>("gameVersion");
  let activePage: string = $state(getActivePage());
  let accountState = getContext<Account>("accountState");

  function getActivePage() {
    if (window.location.href.includes("armory")) {
      return "armory";
    }
    if (window.location.href.includes("guilds")) {
      return "guilds";
    }
    if (window.location.href.includes("planner")) {
      return "planner";
    }
    if (window.location.href.includes("history")) {
      return "history";
    }
    if (window.location.href.includes("absence")) {
      return "absence";
    }
    if (window.location.href.includes("options")) {
      return "options";
    }
    return "";
  }
</script>

<div style="margin-top: var(--bottom-bar-size, 70px);">
  <BottomAppBar variant="static" color="secondary">
    <Section
      style="display:flex; align-items: center; justify-content: space-between;"
    >
      <Wrapper>
        <button
          class="image-button"
          style="width: 32px; height: 32px"
          onclick={() =>
            window.open("https://github.com/fuantomu/fastapi-frontend/issues")}
        >
          <img
            style="width: 32px; height: 32px"
            src="/image/ui/icon_bug.png"
            alt={t(`ui.reportBug`)}
          />
        </button>
        <Tooltip yPos="above">{t(`ui.reportBug`)}</Tooltip>
      </Wrapper>

      <button
        class="image-button"
        style="width: 32px; height: 32px"
        onclick={() => {
          goto(window.location.href.split("/").slice(0, -1).join("/"));
        }}
      >
        <img
          style="width: 32px; height: 32px"
          src="/image/ui/icon_back.png"
          alt={t(`ui.goBackPage`)}
        />
      </button>
    </Section>

    <Section>
      <div
        class="section-div"
        style={activePage === "armory"
          ? `background-color: var(--game-colour-${gameVersion})`
          : ""}
      >
        <button
          class="image-button"
          style="width: 100%; height:100%;  color: var(--ui-colour-quest)"
          type="button"
          onclick={() => {
            goto(`/${gameVersion}/armory/characters`);
            activePage = "armory";
          }}
          title={t("ui.armory")}
        >
          <div class="bottom-div">
            <img
              style="width: 32px; height: 32px"
              src="/image/ui/icon_armory.png"
              alt={t(`ui.armory`)}
            />
            {t("ui.armory")}
          </div>
        </button>
      </div>
    </Section>
    <Section>
      <div
        class="section-div"
        style={activePage === "guilds"
          ? `background-color: var(--game-colour-${gameVersion})`
          : ""}
      >
        <button
          class="image-button"
          style="width: 100%; height:100%; color: var(--ui-colour-guild)"
          type="button"
          onclick={() => {
            goto(`/${gameVersion}/guilds`);
            activePage = "guilds";
          }}
          title={t("ui.guild")}
        >
          <div class="bottom-div">
            <img
              style="width: 32px; height: 32px"
              src="/image/ui/icon_guild.png"
              alt={t(`ui.guild`)}
            />
            {t("ui.guild")}
          </div>
        </button>
      </div>
    </Section>
    <Section>
      <div
        class="section-div"
        style={activePage === "planner"
          ? `background-color: var(--game-colour-${gameVersion})`
          : ""}
      >
        <button
          disabled={true}
          class="image-button"
          style="width: 100%; height:100%;  color: var(--item-quality-colour-Poor);"
          type="button"
          onclick={() => {}}
          title={t("ui.raidPlanner")}
        >
          <div class="bottom-div">
            <img
              style="width: 32px; height: 32px"
              src="/image/ui/icon_raid_planner.png"
              alt={t(`ui.raidPlanner`)}
            />
            {t("ui.raidPlanner")}
          </div>
        </button>
      </div>
    </Section>
    <Section>
      <div
        class="section-div"
        style={activePage === "history"
          ? `background-color: var(--game-colour-${gameVersion})`
          : ""}
      >
        <button
          disabled={accountState.guild ? false : true}
          class="image-button"
          style="width: 100%; height:100%;  color: var(--item-quality-colour-Poor); "
          type="button"
          onclick={() => {}}
          title={t("ui.lootHistory")}
        >
          <div class="bottom-div">
            <img
              style="width: 32px; height: 32px"
              src="/image/ui/icon_loot_history.png"
              alt={t(`ui.lootHistory`)}
            />
            {t("ui.lootHistory")}
          </div>
        </button>
      </div>
    </Section>
    <Section>
      <div
        class="section-div"
        style={activePage === "absence"
          ? `background-color: var(--game-colour-${gameVersion})`
          : ""}
      >
        <button
          disabled={accountState.guild ? false : true}
          class="image-button"
          style="width: 100%; height:100%;  color: var(--item-quality-colour-Poor); "
          type="button"
          onclick={() => {}}
          title={t("ui.absence")}
        >
          <div class="bottom-div">
            <img
              style="width: 32px; height: 32px"
              src="/image/ui/icon_absence.png"
              alt={t(`ui.absence`)}
            />
            {t("ui.absence")}
          </div>
        </button>
      </div>
    </Section>

    {#if accountState.level > 0}
      <Section>
        <div
          class="section-div"
          style={activePage === "options"
            ? `background-color: var(--game-colour-${gameVersion})`
            : ""}
        >
          <button
            class="image-button"
            style="width: 100%; height:100%;  color: var(--item-quality-colour-Common); "
            type="button"
            onclick={() => {
              goto(`/${gameVersion}/options`);
              activePage = "options";
            }}
            title={t("ui.options")}
          >
            <div class="bottom-div">
              <img
                style="width: 32px; height: 32px"
                src="/image/ui/icon_options.png"
                alt={t(`ui.options`)}
              />
              {t("ui.options")}
            </div>
          </button>
        </div>
      </Section>
    {/if}

    <Section>
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
    background: transparent;
  }

  .section-div {
    width: 100%;
    height: 56px;
    align-self: center;
    border: 1px solid black;
  }

  .bottom-div {
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 1px 1px black;
  }
</style>
