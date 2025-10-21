<script lang="ts">
  import { goto } from "$app/navigation";
  import type {
    Character,
    CharacterEquipment,
    CharacterSpec,
    CharacterStatistic,
    Glyph,
    Guild,
  } from "$lib/types";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { getContext } from "svelte";
  import CharacterFrame from "./CharacterFrame.svelte";
  import Paper, { Content } from "@smui/paper";
  import EquipmentFrame from "./EquipmentFrame.svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { t } from "$lib/i18n/index.svelte";
  import StatisticFrame from "./StatisticFrame.svelte";
  import GlyphFrame from "$lib/components/character/GlyphFrame.svelte";
  import TalentFrame from "$lib/components/character/TalentFrame.svelte";
  import CharacterEditFrame from "./CharacterEditFrame.svelte";

  const { id } = $props<{ id: number }>();

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");

  let edit: boolean = $state(id == 0 ? true : false);
  let other_characters: Character[] = $state([]);
  let guilds: Guild[] = $state([]);
  let character_guild: Guild = $state({} as Guild);
  let character_statistics: CharacterStatistic = $state(
    {} as CharacterStatistic
  );
  let nameError: string | null = $state(null);
  let formData = $state({
    equipment: {} as CharacterEquipment,
    character: {} as Character,
    active_spec: {
      talents: [],
      glyphs: [],
      id: -1,
      name: "",
      spec_id: 0,
      version: gameVersionFactory.gameVersion.getName(),
    } as CharacterSpec,
    off_spec: {
      talents: [],
      glyphs: [],
      id: -1,
      name: "",
      spec_id: 1,
      version: gameVersionFactory.gameVersion.getName(),
    } as CharacterSpec,
    baseActiveSpec: {
      talents: [],
      glyphs: [],
      id: -1,
      name: "",
      spec_id: 0,
      version: gameVersionFactory.gameVersion.getName(),
    } as CharacterSpec,
    baseOffSpec: {
      talents: [],
      glyphs: [],
      id: -1,
      name: "",
      spec_id: 1,
      version: gameVersionFactory.gameVersion.getName(),
    } as CharacterSpec,
  });
  let baseCharacter: Character = $state({} as Character);

  const fetchCharacter = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    if (data.Result.length == 0) {
      window.location.href = `/${gameVersionFactory.gameVersion.getName()}/characters`;
    }
    formData.character = data.Result[0];
    baseCharacter = data.Result[0];
  };

  const fetchOtherCharacters = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/?version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    other_characters = data.Result.filter(
      (other_character: Character) =>
        formData.character?.name !== other_character.name
    );
  };

  const fetchGuilds = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Guild/?version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    guilds = data.Result.filter(
      (guild: Guild) =>
        guild.version === gameVersionFactory.gameVersion.getName()
    );
    character_guild =
      guilds.find((guild: Guild) => guild.id === formData.character?.guild) ??
      ({} as Guild);
  };

  const fetchEquipment = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Equipment/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    formData.equipment = data.Result;
  };

  const fetchSpecialization = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Specialization/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    let character_specializations = data.Result;

    if (character_specializations.length == 1) {
      formData.active_spec = character_specializations?.find(
        (spec: CharacterSpec) => spec.spec_id === 0
      ) ?? {
        talents: [],
        glyphs: [],
        id: -1,
        name: "",
        spec_id: 0,
        version: gameVersionFactory.gameVersion.getName(),
      };
      formData.baseActiveSpec =
        character_specializations?.find(
          (spec: CharacterSpec) => spec.spec_id === 0
        ) ??
        ({
          talents: [],
          glyphs: [],
          id: -1,
          name: "",
          spec_id: 0,
          version: gameVersionFactory.gameVersion.getName(),
        } as CharacterSpec);
      formData.off_spec = {} as CharacterSpec;
      formData.baseOffSpec = {} as CharacterSpec;
    } else {
      formData.active_spec =
        character_specializations?.find(
          (spec: CharacterSpec) => spec.spec_id === 0
        ) ??
        ({
          talents: [],
          glyphs: [],
          id: -1,
          name: "",
          spec_id: 0,
          version: gameVersionFactory.gameVersion.getName(),
        } as CharacterSpec);
      formData.baseActiveSpec =
        character_specializations?.find(
          (spec: CharacterSpec) => spec.spec_id === 0
        ) ??
        ({
          talents: [],
          glyphs: [],
          id: -1,
          name: "",
          spec_id: 0,
          version: gameVersionFactory.gameVersion.getName(),
        } as CharacterSpec);
      formData.off_spec =
        character_specializations?.find(
          (spec: CharacterSpec) => spec.spec_id === 1
        ) ??
        ({
          talents: [],
          glyphs: [],
          id: -1,
          name: "",
          spec_id: 1,
          version: gameVersionFactory.gameVersion.getName(),
        } as CharacterSpec);
      formData.baseOffSpec =
        character_specializations?.find(
          (spec: CharacterSpec) => spec.spec_id === 1
        ) ??
        ({
          talents: [],
          glyphs: [],
          id: -1,
          name: "",
          spec_id: 1,
          version: gameVersionFactory.gameVersion.getName(),
        } as CharacterSpec);
    }
    initializeGlyphs();
  };

  function initializeGlyphs() {
    let new_glyphs: Glyph[] = [];
    let primeGlyphs = [];
    let majorGlyphs = [];
    let minorGlyphs = [];

    if (gameVersionFactory.gameVersion.getName() === "cata") {
      primeGlyphs = formData.active_spec.glyphs.filter(
        (glyph: Glyph) => glyph.type === "Prime"
      );
      new_glyphs.push(
        ...primeGlyphs,
        ...Array(3)
          .fill({ type: "Prime" })
          .slice(0, 3 - primeGlyphs.length)
      );
    }
    majorGlyphs = formData.active_spec.glyphs.filter(
      (glyph: Glyph) => glyph.type === "Major"
    );
    new_glyphs.push(
      ...majorGlyphs,
      ...Array(3)
        .fill({ type: "Major" })
        .slice(0, 3 - majorGlyphs.length)
    );
    minorGlyphs = formData.active_spec.glyphs.filter(
      (glyph: Glyph) => glyph.type === "Minor"
    );
    new_glyphs.push(
      ...minorGlyphs,
      ...Array(3)
        .fill({ type: "Minor" })
        .slice(0, 3 - minorGlyphs.length)
    );

    formData.active_spec.glyphs = new_glyphs.concat([]);
    formData.baseActiveSpec.glyphs = new_glyphs.concat([]);

    new_glyphs = [];
    if (formData.off_spec.glyphs) {
      if (gameVersionFactory.gameVersion.getName() === "cata") {
        primeGlyphs = formData.off_spec.glyphs.filter(
          (glyph: Glyph) => glyph.type === "Prime"
        );
        new_glyphs.push(
          ...primeGlyphs,
          ...Array(3)
            .fill({ type: "Prime" })
            .slice(0, 3 - primeGlyphs.length)
        );
      }
      majorGlyphs = formData.off_spec.glyphs.filter(
        (glyph: Glyph) => glyph.type === "Major"
      );
      new_glyphs.push(
        ...majorGlyphs,
        ...Array(3)
          .fill({ type: "Major" })
          .slice(0, 3 - majorGlyphs.length)
      );
      minorGlyphs = formData.off_spec.glyphs.filter(
        (glyph: Glyph) => glyph.type === "Minor"
      );
      new_glyphs.push(
        ...minorGlyphs,
        ...Array(3)
          .fill({ type: "Minor" })
          .slice(0, 3 - minorGlyphs.length)
      );

      formData.off_spec.glyphs = new_glyphs.concat([]);
      formData.baseOffSpec.glyphs = new_glyphs.concat([]);
    }
  }

  const fetchStatistic = async () => {
    const res = await fetch(
      `${PUBLIC_API_URL}/Character/Statistic/?id=${id}&version=${gameVersionFactory.gameVersion.getName()}`
    );
    const data = await res.json();
    character_statistics = data.Result;
  };

  let fetchData = async () => {
    if (id != 0) {
      await fetchCharacter();
      await fetchGuilds();
      await fetchOtherCharacters();
      await fetchEquipment();
      await fetchSpecialization();
      await fetchStatistic();
    }
  };

  let equipment_updated: string | null = $state(null);

  function handleGoBack() {
    goto(`/${gameVersionFactory.gameVersion.getName()}/characters`);
  }
  function handleDelete() {
    goto(`${id}/delete`);
  }

  async function handleRefresh() {
    equipment_updated = t("ui.updatingCharacter");

    let response = await fetch(`${PUBLIC_API_URL}/Character/Parse/`, {
      method: "POST",
      body: JSON.stringify({
        players: [[formData.character?.name, formData.character?.realm]],
        region: formData.character.region,
        version: gameVersionFactory.gameVersion.getName(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data["Result"] === "Not Found") {
        equipment_updated = t("ui.characterNotFound");
        return;
      }
      await fetchData();
      equipment_updated = null;
      goto(
        `/${gameVersionFactory.gameVersion.getName()}/characters/${data["Result"]}`
      );
    } else {
      equipment_updated = t("ui.errorFetchingData");
    }
  }
  async function handleSubmit() {
    baseCharacter = JSON.parse(JSON.stringify(formData.character));
    const response = await fetch(`./${formData.character.id}`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "content-type": "application/json",
      },
    });
    const result = await response.json();
    if (result["new_character"]) {
      window.location.href = `/${gameVersionFactory.gameVersion.getName()}${result["url"]}`;
    }
    edit = false;
  }
</script>

<div>
  {#await fetchData()}
    <p>Loading...</p>
  {:then}
    {#if formData.character}
      {#if equipment_updated}
        <p style="color: yellow;">{equipment_updated}</p>
      {/if}

      <Paper
        style={`border: 1px solid black; display: grid; grid-template-columns: ${edit ? "40% 50%" : "25% 40% 35%"}`}
      >
        <Content>
          {#if edit}
            <CharacterEditFrame
              bind:data={formData}
              characters={other_characters}
              {guilds}
              bind:nameError
            ></CharacterEditFrame>
          {:else}
            <CharacterFrame character={formData.character} {character_guild} />
          {/if}
          <br />
          <button
            type="button"
            style="height: 34px; border: 1px solid black; background: var(--palette-secondary-light); cursor: pointer"
            onclick={() => {
              if (window.location.href.includes("/characters/add")) {
                window.location.href = `/${gameVersionFactory.gameVersion.getName()}/characters`;
              } else {
                if (edit) {
                  formData.character = JSON.parse(
                    JSON.stringify(baseCharacter)
                  );
                  formData.active_spec = JSON.parse(
                    JSON.stringify(formData.baseActiveSpec)
                  );
                  formData.off_spec = JSON.parse(
                    JSON.stringify(formData.baseOffSpec)
                  );
                  edit = false;
                } else {
                  edit = true;
                }
              }
            }}>{t(edit ? `ui.cancel` : `ui.edit`)}</button
          >
          {#if edit}
            <button
              type="submit"
              style="height: 34px; border: 1px solid black; background: var(--palette-secondary-light); cursor: pointer"
              onclick={() => handleSubmit()}
              disabled={nameError ||
              !formData.character.name ||
              !formData.character.realm ||
              formData.character.name === "" ||
              formData.character.realm === ""
                ? true
                : false}>{t("ui.save")}</button
            >
          {/if}
          <button
            type="button"
            style="height: 34px; border: 1px solid black; background: var(--palette-secondary-light); cursor: pointer"
            disabled={equipment_updated ? true : false}
            onclick={() => handleRefresh()}>{t("ui.refreshCharacter")}</button
          >
          <button
            style="height: 34px; border: 1px solid black; background: var(--palette-primary-dark); cursor: pointer"
            type="button"
            onclick={() => handleDelete()}
            >{t("ui.deleteCharacter")}
          </button>
        </Content>
        <Content style={"width: 100%"}>
          <EquipmentFrame bind:equipment={formData.equipment} {edit} />
        </Content>
        {#if !edit}
          <Content style={"width: 100%"}>
            <StatisticFrame statistics={character_statistics} />
          </Content>
        {/if}
      </Paper>
      {#if formData.active_spec}
        <Paper
          style={["wotlk", "cata", "mop"].includes(
            gameVersionFactory.gameVersion.getName()
          )
            ? "border: 1px solid black; display: grid; grid-template-columns: 65% 35%;"
            : "border: 1px solid black; display: grid;"}
        >
          <Content>
            <TalentFrame
              specialization={formData.active_spec}
              character_class={formData.character.character_class}
              level={formData.character.level}
              {edit}
            />
          </Content>
          {#if ["wotlk", "cata", "mop"].includes(gameVersionFactory.gameVersion.getName())}
            <Content>
              <GlyphFrame
                glyphs={formData.active_spec.glyphs}
                character_class={formData.character.character_class}
                {edit}
              />
            </Content>
          {/if}
        </Paper>
      {/if}
      {#if formData.off_spec}
        <Paper
          style={["wotlk", "cata", "mop"].includes(
            gameVersionFactory.gameVersion.getName()
          )
            ? "border: 1px solid black; display: grid; grid-template-columns: 65% 35%;"
            : "border: 1px solid black; display: grid; "}
        >
          <Content>
            <TalentFrame
              specialization={formData.off_spec}
              character_class={formData.character.character_class}
              level={formData.character.level}
              {edit}
            />
          </Content>
          {#if ["wotlk", "cata", "mop"].includes(gameVersionFactory.gameVersion.getName())}
            <Content>
              <GlyphFrame
                glyphs={formData.off_spec.glyphs}
                character_class={formData.character.character_class}
                {edit}
              />
            </Content>
          {/if}
        </Paper>
      {/if}
    {/if}

    <br />

    <button onclick={() => handleGoBack()}>{t("ui.goBackPage")}</button>
  {/await}
</div>
