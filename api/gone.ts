export default function handler(request, response) {
  response.setHeader('Content-Type', 'text/html');
  return response.status(410).send('<p>This page has been permanently removed.</p>');
}
