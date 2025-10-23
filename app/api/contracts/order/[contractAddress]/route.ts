import { NextRequest, NextResponse } from "next/server"
import { Address, createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"

import { ORDER_ABI } from "@/app/contracts/abis/losa/Order"

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    `${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_ENDPOINT}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  ),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractAddress: Address }> }
) {
  try {
    const { contractAddress } = await params

    const orderContract = {
      address: contractAddress,
      abi: ORDER_ABI,
    } as const

    // Call the contract data
    const results = await publicClient.multicall({
      contracts: [
        {
          ...orderContract,
          functionName: "s_orderPaidSchema",
        },
        {
          ...orderContract,
          functionName: "s_orderRefundedSchema",
        },
        {
          ...orderContract,
          functionName: "s_priceContract",
        },
        {
          ...orderContract,
          functionName: "s_inventoryContract",
        },
        {
          ...orderContract,
          functionName: "getBeforeOrderPlugins",
        },
      ],
    })

    // Extract the data from the response
    // viem returns results array, each item has { result, success }
    const [
      orderPaidSchemaResult,
      refundSchemaResult,
      priceContractResult,
      inventoryContractResult,
      pluginsResult,
    ] = results

    // Check if all calls were successful
    const allSuccessful = [
      orderPaidSchemaResult,
      refundSchemaResult,
      priceContractResult,
      inventoryContractResult,
      pluginsResult,
    ].every((result) => result?.status === "success")

    if (!allSuccessful) {
      console.warn("Some contract calls failed:", results)
    }

    // Return the contract data
    return NextResponse.json({
      data: {
        orderPaidSchema: orderPaidSchemaResult?.result || null,
        refundSchema: refundSchemaResult?.result || null,
        priceContract: priceContractResult?.result || null,
        inventoryContract: inventoryContractResult?.result || null,
        plugins: pluginsResult?.result || [],
      },
    })
  } catch (error) {
    console.error("Failed to fetch contract data:", error)
    return NextResponse.json(
      { error: "Failed to fetch contract data" },
      { status: 500 }
    )
  }
}
