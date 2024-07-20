export async function POST(request: Request) {
  const text = await request.text();

  return new Response(text, {
    status: 200,
  });
}
