import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  function setFeedbackCookie(value: string) {
    context.cookies.set({
      name: "feedback",
      value: encodeURIComponent(value),
      path: "/",
      maxAge: 600,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  function redirect(url: string = "/") {
    const baseUrl = new URL(req.url);
    const redirectUrl = new URL(url, baseUrl);
    return Response.redirect(redirectUrl.toString(), 303);
  }

  if (req.method !== "POST") {
    setFeedbackCookie("Method not allowed");
    return redirect();
  }

  try {
    const { email } = await req.json();

    if (!email) {
      setFeedbackCookie("Email is required");
      return redirect();
    }

    const store = getStore({ name: "waitlist" });
    await store.setJSON(email, { email, createdAt: new Date().toISOString() });

    setFeedbackCookie("Successfully joined the waitlist!");
    return redirect();
  } catch (error) {
    setFeedbackCookie("Failed to process request");
    return redirect();
  }
};

export const config: Config = {
  path: "/api/waitlist",
};
