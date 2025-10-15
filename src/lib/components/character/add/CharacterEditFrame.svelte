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
    character = undefined,
    character_guild = undefined,
    guilds,
    characters,
  } = $props<{
    character: Character | undefined;
    character_guild: Guild | undefined;
    guilds: Guild[];
    characters: Character[];
  }>();

  let nameInput: string = $state(character?.name ?? "");
  let realmInput: string = $state(character?.realm ?? "");
  let openClass = $state(false);
  let openRace = $state(false);
  let openSpec = $state(false);

  console.log(character);

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  const defaultVersion =
    character?.version ?? gameVersionFactory.gameVersion.getName();
  let selectedVersion: GameVersionName = $state(
    character?.version ?? gameVersionFactory.gameVersion.getName()
  );
  let selectedClass: PlayerClass = $state(
    GameVersionFactory.getContext(defaultVersion)
      .gameVersion.getClasses()
      .find(
        (_class) =>
          _class.name ===
          (character?.character_class ?? PlayerClassType.Adventurer)
      ) ?? ({ name: PlayerClassType.Adventurer } as PlayerClass)
  );
  let selectedSpec: PlayerSpec = $state(
    GameVersionFactory.getContext(defaultVersion)
      .gameVersion.getSpecs()
      .find(
        (spec: PlayerSpec) =>
          spec.playerClass.name === selectedClass.name &&
          spec.name ===
            `${character?.character_class ?? "Adventurer"}${character?.active_spec ?? "Adventurer"}`
      ) ??
      ({
        name: character?.active_spec ?? "Adventurer",
        icon: ICON_QUESTIONMARK,
      } as PlayerSpec)
  );

  let selectedRegion: Region = $state(character?.region ?? Region.EU);
  let selectedFaction: Faction = $state(character?.faction ?? Faction.Alliance);
  let selectedRace: PlayerRace = $state(
    GameVersionFactory.getContext(defaultVersion)
      .gameVersion.getRaces()
      .find(
        (race: PlayerRace) => race.name === (character?.race ?? Race.Alien)
      ) ?? ({ name: Race.Alien } as PlayerRace)
  );
  let selectedGuild: number = $state(character_guild?.id ?? -1);
  let selectedLevel: number = $state(character?.level ?? 1);
  let selectedAchievementPoints: number = $state(
    character?.achievement_points ?? 0
  );
  let selectedItemlevel: number = $state(character?.equipped_item_level ?? 0);
  let selectedGender: Gender = $state(character?.gender ?? Gender.Female);

  let race_classes = $state(
    gameVersionFactory.gameVersion
      .getRaceClasses(selectedRace.name)
      .map((_race) => _race.rclass)
  );
  let versionClasses: PlayerClass[] = $state(
    gameVersionFactory.gameVersion
      .getClasses()
      .filter(
        (_class) =>
          _class.name !== "Adventurer" && race_classes.includes(_class.name)
      )
  );
  let class_specs: PlayerSpec[] = $state(
    gameVersionFactory.gameVersion
      .getSpecs()
      .filter((_spec) => _spec.playerClass.name === `${selectedClass.name}`) ??
      []
  );
  const versionRaces: PlayerRace[] = gameVersionFactory.gameVersion
    .getRaces()
    .filter((_race) => _race.name !== "Alien");

  function handleNameInput(inputValue: string) {
    nameInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(nameInput, realmInput);
  }

  function handleValidInput(event: InputEvent) {
    const input = event.data;
    if (input && (!/^\p{L}+$/u.test(input) || /(.)\1\1/.test(`${nameInput}${input}`))) {
      event.preventDefault();
    }
  }

  function handleRealmInput(inputValue: string) {
    realmInput = `${inputValue.charAt(0).toUpperCase()}${inputValue.slice(1)}`;
    checkDuplicate(nameInput, realmInput);
  }

  let nameError: string | null = $state(null);
  function checkDuplicate(name: string, realm: string) {
    nameError = characters.some(
      (character: Character) =>
        character.realm.trim().toLowerCase() === realm.trim().toLowerCase() &&
        character.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        character.region.trim().toLowerCase() ===
          selectedRegion.trim().toLowerCase() &&
        character.version === selectedVersion
    )
      ? `"${name}" already exists on "${realm}".`
      : null;
  }

  function handleReset() {
    nameInput = character?.name ?? "";
    realmInput = character?.realm ?? "";
    selectedAchievementPoints = character?.achievement_points ?? 0;
    selectedGuild = character_guild?.id ?? -1;
    selectedItemlevel = character?.equipped_item_level ?? 0;
    selectedLevel = character?.level ?? 1;
    selectedVersion =
      character?.version ?? gameVersionFactory.gameVersion.getName();
    handleChangeRace(
      GameVersionFactory.getContext(selectedVersion)
        .gameVersion.getRaces()
        .find(
          (race: PlayerRace) => race.name === (character?.race ?? Race.Alien)
        ) ?? ({ name: Race.Alien } as PlayerRace)
    );
    handleChangeClass(
      GameVersionFactory.getContext(selectedVersion)
        .gameVersion.getClasses()
        .find(
          (_class) =>
            _class.name ===
            (character?.character_class ?? PlayerClassType.Adventurer)
        ) ?? ({ name: PlayerClassType.Adventurer } as PlayerClass)
    );
    handleChangeSpec(
      GameVersionFactory.getContext(selectedVersion)
        .gameVersion.getSpecs()
        .find(
          (spec: PlayerSpec) =>
            spec.playerClass.name === selectedClass.name &&
            spec.name ===
              `${character?.character_class ?? "Adventurer"}${character?.active_spec ?? "Adventurer"}`
        ) ??
        ({
          name: character?.active_spec ?? "Adventurer",
          icon: ICON_QUESTIONMARK,
        } as PlayerSpec)
    );
    selectedRegion = character?.region ?? Region.EU;
    selectedFaction = character?.faction ?? Faction.Alliance;
    selectedGender = character?.gender ?? Gender.Female;
    nameError = null;
  }

  function handleChangeRace(race: PlayerRace) {
    if (race) {
      selectedRace = race;
      race_classes = gameVersionFactory.gameVersion
        .getRaceClasses(race.name)
        .map((_race) => _race.rclass);
      versionClasses = gameVersionFactory.gameVersion
        .getClasses()
        .filter(
          (_class) =>
            _class.name !== "Adventurer" && race_classes.includes(_class.name)
        );
      if (
        !versionClasses.find((_class) => _class.name === selectedClass.name)
      ) {
        selectedClass = { name: PlayerClassType.Adventurer } as PlayerClass;
        selectedSpec = {
          name: PlayerSpecType.AdventurerAdventurer,
        } as PlayerSpec;
      }
    }
    getFaction();
    openRace = false;
  }

  function handleChangeClass(pclass: PlayerClass) {
    if (pclass) {
      selectedClass = pclass;
      class_specs = gameVersionFactory.gameVersion
        .getSpecs()
        .filter((_spec) => _spec.playerClass.name === `${selectedClass.name}`);
      selectedSpec = {
        name: PlayerSpecType.AdventurerAdventurer,
      } as PlayerSpec;
    }
    openClass = false;
  }

  let getGenderIcon = (gender: string) => {
    return gender === Gender.Female
      ? "/image/gender_2_icon.png"
      : "/image/gender_1_icon.png";
  };
  function handleChangeGender() {
    if (selectedGender === Gender.Female) {
      selectedGender = Gender.Male;
    } else {
      selectedGender = Gender.Female;
    }
  }

  function handleChangeSpec(_spec: PlayerSpec) {
    selectedSpec = _spec;
  }

  function getFaction() {
    if (selectedRace.name === "Pandaren") {
      return selectedFaction;
    }
    let faction = Object.entries(RaceFaction).find(
      (r) => r[0] == selectedRace.name
    );
    if (faction) {
      return faction[1];
    }
    return Faction.Alliance;
  }

  function handleChangeFaction(event: Event) {
    event.stopPropagation();
    if (selectedFaction === Faction.Alliance) {
      selectedFaction = Faction.Horde;
    } else {
      selectedFaction = Faction.Alliance;
    }
  }

  function handleLevelInput(levelInput: number) {
    if (levelInput < 0) {
      selectedLevel = 1;
    } else if (levelInput > gameVersionFactory.gameVersion.getMaxLevel()) {
      selectedLevel = gameVersionFactory.gameVersion.getMaxLevel();
    }
  }
</script>

<Paper>
  <Content>
    <form method="POST">
      <input id="id" type="hidden" name="id" value={character?.id ?? 0} />
      <input id="faction" type="hidden" name="faction" value={getFaction()} />
      <div
        style="display: flex; flex-direction: column; width: 100%; padding: 20px; gap: 20px"
      >
        <div style="grid-template-columns: 20% 40%" class="row">
          <span>{t("ui.characterName")}</span>
          <div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              maxlength="12"
              minlength="2"
              bind:value={nameInput}
              onbeforeinput={handleValidInput}
              oninput={() => handleNameInput(nameInput)}
              spellcheck="false"
              autocomplete="off"
              pattern="[A-Za-z]*"
              class="textinput"
              required
            />
            {#if nameError}
              <p style="color: red;">{nameError}</p>
            {/if}
          </div>
        </div>
        <div style="grid-template-columns: 20% 5% 5%" class="row">
          <span>{t("ui.characterRace")}</span>
          <input
            id="race"
            type="hidden"
            name="race"
            value={selectedRace.name}
          />

          <IconButton
            type="button"
            aria-label={t(`ui.changeRace`)}
            onclick={() => (openRace = !openRace)}
            style={"height: 36px; width: 36px;"}
          >
            <WarcraftIcon
              src={gameVersionFactory.iconProvider.getFromSource(
                selectedGender === Gender.Male
                  ? (selectedRace.icon_male ?? ICON_QUESTIONMARK)
                  : (selectedRace.icon_female ?? ICON_QUESTIONMARK)
              )}
              label={t(`ui.changeRace`)}
            />
          </IconButton>

          {#if selectedRace.name === "Pandaren"}
            <img
              src="/image/icon_{selectedFaction.toLowerCase()}.png"
              alt={t(`faction.${selectedFaction}`)}
            />
          {/if}
          <Menu bind:open={openRace}>
            <List>
              {#each versionRaces as race}
                <Item
                  onclick={() => {
                    handleChangeRace(race);
                  }}
                  style={selectedRace.name === race.name
                    ? "background-color: var(--palette-success-dark);"
                    : ""}
                >
                  <WarcraftIcon
                    src={gameVersionFactory.iconProvider.getFromSource(
                      selectedGender === Gender.Male
                        ? race.icon_male
                        : race.icon_female
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
                              (_faction) => _faction.name === selectedFaction
                            )?.icon ?? ICON_QUESTIONMARK
                        )}
                        label={t(`faction.${selectedFaction}`)}
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
          <input
            id="character_class"
            type="hidden"
            name="character_class"
            value={selectedClass.name}
          />
          <IconButton
            type="button"
            aria-label={t(`ui.changeClass`)}
            onclick={() => (openClass = !openClass)}
            disabled={selectedRace.name === Race.Alien}
            style={"height: 36px; width: 36px;"}
          >
            <WarcraftIcon
              src={gameVersionFactory.iconProvider.getFromSource(
                selectedClass.icon ?? ICON_QUESTIONMARK
              )}
              label={t(`ui.changeClass`)}
              grayscale={selectedRace.name === Race.Alien}
            />
          </IconButton>
          <Menu bind:open={openClass}>
            <List>
              {#each versionClasses as _class}
                <Item
                  onclick={() => {
                    handleChangeClass(_class);
                  }}
                  style={selectedClass.name === _class.name
                    ? "background-color: var(--palette-success-dark);"
                    : ""}
                >
                  <WarcraftIcon
                    src={gameVersionFactory.iconProvider.getFromSource(
                      _class.icon
                    )}
                    label={`class.${_class.name}`}
                  />
                  <Text style={`margin: 20px; color: ${_class.colour}`}
                    >{t(`class.${_class.name}`)}</Text
                  >
                </Item>
              {/each}
            </List>
          </Menu>
        </div>
        <div style="grid-template-columns: 20% 5% 5%" class="row">
          <span>{t("ui.characterSpecialization")}</span>
          <input
            id="active_spec"
            type="hidden"
            name="active_spec"
            value={selectedSpec.name}
          />
          <IconButton
            type="button"
            aria-label={t(`ui.changeSpecialization`)}
            disabled={selectedClass.name === PlayerClassType.Adventurer}
            onclick={() => (openSpec = !openSpec)}
            style={"height: 36px; width: 36px;"}
          >
            <WarcraftIcon
              src={gameVersionFactory.iconProvider.getFromSource(
                selectedSpec.icon ?? ICON_QUESTIONMARK
              )}
              label={t(`ui.changeSpecialization`)}
              grayscale={selectedClass.name === PlayerClassType.Adventurer}
            />
          </IconButton>
          <Menu bind:open={openSpec}>
            <List>
              {#each class_specs as _spec}
                <Item
                  onclick={() => {
                    handleChangeSpec(_spec);
                  }}
                  style={selectedSpec.name === _spec.name
                    ? "background-color: var(--palette-success-dark);"
                    : ""}
                >
                  <WarcraftIcon
                    src={gameVersionFactory.iconProvider.getFromSource(
                      _spec.icon
                    )}
                    label={`spec.${_spec.name}`}
                  />
                  <Text style={`margin: 20px; color: ${selectedClass.colour}`}
                    >{t(`spec.${_spec.name}`)}</Text
                  >
                </Item>
              {/each}
            </List>
          </Menu>
        </div>
        <div style="grid-template-columns: 20% 5% 5%" class="row">
          <span>{t("ui.characterGender")}</span>
          <input
            id="gender"
            type="hidden"
            name="gender"
            value={selectedGender}
          />
          <IconButton
            type="button"
            aria-label={t(`ui.changeGender`)}
            onclick={() => handleChangeGender()}
            ripple={false}
            style={"height: 36px; width: 36px;"}
          >
            <img
              style={"height: 36px; width: 36px;"}
              src={getGenderIcon(selectedGender)}
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
              bind:value={realmInput}
              onbeforeinput={handleValidInput}
              oninput={() => handleRealmInput(realmInput)}
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
              bind:value={selectedLevel}
              oninput={() => handleLevelInput(selectedLevel)}
              onfocusoutcapture={() => {
                selectedLevel == 0 ? (selectedLevel = 1) : selectedLevel;
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
              bind:value={selectedGuild}
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
        <div style="grid-template-columns: 20% 30%" class="row">
          <span>{t("ui.characterAchievementPoints")}</span>
          <div>
            <input
              id="achievement_points"
              name="achievement_points"
              type="number"
              class="textinput"
              bind:value={selectedAchievementPoints}
              placeholder="0"
              min="0"
              title={t("ui.characterAchievementPoints")}
            />
          </div>
        </div>
        <div style="grid-template-columns: 20% 30%" class="row">
          <span>{t("ui.characterItemLevel")}</span>
          <div>
            <input
              id="equipped_item_level"
              name="equipped_item_level"
              type="number"
              class="textinput"
              bind:value={selectedItemlevel}
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
              onchange={() => checkDuplicate(nameInput, realmInput)}
              id="region"
              name="region"
              class="select"
              bind:value={selectedRegion}
              required
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
              onchange={() => checkDuplicate(nameInput, realmInput)}
              id="version"
              name="version"
              class="select"
              bind:value={selectedVersion}
              required
            >
              {#each Object.values(GameVersionName) as version}
                <option value={version}>{t(`version.${version}`)}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
      <button type="submit" disabled={nameError ? true : false}
        >{t("ui.save")}</button
      >
      <button type="button" onclick={() => handleReset()}
        >{t(`ui.reset`)}</button
      >
    </form>
  </Content>
</Paper>

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
    background-color: var(--palette-primary-light);
  }
</style>
