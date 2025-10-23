import { NextResponse } from "next/server"
import { fetchProductData } from "@/app/services/product-service"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params
  const { searchParams } = new URL(request.url)
  const storeId = searchParams.get("storeId")
  const inventoryContract = searchParams.get("inventoryContract")
  const priceContract = searchParams.get("priceContract")

  const easscanGraphqlEndpoint = process.env.EASSCAN_GRAPHQL_ENDPOINT

  if (!easscanGraphqlEndpoint) {
    return NextResponse.json(
      { error: "Easscan GraphQL endpoint not configured" },
      { status: 500 }
    )
  }

  try {
    const productInfo = await fetchProductData(
      productId,
      easscanGraphqlEndpoint,
      storeId || undefined,
      inventoryContract as `0x${string}` | undefined,
      priceContract as `0x${string}` | undefined
    )

    return NextResponse.json({
      id: productId,
      data: productInfo,
    })
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}