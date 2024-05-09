export enum ElementalDmgType {
  Physical,
  Magic,
  Fire,
  Lightning,
  Cold,
  Poison,
}

export function calcRes(res: number, pierceNonBreaking: number = 0, pierceBreaking: number = 0): number {
  let resAfterImmunityRemoval = res;
  if (res > 99) {
    resAfterImmunityRemoval -= Math.floor(pierceBreaking / 2)
  } else {
    resAfterImmunityRemoval -= pierceBreaking
  }

  if (resAfterImmunityRemoval > 99) {
    return resAfterImmunityRemoval
  }

  if ((resAfterImmunityRemoval - pierceNonBreaking) < 0) {
    // Not sure if/how this is rounded within d2, but it is most often
    // in a negative way for the player.
    // should not make a big difference either way
    return Math.floor((resAfterImmunityRemoval - pierceNonBreaking) / 2)
  }

  return resAfterImmunityRemoval - pierceNonBreaking
}

export function calcDmg(
  dmg: number,
  res: number,
  pierceNonBreaking: number,
  pierceBreaking: number,
  elementalDmgType: ElementalDmgType,
  considerPlr: boolean,
): number {
  const resAfterPierce = calcRes(res, pierceNonBreaking, pierceBreaking)
  if (resAfterPierce > 99) {
    return 0
  }

  let dmgAfterPierce;
  if (resAfterPierce < 0) {
    dmgAfterPierce = dmg * (1 + (Math.abs(resAfterPierce) / 100))
  } else {
    dmgAfterPierce = dmg * (1 - (resAfterPierce / 100))
  }

  if (elementalDmgType === ElementalDmgType.Poison && considerPlr) {
    return dmgAfterPierce * (1 + (Math.min(Math.abs(pierceNonBreaking / 2), 100) / 100))
  }
  return dmgAfterPierce
}