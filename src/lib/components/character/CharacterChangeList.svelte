<script lang="ts">
  import WarcraftIcon from "../WarcraftIcon.svelte";
  import Menu from "@smui/menu";
  import List, { Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import { t } from "$lib/i18n/index.svelte";
  import { getContext } from "svelte";
  import type { VersionContext } from "$lib/versions/VersionContext";
  import { PlayerClass } from "$lib/versions/PlayerClass";
  import { Faction, Gender, ICON_QUESTIONMARK, RaceFaction } from "$lib/consts";
  import type { PlayerRace } from "$lib/versions/PlayerRace";
  import { PlayerSpec } from "$lib/versions/PlayerSpecialization";

  let {
    currentClass,
    currentRace,
    currentSpec,
    gender
  } = $props<{
    currentClass: PlayerClass;
    currentRace: PlayerRace;
    currentSpec: PlayerSpec;
    gender: Gender
  }>();

  const gameVersionFactory = getContext<VersionContext>("gameVersionFactory");
  let openClass = $state(false);
  let openRace = $state(false);
  let openSpec = $state(false);
  let currentFaction = $state(Faction.Alliance);

  let race_classes = $state(
    gameVersionFactory.gameVersion
      .getRaceClasses(currentRace.name)
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
  const versionRaces: PlayerRace[] = gameVersionFactory.gameVersion
    .getRaces()
    .filter((_race) => _race.name !== "Alien");
  let currentPlayerRace: PlayerRace = $state(
    versionRaces.find((_race) => _race.name === currentRace.name) ??
      versionRaces[0]
  );

  let currentClassSpecs: PlayerSpec[] = $state(
    gameVersionFactory.gameVersion
      .getSpecs()
      .filter((_spec) => _spec.playerClass.name === `${currentClass.name}`) ??
      []
  );

  function handleChangeRace(race: PlayerRace) {
    if (race) {
      currentPlayerRace = race;
      race_classes = gameVersionFactory.gameVersion
        .getRaceClasses(race.name)
        .map((_race) => _race.rclass);
      versionClasses = gameVersionFactory.gameVersion
        .getClasses()
        .filter(
          (_class) =>
            _class.name !== "Adventurer" && race_classes.includes(_class.name)
        );
      if (!versionClasses.find((_class) => _class.name === currentClass.name)) {
        currentClass = { name: "Adventurer" } as PlayerClass;
        currentSpec = { name: "Adventurer" } as PlayerSpec;
      }
    }
    getFaction();
    openRace = false;
  }

  function handleChangeClass(pclass: PlayerClass) {
    if (pclass) {
      currentClass = pclass;
      currentClassSpecs = gameVersionFactory.gameVersion
        .getSpecs()
        .filter((_spec) => _spec.playerClass.name === `${currentClass.name}`);
      currentSpec = { name: "Adventurer" } as PlayerSpec;
    }
    openClass = false;
  }

  let genderIcon: string = $state(
    gender === Gender.Female
      ? "/image/gender_2_icon.png"
      : "/image/gender_1_icon.png"
  );
  function handleChangeGender() {
    if (gender === Gender.Female) {
      gender = Gender.Male;
      genderIcon = "/image/gender_1_icon.png";
    } else {
      gender = Gender.Female;
      genderIcon = "/image/gender_2_icon.png";
    }
  }

  function handleChangeSpec(_spec: PlayerSpec) {
    currentSpec = _spec;
  }

  function getFaction() {
    if (currentPlayerRace.name === "Pandaren") {
      return currentFaction;
    }
    let faction = Object.entries(RaceFaction).find(
      (r) => r[0] == currentPlayerRace.name
    );
    if (faction) {
      return faction[1];
    }
    return Faction.Alliance;
  }

  function handleChangeFaction(event: Event) {
    event.stopPropagation();
    if (currentFaction === Faction.Alliance) {
      currentFaction = Faction.Horde;
    } else {
      currentFaction = Faction.Alliance;
    }
  }
</script>

<div>
  <input
    id="character_class"
    type="hidden"
    name="character_class"
    value={currentClass.name}
  />
  <input id="race" type="hidden" name="race" value={currentPlayerRace.name} />
  <input id="gender" type="hidden" name="gender" value={gender} />
  <input
    id="active_spec"
    type="hidden"
    name="active_spec"
    value={currentSpec.name.replace(currentClass.name, "")}
  />
  <input id="faction" type="hidden" name="faction" value={getFaction()} />
  <IconButton
    type="button"
    aria-label={t(`ui.changeRace`)}
    onclick={() => (openRace = !openRace)}
  >
    <WarcraftIcon
      src={gameVersionFactory.iconProvider.getFromSource(
        gender === Gender.Male
          ? currentPlayerRace.icon_male
          : (currentPlayerRace.icon_female ?? ICON_QUESTIONMARK)
      )}
      label={t(`ui.changeRace`)}
    />
  </IconButton>
  <Menu bind:open={openRace}>
    <List>
      {#each versionRaces as race}
        <Item
          onclick={() => {
            handleChangeRace(race);
          }}
          style={currentPlayerRace.name === race.name
            ? "background-color: var(--palette-success-dark);"
            : ""}
        >
          <WarcraftIcon
            src={gameVersionFactory.iconProvider.getFromSource(
              gender === Gender.Male ? race.icon_male : race.icon_female
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
                    .find((_faction) => _faction.name === currentFaction)
                    ?.icon ?? ICON_QUESTIONMARK
                )}
                label={t(`faction.${currentFaction}`)}
              />
            </IconButton>
          {/if}
          <Text style={"margin: 20px"}>{t(`race.${race.name}`)}</Text>
        </Item>
      {/each}
    </List>
  </Menu>
  <IconButton
    type="button"
    aria-label={t(`ui.changeClass`)}
    onclick={() => (openClass = !openClass)}
  >
    <WarcraftIcon
      src={gameVersionFactory.iconProvider.getFromSource(
        currentClass.icon ?? ICON_QUESTIONMARK
      )}
      label={t(`ui.changeClass`)}
    />
  </IconButton>
  <Menu bind:open={openClass}>
    <List>
      {#each versionClasses as _class}
        <Item
          onclick={() => {
            handleChangeClass(_class);
          }}
          style={currentClass.name === _class.name
            ? "background-color: var(--palette-success-dark);"
            : ""}
        >
          <WarcraftIcon
            src={gameVersionFactory.iconProvider.getFromSource(_class.icon)}
            label={`class.${_class.name}`}
          />
          <Text style={`margin: 20px; color: ${_class.colour}`}
            >{t(`class.${_class.name}`)}</Text
          >
        </Item>
      {/each}
    </List>
  </Menu>
  <IconButton
    type="button"
    aria-label={t(`ui.changeSpecialization`)}
    onclick={() => (openSpec = !openSpec)}
  >
    <WarcraftIcon
      src={gameVersionFactory.iconProvider.getFromSource(
        currentSpec.icon ?? ICON_QUESTIONMARK
      )}
      label={t(`ui.changeSpecialization`)}
    />
  </IconButton>
  <Menu bind:open={openSpec}>
    <List>
      {#each currentClassSpecs as _spec}
        <Item
          onclick={() => {
            handleChangeSpec(_spec);
          }}
          style={currentSpec.name === _spec.name
            ? "background-color: var(--palette-success-dark);"
            : ""}
        >
          <WarcraftIcon
            src={gameVersionFactory.iconProvider.getFromSource(_spec.icon)}
            label={`spec.${_spec.name}`}
          />
          <Text style={`margin: 20px; color: ${currentClass.colour}`}
            >{t(`spec.${_spec.name}`)}</Text
          >
        </Item>
      {/each}
    </List>
  </Menu>
  <IconButton
    type="button"
    aria-label={t(`ui.changeGender`)}
    onclick={() => handleChangeGender()}
    ripple={false}
  >
    <img
      style={"height: 36px; width: 36px"}
      src={genderIcon}
      alt={t(`ui.changeGender`)}
    />
  </IconButton>
</div>
