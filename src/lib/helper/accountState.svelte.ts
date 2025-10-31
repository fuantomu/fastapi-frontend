import type { Account } from "$lib/types";

export function createAccountState(_account: Account) : Account {
  let account = $state(_account)
  return account
}
