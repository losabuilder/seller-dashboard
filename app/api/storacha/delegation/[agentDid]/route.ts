import { NextResponse } from "next/server"
import * as DID from "@ipld/dag-ucan/did"
import * as Client from "@storacha/client"
import { Signer } from "@storacha/client/principal/ed25519"
import * as Proof from "@storacha/client/proof"
import { StoreMemory } from "@storacha/client/stores/memory"
import { ServiceAbility } from "@storacha/client/types"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ agentDid: string }> }
) {
  try {
    const { agentDid } = await params

    if (!process.env.STORACHA_KEY || !process.env.STORACHA_PROOF) {
      console.error("API: Missing environment variables")
      return NextResponse.json(
        { error: "STORACHA_KEY or STORACHA_PROOF is not set" },
        { status: 500 }
      )
    }

    // Load client with specific private key
    const principal = Signer.parse(process.env.STORACHA_KEY)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })

    // Add proof that this agent has been delegated capabilities on the space
    const proof = await Proof.parse(process.env.STORACHA_PROOF)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

    // Create a delegation for a specific DID
    const audience = DID.parse(agentDid)
    const abilities: ServiceAbility[] = [
      "space/blob/add",
      "space/index/add",
      "filecoin/offer",
      "upload/add",
    ]
    const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours from now
    const delegation = await client.createDelegation(audience, abilities, {
      expiration,
    })

    // Serialize the delegation and send it to the client
    const archive = await delegation.archive()

    if (!archive.ok) {
      console.error("API: Archive creation failed:", archive.error)
      return NextResponse.json(
        { error: "Failed to create archive", details: archive.error },
        { status: 500 }
      )
    }

    // Return the raw binary data as ArrayBuffer
    return new NextResponse(archive.ok.slice().buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": archive.ok.length.toString(),
      },
    })
  } catch (error) {
    console.error("API: Error in delegation route:", error)
    return NextResponse.json(
      {
        error: "Failed to create delegation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
