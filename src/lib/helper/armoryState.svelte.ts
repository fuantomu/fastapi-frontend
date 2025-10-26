import type { Enchantment, EnchantmentState, Glyph, WCLRanking, WCLZone } from "$lib/types";

export function createEnchantmentState(_enchant: EnchantmentState) {
  let enchantment = $state(_enchant);
  return {
    get enchantment() {
      return enchantment;
    },
    set enchantment(value) {
      enchantment = value
    },
    set head(value: Enchantment[]) {
      enchantment.head = value;
    },
    set shoulders(value: Enchantment[]) {
      enchantment.shoulders = value;
    },
    set neck(value: Enchantment[]) {
      enchantment.neck = value;
    },
    set chest(value: Enchantment[]) {
      enchantment.chest = value;
    },
    set shirt(value: Enchantment[]) {
      enchantment.shirt = value;
    },
    set tabard(value: Enchantment[]) {
      enchantment.tabard = value;
    },
    set wrist(value: Enchantment[]) {
      enchantment.wrist = value;
    },
    set hands(value: Enchantment[]) {
      enchantment.hands = value;
    },
    set waist(value: Enchantment[]) {
      enchantment.waist = value;
    },
    set feet(value: Enchantment[]) {
      enchantment.feet = value;
    },
    set ring_1(value: Enchantment[]) {
      enchantment.ring_1 = value;
    },
    set ring_2(value: Enchantment[]) {
      enchantment.ring_2 = value;
    },
    set trinket_1(value: Enchantment[]) {
      enchantment.trinket_1 = value;
    },
    set trinket_2(value: Enchantment[]) {
      enchantment.trinket_2 = value;
    },
    set main_hand(value: Enchantment[]) {
      enchantment.main_hand = value;
    },
    set off_hand(value: Enchantment[]) {
      enchantment.off_hand = value;
    },
    set ranged(value: Enchantment[]) {
      enchantment.ranged = value;
    },
    get head() {
      return enchantment.head;
    },
    get shoulders() {
      return enchantment.shoulders;
    },
    get neck() {
      return enchantment.neck;
    },
    get chest() {
      return enchantment.chest;
    },
    get shirt() {
      return enchantment.shirt;
    },
    get tabard() {
      return enchantment.tabard;
    },
    get wrist() {
      return enchantment.wrist;
    },
    get hands() {
      return enchantment.hands;
    },
    get waist() {
      return enchantment.waist;
    },
    get feet() {
      return enchantment.feet;
    },
    get ring_1() {
      return enchantment.ring_1;
    },
    get ring_2() {
      return enchantment.ring_2;
    },
    get trinket_1() {
      return enchantment.trinket_1;
    },
    get trinket_2() {
      return enchantment.trinket_2;
    },
    get main_hand() {
      return enchantment.main_hand;
    },
    get off_hand() {
      return enchantment.off_hand;
    },
    get ranged() {
      return enchantment.ranged;
    }
  };
}

export function createWCLState(ranking: WCLRanking, zone: WCLZone) {
  let wclRanking = $state(ranking);
  let wclZone = $state(zone)
  return {
    get ranking(): WCLRanking {
      return wclRanking;
    },
    set ranking(value: WCLRanking) {
      Object.assign(wclRanking, value);
    },
    get zone(): WCLZone {
      return wclZone;
    },
    set zone(value: WCLZone) {
      Object.assign(wclZone, value);
    },
  };
}

export function createGlyphState(_glyphs: Glyph[]){
  let glyphs = $state(_glyphs);
  return {
    get glyphs(): Glyph[]{
      return glyphs
    },
    set glyphs(value: Glyph[]) {
      Object.assign(glyphs, value)
    }
  }
}