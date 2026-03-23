export default function handler(request, response) {
  return response.status(404).send('404 Not Found');
}
