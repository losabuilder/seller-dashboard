import { encode } from "@ensdomains/content-hash"
import { CarWriter } from "@ipld/car"
import * as dagCbor from "@ipld/dag-cbor"
import * as Client from "@storacha/client"
import * as Delegation from "@storacha/client/delegation"
import { CID } from "multiformats/cid"
import { sha256 } from "multiformats/hashes/sha2"

import { getOrInitWrappedClient } from "@/app/services/storacha-client-singleton"

export type FileMetadata = {
  mime: string
  alt: string
  width?: number
  height?: number
}

export type UploadResult = {
  cid: string // CIDv1 (base32)
  contentHash: `0x${string}` // EIP-1577 contentHash bytes
  metadata?: FileMetadata // Extracted file metadata
}

export type StorachaClient = {
  uploadCAR: (
    arg: { stream: () => ReadableStream<Uint8Array> },
    opts?: { signal?: AbortSignal }
  ) => Promise<UploadResult>
  uploadFile: (file: File) => Promise<UploadResult>
}

/**
 * Wrapper class that automatically handles delegation refresh for Storacha operations
 */
export class StorachaClientWrapper {
  private client: Client.Client
  private refreshClient: () => Promise<Client.Client>
  private retries: number

  constructor(
    client: Client.Client,
    refreshClient: () => Promise<Client.Client>,
    retries: number = 3
  ) {
    this.client = client
    this.refreshClient = refreshClient
    this.retries = retries
  }

  /**
   * Execute a Storacha operation with automatic delegation refresh on failure
   */
  private async executeWithRefresh<T>(
    operation: (client: Client.Client) => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        return await operation(this.client)
      } catch (error) {
        lastError = error as Error
        console.warn(`${operationName} attempt ${attempt} failed:`, error)

        if (attempt === this.retries) {
          throw new Error(
            `${operationName} failed after ${this.retries} attempts: ${lastError.message}`
          )
        }

        // Try to refresh the client delegation before retry
        if (attempt < this.retries) {
          try {
            console.log(
              `Refreshing Storacha client delegation before ${operationName} retry ${attempt + 1}`
            )
            const refreshedClient = await this.refreshClient()
            // Update the client reference for the next attempt
            Object.assign(this.client, refreshedClient)
          } catch (refreshError) {
            console.warn("Failed to refresh client delegation:", refreshError)
            // Continue with retry even if refresh failed
          }
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
      }
    }

    throw lastError || new Error(`${operationName} failed`)
  }

  // Proxy all client methods with automatic refresh
  async uploadCAR(
    arg: { stream: () => ReadableStream<Uint8Array> },
    opts?: { signal?: AbortSignal }
  ): Promise<UploadResult> {
    const transformedArg = {
      stream: () =>
        arg.stream().pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(new Uint8Array(chunk))
            },
          })
        ),
    }
    const cid = await this.executeWithRefresh(
      (client) => client.uploadCAR(transformedArg, opts),
      "uploadCAR"
    )

    const cidString = cid.toString()
    const contentHash = ("0x" + encode("ipfs", cidString)) as `0x${string}`

    return { cid: cidString, contentHash }
  }

  async uploadFile(file: File): Promise<UploadResult> {
    const cid = await this.executeWithRefresh(
      (client) => client.uploadFile(file),
      "uploadFile"
    )

    const cidString = cid.toString()
    const contentHash = ("0x" + encode("ipfs", cidString)) as `0x${string}`

    return { cid: cidString, contentHash }
  }

  // Add any other methods you need from the Storacha client
  // They will be proxied through without automatic refresh unless you wrap them
}

/**
 * Service for Storacha uploads using CAR format with DAG-CBOR
 */
export class StorachaService {
  /**
   * Extract metadata from a file
   */
  private static async extractFileMetadata(file: File): Promise<FileMetadata> {
    const metadata: FileMetadata = {
      mime: file.type,
      alt: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
    }

    // For images, extract dimensions
    if (file.type.startsWith("image/")) {
      try {
        const dimensions = await this.getImageDimensions(file)
        metadata.width = dimensions.width
        metadata.height = dimensions.height
      } catch (error) {
        console.warn("Failed to extract image dimensions:", error)
      }
    }

    return metadata
  }

  /**
   * Get image dimensions from a file
   */
  private static getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error("Failed to load image"))
      }

      img.src = url
    })
  }

  /**
   * Create a client for frontend use with delegation
   */
  static async createClientWithDelegation(): Promise<Client.Client> {
    try {
      // Create a new client
      console.log("Creating Storacha client...")
      const client = await Client.create()
      console.log("Client created successfully, agent DID:", client.agent.did())

      // Fetch delegation from backend
      console.log("Fetching delegation from backend...")
      const response = await fetch(
        `/api/storacha/delegation/${client.agent.did()}`
      )
      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          "Failed to get Storacha delegation:",
          response.status,
          errorText
        )
        throw new Error(
          `Failed to get Storacha delegation: ${response.status} ${errorText}`
        )
      }

      // Get the raw binary data as ArrayBuffer
      const arrayBuffer = await response.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)
      console.log("Delegation data received, length:", data.length)

      // Deserialize the delegation
      console.log("Extracting delegation...")
      const delegationResult = await Delegation.extract(data)
      if (!delegationResult.ok) {
        console.error("Failed to extract delegation:", delegationResult.error)
        throw new Error("Failed to extract delegation", {
          cause: delegationResult.error,
        })
      }
      console.log("Delegation extracted successfully")

      // Add proof that this agent has been delegated capabilities on the space
      console.log("Adding space to client...")
      const space = await client.addSpace(delegationResult.ok)
      console.log("Space added successfully, DID:", space.did())

      console.log("Setting current space...")
      client.setCurrentSpace(space.did())
      console.log("Current space set successfully")

      return client
    } catch (error) {
      console.error("Error in createClientWithDelegation:", error)
      throw error
    }
  }

  /**
   * Upload text as DAG-CBOR to Storacha using CAR format
   */
  static async uploadTextDagCborWithStoracha(
    client: StorachaClient,
    text: string,
    opts: { signal?: AbortSignal; timeoutMs?: number; normalize?: boolean } = {}
  ): Promise<UploadResult> {
    if (!client || typeof client.uploadCAR !== "function") {
      throw new Error(
        "client must be an @storacha/client instance with uploadCAR available"
      )
    }
    if (typeof text !== "string") throw new TypeError("text must be a string")

    const normalize = opts.normalize ?? true
    const timeoutMs = opts.timeoutMs ?? 30_000

    // Abort/timeout wiring
    const controller = new AbortController()
    const onAbort = () => controller.abort()
    let timer: ReturnType<typeof setTimeout> | null = null

    try {
      if (opts.signal?.aborted) throw new DOMException("Aborted", "AbortError")
      if (opts.signal) opts.signal.addEventListener("abort", onAbort)
      if (timeoutMs > 0) timer = setTimeout(() => controller.abort(), timeoutMs)

      // 1) Normalize for deterministic hashing (Unicode NFC)
      const payload = normalize ? text.normalize("NFC") : text

      // 2) Encode as DAG-CBOR *string*
      const bytes = dagCbor.encode(payload)

      // 3) Hash → CIDv1(dag-cbor)
      const mh = await sha256.digest(bytes)
      const cidObj = CID.createV1(dagCbor.code, mh)
      const cid = cidObj.toString()

      // 4) Build CAR containing the single block
      const { writer, out } = CarWriter.create([cidObj])
      const chunks: Uint8Array[] = []
      const pump = (async () => {
        for await (const chunk of out) chunks.push(chunk)
      })()
      await writer.put({ cid: cidObj, bytes })
      await writer.close()
      await pump
      const carBlob = new Blob(
        chunks.map((chunk) => new Uint8Array(chunk)),
        { type: "application/car" }
      )

      // 5) Upload CAR via @storacha/client
      const result = await client.uploadCAR(
        { stream: () => (carBlob).stream() },
        { signal: controller.signal }
      )

      // Sanity check (should match our locally computed CID)
      if (result.cid !== cid) {
        console.warn(
          "Storacha returned a different CID than local calculation",
          {
            local: cid,
            remote: result.cid,
          }
        )
      }

      // 6) Produce EIP-1577 contentHash (ipfs) from the CID
      const chHex = ("0x" + encode("ipfs", result.cid)) as `0x${string}`

      return { cid: result.cid, contentHash: chHex }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError")
        throw new Error("Upload aborted or timed out")
      const errorMessage = err instanceof Error ? err.message : String(err)
      throw new Error(errorMessage)
    } finally {
      if (timer) clearTimeout(timer)
      if (opts.signal) opts.signal.removeEventListener("abort", onAbort)
    }
  }

  /**
   * Convenience: Upload text using the shared singleton client
   */
  static async uploadText(
    text: string,
    opts: {
      signal?: AbortSignal
      timeoutMs?: number
      normalize?: boolean
    } = {},
    client?: StorachaClient
  ): Promise<UploadResult> {
    const activeClient = client ?? (await getOrInitWrappedClient())
    return this.uploadTextDagCborWithStoracha(
      activeClient as unknown as StorachaClient,
      text,
      opts
    )
  }

  /**
   * Convenience: Upload JSON using the shared singleton client
   */
  static async uploadJson(
    data: unknown,
    opts: { signal?: AbortSignal; timeoutMs?: number } = {},
    client?: StorachaClient
  ): Promise<UploadResult> {
    const activeClient = client ?? (await getOrInitWrappedClient())
    return this.uploadJsonDagCborWithStoracha(
      activeClient as unknown as StorachaClient,
      data,
      opts
    )
  }

  /**
   * Convenience: Upload file using the shared singleton client
   */
  static async uploadFile(
    file: File,
    client?: StorachaClient
  ): Promise<UploadResult> {
    const activeClient = client ?? (await getOrInitWrappedClient())
    if (!activeClient || typeof activeClient.uploadFile !== "function") {
      throw new Error(
        "client must be an @storacha/client instance with uploadFile available"
      )
    }

    // Run metadata extraction and file upload in parallel
    const [metadata, result] = await Promise.all([
      this.extractFileMetadata(file),
      activeClient.uploadFile(file),
    ])

    // Add metadata to result
    return {
      ...result,
      metadata,
    }
  }

  /**
   * Upload JSON data as DAG-CBOR to Storacha
   */
  static async uploadJsonDagCborWithStoracha(
    client: StorachaClient,
    data: unknown,
    opts: { signal?: AbortSignal; timeoutMs?: number } = {}
  ): Promise<UploadResult> {
    const jsonString = JSON.stringify(data)
    return this.uploadTextDagCborWithStoracha(client, jsonString, opts)
  }
}
