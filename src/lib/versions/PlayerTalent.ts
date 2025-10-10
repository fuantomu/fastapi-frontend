import type { PlayerTalentType, TalentRow } from '$lib/versions/GameVersionTypes';

export class PlayerTalent {
    private readonly _druid: TalentRow;
    private readonly _mage: TalentRow;
    private readonly _priest: TalentRow;
    private readonly _rogue: TalentRow;
    private readonly _warlock: TalentRow;
    private readonly _shaman: TalentRow;
    private readonly _paladin: TalentRow;
    private readonly _warrior: TalentRow;
    private readonly _hunter: TalentRow;
    private readonly _deathknight: TalentRow;
    private readonly _monk: TalentRow;

    private constructor(classes : PlayerTalentType) {
        this._druid = classes.druid;
        this._mage = classes.mage;
        this._priest = classes.priest;
        this._rogue = classes.rogue;
        this._warlock = classes.warlock;
        this._paladin = classes.paladin;
        this._warrior = classes.warrior;
        this._hunter = classes.hunter;
        this._shaman = classes.shaman;
        this._deathknight = classes.deathknight;
        this._monk = classes.monk;
    }

    get druid(): TalentRow {
        return this._druid;
    }

    get mage(): TalentRow {
        return this._mage;
    }

    get priest(): TalentRow {
        return this._priest;
    }

    get rogue(): TalentRow {
        return this._rogue;
    }

    get warlock(): TalentRow {
        return this._warlock;
    }

    get paladin(): TalentRow {
        return this._paladin;
    }

    get warrior(): TalentRow {
        return this._warrior;
    }

    get hunter(): TalentRow {
        return this._hunter;
    }

    get deathknight(): TalentRow {
        return this._deathknight;
    }

    get monk(): TalentRow {
        return this._monk;
    }

    get shaman(): TalentRow {
        return this._shaman;
    }

    static fromSource(source: PlayerTalentType) {
        return new PlayerTalent(source);
    }
}