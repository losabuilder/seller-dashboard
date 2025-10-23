import { NextResponse } from "next/server"
import { fetchProductData } from "@/app/services/product-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const wallet = searchParams.get("wallet")
  const storeId = searchParams.get("storeId")
  const inventoryContract = searchParams.get("inventoryContract")
  const priceContract = searchParams.get("priceContract")

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    )
  }

  if (!storeId && !inventoryContract && !priceContract) {
    return NextResponse.json(
      { error: "At least storeId, inventoryContract, or priceContract is required" },
      { status: 400 }
    )
  }

  const variationSchema = process.env.VARIATION_SCHEMA_UID

  if (!variationSchema) {
    return NextResponse.json(
      { error: "Variation schema UID not configured" },
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

    // Fetch all variation attestations from the wallet address
    // Since variations are created by the user and reference products, we query variations
    const response = await fetch(easscanGraphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetVariationAttestations($where: AttestationWhereInput) {
            attestations(where: $where) {
              id
              refUID
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
                  equals: variationSchema,
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

    const data = await response.json()

    // For each variation, get the product data and filter by store ID
    const productData = await Promise.all(
      data.data.attestations.map(async (attestation: { id: string; refUID: string }) => {
        const productInfo = await fetchProductData(
          attestation.refUID,
          easscanGraphqlEndpoint,
          storeId || undefined,
          inventoryContract as `0x${string}` | undefined,
          priceContract as `0x${string}` | undefined
        )

        return {
          id: attestation.refUID, // Use product UID as the main ID
          variationId: attestation.id, // Keep variation ID for reference
          data: productInfo,
        }
      })
    )

    // Filter out products that don't belong to the specified store
    const filteredProducts = productData.filter(product => product.data !== null)

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error("GraphQL query failed:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}