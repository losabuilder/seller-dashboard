import { NextResponse } from "next/server"
import { fetchStoreData } from "@/app/services/store-service"
import type {
  StoreCreationResponse,
  StoreCreationAttestation,
} from "@/types/eas"
import type { StoreListItem } from "@/types/store"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    )
  }

  const storeCreationSchema = process.env.STORE_SCHEMA_UID

  if (!storeCreationSchema) {
    return NextResponse.json(
      { error: "Store schema UID not configured" },
      { status: 500 }
    )
  }

  const easscanGraphqlEndpoint = process.env.EASSCAN_GRAPHQL_ENDPOINT

  if (!easscanGraphqlEndpoint) {
    return NextResponse.json(
      { error: "Easscan GraphQL endpoint not configured" },
      { status: 500 }
    )
  }

  try {
    // First fetch all store creation attestations from the wallet address
    const response = await fetch(easscanGraphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetStoreCreationAttestations($where: AttestationWhereInput) {
            attestations(where: $where) {
              id
            }
          }
        `,
        variables: {
          where: {
            AND: [
              {
                revoked: {
                  equals: false,
                },
              },
              {
                attester: {
                  equals: wallet,
                },
              },
              {
                schemaId: {
                  equals: storeCreationSchema,
                },
              },
            ],
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status}`)
    }

    const data: StoreCreationResponse = await response.json()

    // Use shared function for each store
    const storeData: StoreListItem[] = await Promise.all(
      data.data.attestations.map(async (attestation: StoreCreationAttestation) => {
        const storeInfo = await fetchStoreData(attestation.id, easscanGraphqlEndpoint)
        
        return {
          id: attestation.id,
          data: storeInfo,
        }
      })
    )

    return NextResponse.json(storeData)
  } catch (error) {
    console.error("GraphQL query failed:", error)
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    )
  }
}
