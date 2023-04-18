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

export function calcDmg(dmg: number, res: number, pierceNonBreaking: number, pierceBreaking: number): number {
  const resAfterPierce = calcRes(res, pierceNonBreaking, pierceBreaking)
  if (resAfterPierce > 99) {
    return 0
  }
  if (resAfterPierce < 0) {
    return Math.abs(dmg * (-1 + (resAfterPierce / 100)))
  }
  return dmg * (1 - (resAfterPierce / 100))
}