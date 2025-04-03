import { HTMLRewriter } from "https://ghuc.cc/worker-tools/html-rewriter/index.ts";
import type { Context } from "@netlify/edge-functions";

export default async function handler(req: Request, context: Context) {
  const response = await context.next();
  const feedback = context.cookies.get("feedback");

  if (!feedback) {
    return response;
  }

  // Create an HTML Rewriter instance with a transformer for the feedback element
  const rewriter = new HTMLRewriter().on("feedback", {
    element(element) {
      // Create a div with class="feedback" and set the feedback text as its content
      element.replace(
        `<div class="feedback">${decodeURIComponent(feedback)}</div>`,
        {
          html: true,
        }
      );
    },
  });

  // Clear the feedback cookie
  context.cookies.delete("feedback");

  // Apply the transformation and return the modified response
  return rewriter.transform(response);
}
