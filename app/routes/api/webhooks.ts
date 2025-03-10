import type { WebhookEvent } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/webhooks";
import { Webhook } from "svix";
import { db } from "~/db";
import { user } from "~/db/schema";
import env from "~/env";

export async function action({ request }: Route.ActionArgs) {
  if (!env.CLERK_SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }
  const wh = new Webhook(env.CLERK_SIGNING_SECRET);
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    console.log(
      `🤖 User created: ${evt.data.email_addresses[0].email_address}`
    );
    await db.insert(user).values({ id: evt.data.id });
  }

  return new Response("Webhook received", { status: 200 });
}
