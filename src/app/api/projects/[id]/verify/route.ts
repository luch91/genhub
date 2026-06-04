import { NextRequest } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function POST(_: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const project = await db.project.findUnique({ where: { id } })
  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.authorId !== session.user.id) {
    return Response.json({ error: "Only the project author can verify the contract" }, { status: 403 })
  }
  if (!project.contractAddress) {
    return Response.json({ error: "This project has no contract address" }, { status: 422 })
  }
  if (project.verified) {
    return Response.json({ verified: true })
  }

  const rpcUrl = process.env.GENLAYER_RPC_URL ?? "https://studio.genlayer.com:8443/api"

  try {
    const rpcRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getCode",
        params: [project.contractAddress, "latest"],
        id: 1,
      }),
    })

    const rpcJson = await rpcRes.json() as { result?: string; error?: { message: string } }

    if (rpcJson.error) {
      return Response.json({ error: `RPC error: ${rpcJson.error.message}` }, { status: 502 })
    }

    const code = rpcJson.result ?? "0x"
    const isDeployed = code.length > 2 && code !== "0x0"

    if (!isDeployed) {
      return Response.json(
        { error: "No contract found at this address on the GenLayer network" },
        { status: 422 }
      )
    }

    await db.project.update({ where: { id }, data: { verified: true } })
    return Response.json({ verified: true })
  } catch {
    return Response.json({ error: "Could not reach the GenLayer network" }, { status: 502 })
  }
}
