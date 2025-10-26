<script lang="ts">
  import WarcraftIcon from "$lib/components/WarcraftIcon.svelte";
  import {
    Faction,
    Gender,
    PlayerSpec as PlayerSpecType,
    Race,
    Region,
    PlayerClass as PlayerClassType,
    RaceFaction,
    ICON_QUESTIONMARK,
    RealmVersion,
  } from "$lib/consts";
  import { t } from "$lib/i18n/index.svelte";
  import type { Character, Guild } from "$lib/types";
  import { GameVersionName } from "$lib/versions/GameVersion";
  import { GameVersionFactory } from "$lib/versions/GameVersionFactory";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import type { PlayerRace } from "$lib/versions/PlayerRace";
  import type { PlayerSpec } from "$lib/versions/PlayerSpecialization";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import IconButton from "@smui/icon-button";
  import List, { Item, Text } from "@smui/list";
  import Menu from "@smui/menu";
  import Paper, { Content } from "@smui/paper";
  import { getContext } from "svelte";

  let {
    data = $bindable(),
    guilds,
    characters,
    nameError = $bindable(),
  } = $props<{
    data: Object | undefined;
    guilds: Guild[];
    characters: Character[];
    nameError: string | null;
  }>();
  const baseCharacter = JSON.parse(JSON.stringify(data.character));

  let openClass = $state(false);
  let openRace = $state(false);
  let openSpec = $state(false);

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  data.character.version =
    data.character?.version ?? gameVersionFactory.gameVersion.getName();

  let character_class = $state(
    GameVersionFactory.getContext(data.character.version)
      .gameVersion.getClasses()
      .find(
        (_class) =>
          _class.name ===
          (data.character?.character_class ?? PlayerClassType.Adventurer)
      ) ?? ({ name: PlayerClassType.Adventurer } as PlayerClass)
  );

  let character_spec = $state(
    GameVersionFactory.getContext(data.character.version)
      .gameVersion.getSpecs()
      .find(
        (spec: PlayerSpec) =>
          spec.playerClass.name === data.character.character_class &&
          spec.name ===
            `${data.character?.character_class ?? "Adventurer"}${data.character?.active_spec ?? "Adventurer"}`
      ) ??
      ({
        name: data.character?.active_spec ?? "Adventurer",
        icon: ICON_QUESTIONMARK,
      } as PlayerSpec)
  );

  let character_race = $state(
    GameVersionFactory.getContext(data.character.version)
      .gameVersion.getRaces()
      .find(
        (race: PlayerRace) => race.name === (data.character?.race ?? Race.Alien)
      ) ?? ({ name: Race.Alien } as PlayerRace)
  );

  let race_classes = $state(
    gameVersionFactory.gameVersion
      .getRaceClasses(data.character?.race ?? Race.Alien)
      .map((_race) => _race.rclass)
  );
  let versionClasses: PlayerClass[] = $state(
    gameVersionFactory.gameVersion
      .getClasses()
      .filter(
        (_class) =>
          _class.name !== PlayerClassType.Adventurer &&
          race_classes.includes(_class.name)
      )
  );
  let class_specs: PlayerSpec[] = $state(
    gameVersionFactory.gameVersion
      .getSpecs()
      .filter(
        (_spec) =>
          _spec.playerClass.name ===
          `${data.character?.character_class ?? PlayerClassType.Adventurer}`
      ) ?? []
  );
  const versionRaces: PlayerRace[] = gameVersionFactory.gameVersion
    .getRaces()
    .filter((_race) => _race.name !== Race.Alien);

  function handleNameInput(inputValue: string) {
    data.character.name = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(data.character.name, data.character.realm);
  }

  function handleValidInput(event: InputEvent) {
    const input = event.data;
    if (
      input &&
      (!/^\p{L}+$/u.test(input) ||
        /(.)\1\1/.test(`${data.character.name}${input}`))
    ) {
      event.preventDefault();
    }
  }

  function handleRealmInput(inputValue: string) {
    data.character.realm = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(data.character.name, data.character.realm);
  }

  function checkDuplicate(name: string, realm: string) {
    nameError = characters.some(
      (other_character: Character) =>
        other_character.realm.trim().toLowerCase() ===
          realm?.trim().toLowerCase() &&
        other_character.name.trim().toLowerCase() ===
          name.trim().toLowerCase() &&
        data.character.region.trim().toLowerCase() ===
          other_character.region.trim().toLowerCase() &&
        other_character.version === data.character.version
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }

  function handleReset() {
    data.character = JSON.parse(JSON.stringify(baseCharacter));
    handleChangeRace(
      GameVersionFactory.getContext(baseCharacter.version)
        .gameVersion.getRaces()
        .find(
          (race: PlayerRace) =>
            race.name === (baseCharacter?.race ?? Race.Alien)
        ) ?? ({ name: Race.Alien } as PlayerRace)
    );
    handleChangeClass(
      GameVersionFactory.getContext(baseCharacter.version)
        .gameVersion.getClasses()
        .find(
          (_class) =>
            _class.name ===
            (baseCharacter?.character_class ?? PlayerClassType.Adventurer)
        ) ?? ({ name: PlayerClassType.Adventurer } as PlayerClass)
    );
    handleChangeSpec(
      GameVersionFactory.getContext(baseCharacter.version)
        .gameVersion.getSpecs()
        .find(
          (spec: PlayerSpec) =>
            spec.playerClass.name === baseCharacter.character_class &&
            spec.name ===
              `${baseCharacter?.character_class ?? "Adventurer"}${baseCharacter?.active_spec ?? "Adventurer"}`
        ) ??
        ({
          name: baseCharacter?.active_spec ?? "Adventurer",
          icon: ICON_QUESTIONMARK,
        } as PlayerSpec)
    );
    data.active_spec.talents = JSON.parse(
      JSON.stringify(data.baseActiveSpec.talents)
    );
    data.active_spec.name = JSON.parse(
      JSON.stringify(data.baseActiveSpec.name)
    );
    data.active_spec.glyphs = JSON.parse(
      JSON.stringify(data.baseActiveSpec.glyphs)
    );
    if (data.baseOffSpec.talents) {
      data.off_spec.talents = JSON.parse(
        JSON.stringify(data.baseOffSpec?.talents)
      );
      data.off_spec.name = JSON.parse(JSON.stringify(data.baseOffSpec?.name));
      data.off_spec.glyphs = JSON.parse(
        JSON.stringify(data.baseOffSpec?.glyphs)
      );
    }

    nameError = null;
  }

  function handleChangeRace(race: PlayerRace) {
    if (race) {
      character_race = race;
      data.character.race = race.name;
      race_classes = gameVersionFactory.gameVersion
        .getRaceClasses(race.name)
        .map((_race) => _race.rclass);
      versionClasses = gameVersionFactory.gameVersion
        .getClasses()
        .filter(
          (_class) =>
            _class.name !== PlayerClassType.Adventurer &&
            race_classes.includes(_class.name)
        );
      if (
        !versionClasses.find(
          (_class) => _class.name === data.character.character_class
        )
      ) {
        character_class = {
          name: PlayerClassType.Adventurer,
        } as PlayerClass;
        data.character.character_class = PlayerClassType.Adventurer;
        character_spec = {
          name: PlayerSpecType.AdventurerAdventurer,
        } as PlayerSpec;
        data.character.active_spec = PlayerSpecType.AdventurerAdventurer;
      }
    }
    getFaction();
    openRace = false;
  }

  function handleChangeClass(pclass: PlayerClass) {
    if (pclass) {
      character_class = pclass;
      data.character.character_class = pclass.name;
      class_specs = gameVersionFactory.gameVersion
        .getSpecs()
        .filter(
          (_spec) => _spec.playerClass.name === `${character_class.name}`
        );
      character_spec = {
        name: PlayerSpecType.AdventurerAdventurer,
      } as PlayerSpec;
      data.character.active_spec = PlayerSpecType.AdventurerAdventurer;
    }

    data.active_spec.name = undefined;
    data.active_spec.talents = [];
    data.active_spec.glyphs = [];
    data.off_spec.name = undefined;
    data.off_spec.talents = [];
    data.off_spec.glyphs = [];
    openClass = false;
  }

  let getGenderIcon = (gender: string) => {
    return gender === Gender.Female
      ? "/image/gender_2_icon.png"
      : "/image/gender_1_icon.png";
  };
  function handleChangeGender() {
    if (data.character.gender === Gender.Female) {
      data.character.gender = Gender.Male;
    } else {
      data.character.gender = Gender.Female;
    }
  }

  function handleChangeSpec(_spec: PlayerSpec) {
    character_spec = _spec;
    data.character.active_spec = _spec.name.replace(
      data.character.character_class,
      ""
    );
  }

  function getFaction() {
    if (data.character.race.name === "Pandaren") {
      return data.character.faction;
    }
    let faction = Object.entries(RaceFaction).find(
      (r) => r[0] == data.character.race.name
    );
    if (faction) {
      return faction[1];
    }
    return Faction.Alliance;
  }

  function handleChangeFaction(event: Event) {
    event.stopPropagation();
    if (data.character.faction === Faction.Alliance) {
      data.character.faction = Faction.Horde;
    } else {
      data.character.faction = Faction.Alliance;
    }
  }

  function handleLevelInput(levelInput: number) {
    if (levelInput < 0) {
      data.character.level = 1;
    } else if (levelInput > gameVersionFactory.gameVersion.getMaxLevel()) {
      data.character.level = gameVersionFactory.gameVersion.getMaxLevel();
    }
  }
</script>

<div>
  <div style="display: flex; flex-direction: column; width: 100%; padding: 10px; gap: 5px;">
    <div style="grid-template-columns: 20% 40%" class="row">
      <span>{t("ui.characterName")}</span>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Name"
        maxlength="12"
        minlength="2"
        bind:value={data.character.name}
        onbeforeinput={handleValidInput}
        oninput={() => handleNameInput(data.character.name)}
        spellcheck="false"
        autocomplete="off"
        pattern="[A-Za-z]*"
        class="textinput"
        required
        title={t("ui.characterName")}
      />
    </div>
    {#if nameError}
      <div style="grid-template-columns: 100%" class="row">
        <p style="color: red;">{nameError}</p>
      </div>
    {/if}
    <div style="grid-template-columns: 20% 5% 5%" class="row">
      <span>{t("ui.characterRace")}</span>
      <IconButton
        type="button"
        aria-label={t(`ui.changeRace`)}
        onclick={() => (openRace = !openRace)}
        style={"height: 36px; width: 36px;"}
      >
        <WarcraftIcon
          src={gameVersionFactory.iconProvider.getFromSource(
            data.character.gender === Gender.Female
              ? (character_race.icon_female ?? ICON_QUESTIONMARK)
              : (character_race.icon_male ?? ICON_QUESTIONMARK)
          )}
          label={t(`ui.changeRace`)}
        />
      </IconButton>

      {#if data.character.race?.name === "Pandaren"}
        <img
          src="/image/icon_{data.character.faction.toLowerCase()}.png"
          alt={t(`faction.${data.character.faction}`)}
        />
      {/if}
      <Menu bind:open={openRace}>
        <List>
          {#each versionRaces as race}
            <Item
              onclick={() => {
                handleChangeRace(race);
              }}
              style={character_race?.name === race.name
                ? "background-color: var(--palette-success-dark);"
                : ""}
            >
              <WarcraftIcon
                src={gameVersionFactory.iconProvider.getFromSource(
                  data.character.gender === Gender.Female
                    ? race.icon_female
                    : race.icon_male
                )}
                label={t(`race.${race.name}`)}
              />
              {#if race.name === "Pandaren"}
                <IconButton
                  type="button"
                  aria-label={t(`ui.changeFaction`)}
                  onclick={(e: Event) => handleChangeFaction(e)}
                >
                  <WarcraftIcon
                    src={gameVersionFactory.iconProvider.getFromSource(
                      gameVersionFactory.gameVersion
                        .getFactions()
                        .find(
                          (_faction) => _faction.name === data.character.faction
                        )?.icon ?? ICON_QUESTIONMARK
                    )}
                    label={t(`faction.${data.character.faction}`)}
                  />
                </IconButton>
              {/if}
              <Text style={"margin: 20px"}>{t(`race.${race.name}`)}</Text>
            </Item>
          {/each}
        </List>
      </Menu>
    </div>
    <div style="grid-template-columns: 20% 5% 5%;" class="row">
      <span>{t("ui.characterClass")}</span>
      <IconButton
        type="button"
        aria-label={t(`ui.changeClass`)}
        onclick={() => (openClass = !openClass)}
        disabled={character_race.name === Race.Alien}
        style={"height: 36px; width: 36px;"}
      >
        <WarcraftIcon
          src={gameVersionFactory.iconProvider.getFromSource(
            character_class.icon ?? ICON_QUESTIONMARK
          )}
          label={t(`ui.changeClass`)}
          grayscale={character_race.name === Race.Alien}
        />
      </IconButton>
      <Menu bind:open={openClass}>
        <List>
          {#each versionClasses as _class}
            <Item
              onclick={() => {
                handleChangeClass(_class);
              }}
              style={data.character.character_class === _class.name
                ? "background-color: var(--palette-success-dark);"
                : ""}
            >
              <WarcraftIcon
                src={gameVersionFactory.iconProvider.getFromSource(_class.icon)}
                label={`classes.${_class.name}`}
              />
              <Text style={`margin: 20px; color: ${_class.colour}`}
                >{t(`classes.${_class.name}`)}</Text
              >
            </Item>
          {/each}
        </List>
      </Menu>
    </div>
    <div style="grid-template-columns: 20% 5% 5%" class="row">
      <span>{t("ui.characterSpecialization")}</span>
      <IconButton
        type="button"
        aria-label={t(`ui.changeSpecialization`)}
        disabled={character_class.name === PlayerClassType.Adventurer}
        onclick={() => (openSpec = !openSpec)}
        style={"height: 36px; width: 36px;"}
      >
        <WarcraftIcon
          src={gameVersionFactory.iconProvider.getFromSource(
            character_spec.icon ?? ICON_QUESTIONMARK
          )}
          label={t(`ui.changeSpecialization`)}
          grayscale={character_class.name === PlayerClassType.Adventurer}
        />
      </IconButton>
      <Menu bind:open={openSpec}>
        <List>
          {#each class_specs as _spec}
            <Item
              onclick={() => {
                handleChangeSpec(_spec);
              }}
              style={data.character.active_spec === _spec.name
                ? "background-color: var(--palette-success-dark);"
                : ""}
            >
              <WarcraftIcon
                src={gameVersionFactory.iconProvider.getFromSource(_spec.icon)}
                label={`specs.${_spec.name}`}
              />
              <Text style={`margin: 20px; color: ${character_class.colour}`}
                >{t(`specs.${_spec.name}`)}</Text
              >
            </Item>
          {/each}
        </List>
      </Menu>
    </div>
    <div style="grid-template-columns: 20% 5% 5%" class="row">
      <span>{t("ui.characterGender")}</span>
      <IconButton
        type="button"
        aria-label={t(`ui.changeGender`)}
        onclick={() => handleChangeGender()}
        ripple={false}
        style={"height: 36px; width: 36px;"}
      >
        <img
          style={"height: 36px; width: 36px;"}
          src={getGenderIcon(data.character.gender)}
          alt={t(`ui.changeGender`)}
        />
      </IconButton>
    </div>
    <div style="grid-template-columns: 20% 30%;" class="row">
      <span>{t("ui.characterRealm")}</span>
      <div>
        <input
          id="realm"
          name="realm"
          type="text"
          placeholder="Realm"
          bind:value={data.character.realm}
          onbeforeinput={handleValidInput}
          oninput={() => handleRealmInput(data.character.realm)}
          class="textinput"
          required
          title={t("ui.characterRealm")}
        />
      </div>
    </div>
    <div style="grid-template-columns: 20% 30%" class="row">
      <span>{t("ui.characterLevel")}</span>
      <div>
        <input
          id="level"
          name="level"
          type="number"
          class="textinput"
          bind:value={data.character.level}
          oninput={() => handleLevelInput(data.character.level)}
          onfocusoutcapture={() => {
            data.character.level == 0
              ? (data.character.level = 1)
              : data.character.level;
          }}
          placeholder="1"
          min="1"
          max={gameVersionFactory.gameVersion.getMaxLevel()}
          title={t("ui.characterLevel")}
        />
      </div>
    </div>
    <div style="grid-template-columns: 20% 30%" class="row">
      <span>{t("ui.characterGuild")}</span>
      <div>
        <select
          id="guild"
          name="guild"
          class="select"
          bind:value={data.character.guild}
          title={t("ui.characterGuild")}
          required
        >
          <option value={-1}>{"None"}</option>
          {#each guilds.filter((guild: Guild) => guild.version === gameVersionFactory.gameVersion.getName()) as guild}
            <option
              style={`color: var(--faction-colour-${guild.faction});`}
              value={guild.id}>{guild.name}</option
            >
          {/each}
        </select>
      </div>
    </div>
    {#if !["classic", "tbc"].includes(gameVersionFactory.gameVersion.getName())}
      <div style="grid-template-columns: 20% 30%" class="row">
        <span>{t("ui.characterAchievementPoints")}</span>
        <div>
          <input
            id="achievement_points"
            name="achievement_points"
            type="number"
            class="textinput"
            bind:value={data.character.achievement_points}
            placeholder="0"
            min="0"
            title={t("ui.characterAchievementPoints")}
          />
        </div>
      </div>
    {/if}
    <div style="grid-template-columns: 20% 30%" class="row">
      <span>{t("ui.characterItemLevel")}</span>
      <div>
        <input
          id="equipped_item_level"
          name="equipped_item_level"
          type="number"
          class="textinput"
          bind:value={data.character.equipped_item_level}
          placeholder="0"
          min="0"
          title={t("ui.characterItemLevel")}
        />
      </div>
    </div>
    <div style="grid-template-columns: 20% 30%" class="row">
      <span>{t("ui.characterRegion")}</span>
      <div>
        <select
          onchange={() =>
            checkDuplicate(data.character.name, data.character.realm)}
          id="region"
          name="region"
          class="select"
          bind:value={data.character.region}
          required
          title={t("ui.characterRegion")}
        >
          {#each Object.values(Region) as region}
            <option value={region}>{t(`region.${region}`)}</option>
          {/each}
        </select>
      </div>
    </div>
    <div style="grid-template-columns: 20% 30%" class="row">
      <span>{t("ui.characterVersion")}</span>
      <div>
        <select
          onchange={() =>
            checkDuplicate(data.character.name, data.character.realm)}
          id="version"
          name="version"
          class="select"
          bind:value={data.character.version}
          required
          title={t("ui.characterVersion")}
        >
          {#each Object.values(GameVersionName) as version}
            <option value={version}>{t(`version.${version}`)}</option>
          {/each}
        </select>
      </div>
    </div>
    <div style="grid-template-columns: 20% 30%" class="row">
      <span>{t("ui.realmVersion")}</span>
      <div>
        <select
          id="realm_version"
          name="realm_version"
          class="select"
          bind:value={data.character.realm_version}
          required
          title={t("ui.realmVersion")}
        >
          {#each Object.values(RealmVersion) as realm_version}
            <option value={realm_version}
              >{t(`realm_version.${realm_version}`)}</option
            >
          {/each}
        </select>
      </div>
    </div>
  </div>
  <button
    type="button"
    style="height: 34px; border: 1px solid black; background: var(--palette-secondary-light); cursor: pointer"
    onclick={() => handleReset()}>{t(`ui.reset`)}</button
  >
</div>

<style>
  .textinput {
    width: 400px;
    background-color: var(--palette-secondary-main);
    border: 1px solid black;
    height: 32px;
    font-size: medium;
    font-weight: bold;
    padding: 0;
    padding-left: 7px;
  }
  .row {
    display: grid;
    align-items: center;
    height: 36px;
    gap: 20px;
  }
  .select {
    height: 34px;
    width: 409px;
    background-color: var(--palette-secondary-main);
    border: 1px solid black;
    font-weight: bold;
    font-size: medium;
    padding: 0;
    padding-left: 4px;
  }
  option {
    background-color: var(--palette-secondary-dark);
    font-weight: bold;
  }
  option:checked {
    background-color: var(--palette-primary-dark);
  }
</style>
