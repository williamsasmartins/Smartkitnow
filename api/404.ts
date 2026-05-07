export default function handler(request, response) {
  return response.status(410).send('410 Gone');
}
