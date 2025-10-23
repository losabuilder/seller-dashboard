import { NextResponse } from "next/server"
import { fetchStoreData } from "@/app/services/store-service"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params
  const easscanGraphqlEndpoint = process.env.EASSCAN_GRAPHQL_ENDPOINT

  if (!easscanGraphqlEndpoint) {
    return NextResponse.json(
      { error: "Easscan GraphQL endpoint not configured" },
      { status: 500 }
    )
  }

  try {
    const storeInfo = await fetchStoreData(storeId, easscanGraphqlEndpoint)
    
    return NextResponse.json({
      id: storeId,
      data: storeInfo,
    })
  } catch (error) {
    console.error("Failed to fetch store:", error)
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    )
  }
}
