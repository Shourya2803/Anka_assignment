import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify headers or bypass in local development if secret is not set/mock
  let evt: WebhookEvent

  if (!WEBHOOK_SECRET || WEBHOOK_SECRET === "mock") {
    console.warn("⚠️ Clerk Webhook signature validation bypassed. Provide CLERK_WEBHOOK_SECRET for production.")
    evt = payload as WebhookEvent
  } else {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing svix headers", {
        status: 400,
      })
    }

    // Create a new Svix instance with secret
    const wh = new Webhook(WEBHOOK_SECRET)

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error("Error: Could not verify webhook:", err)
      return new Response("Error: Verification failed", {
        status: 400,
      })
    }
  }

  // Handle the webhook event
  const eventType = evt.type
  console.log(`Clerk webhook received event: ${eventType}`)

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const data = evt.data
      const id = data.id
      const first_name = (data as any).first_name || ""
      const last_name = (data as any).last_name || ""
      const name = `${first_name} ${last_name}`.trim() || "User"
      const email = (data as any).email_addresses?.[0]?.email_address

      if (!email) {
        return new Response("Error: User has no email address", { status: 400 })
      }

      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: email,
          name: name,
        },
        update: {
          email: email,
          name: name,
        },
      })

      console.log(`Successfully synced user ${id} in DB.`)
    } else if (eventType === "user.deleted") {
      const data = evt.data
      const id = data.id

      if (id) {
        await prisma.user.delete({
          where: { clerkId: id },
        })
        console.log(`Successfully deleted user ${id} from DB.`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user database record in webhook:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
