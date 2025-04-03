import { getStore } from "@netlify/blobs";
import { purgeCache, type Config, type Context } from "@netlify/functions";

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
    const formData = await req.formData();
    const email = formData.get("email") as string | null;

    if (!email) {
      setFeedbackCookie("Email is required");
      return redirect();
    }

    const store = getStore({ name: "waitlist" });
    await store.setJSON(email, { email, createdAt: new Date().toISOString() });

    // await purgeCache({ tags: ["waitlist"] });
    setFeedbackCookie("Successfully joined the waitlist!");
    return redirect();
  } catch (error) {
    setFeedbackCookie("Failed to process request");
    console.error(error);
    return redirect();
  }
};

export const config: Config = {
  path: "/api/waitlist",
};
