export default async function feedback(request, context) {
  const response = await context.next();
  const feedback = context.cookies.get('feedback');

  if (!feedback) {
    return response;
  }

  // Get the HTML from the response
  let html = await response.text();

  // Insert feedback message after the <body> tag
  const feedbackHtml = `
    <div class="feedback">
      ${feedback}
    </div>
  `;

  html = html.replace('<body>', '<body>' + feedbackHtml);

  // Clear the feedback cookie
  context.cookies.delete('feedback');

  return new Response(html, {
    headers: response.headers,
  });
}