import * as Client from "@storacha/client"

import {
  StorachaClientWrapper,
  StorachaService,
} from "@/app/services/storacha-service"

// Module-level singletons to reuse the same client across non-React code
let singletonClient: Client.Client | null = null
let singletonWrappedClient: StorachaClientWrapper | null = null
let initPromise: Promise<Client.Client> | null = null

export async function refreshSingletonClient(): Promise<Client.Client> {
  const newClient = await StorachaService.createClientWithDelegation()
  singletonClient = newClient
  singletonWrappedClient = new StorachaClientWrapper(
    newClient,
    refreshSingletonClient
  )
  return newClient
}

export async function getOrInitClient(): Promise<Client.Client> {
  if (singletonClient) return singletonClient
  if (initPromise) return initPromise
  initPromise = StorachaService.createClientWithDelegation()
    .then((created) => {
      singletonClient = created
      singletonWrappedClient = new StorachaClientWrapper(
        created,
        refreshSingletonClient
      )
      return created
    })
    .catch((e) => {
      initPromise = null
      throw e
    })
  return initPromise
}

export async function getOrInitWrappedClient(): Promise<StorachaClientWrapper> {
  if (singletonWrappedClient) return singletonWrappedClient
  const client = await getOrInitClient()
  singletonWrappedClient = new StorachaClientWrapper(
    client,
    refreshSingletonClient
  )
  return singletonWrappedClient
}

export function getActiveWrappedClient(): StorachaClientWrapper | null {
  return singletonWrappedClient
}
