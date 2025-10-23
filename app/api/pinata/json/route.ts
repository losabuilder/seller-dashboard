import { NextResponse, type NextRequest } from "next/server"
import { pinata } from "@/utils/config"


export async function POST(request: NextRequest) {
  const data = await request.json()
  const upload = await pinata.upload.public.json(data)
  return NextResponse.json(upload, { status: 200 })
}
