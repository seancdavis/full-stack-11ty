import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";
import type { Config, Context } from "@netlify/edge-functions";
import { getStore } from "@netlify/blobs";

export default async function handler(req: Request, context: Context) {
  const response = await context.next();

  const store = getStore({ name: "waitlist" });
  const waitlistBlobs = await store.list();
  const waitlistEmails = waitlistBlobs.blobs.map((blob) => blob.key);

  // Create an HTML Rewriter instance with a transformer for the feedback element
  const rewriter = new HTMLRewriter().on("current-waitlist", {
    element(element) {
      // Create a div with class="feedback" and set the feedback text as its content
      element.replace(
        `<div class="waitlist-count">There are ${waitlistEmails.length} people on the waitlist</div>`,
        {
          html: true,
        }
      );
    },
  });

  // Apply the transformation and return the modified response
  return rewriter.transform(response);
}

export const config: Config = {
  path: "/waitlist",
};
