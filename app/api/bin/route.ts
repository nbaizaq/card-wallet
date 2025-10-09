export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bin = searchParams.get("bin");
  if (!bin) {
    return Response.json({ error: "Bin is required" }, { status: 400 });
  }
  try {
    const response = await getBinCode(bin);
    return Response.json(response);
  } catch (error) {
    return Response.json(
      { error: "Something went wrong" + ((error as Error)?.message ?? "") },
      { status: 500 }
    );
  }
}

async function getBinCode(bin: string) {
  const apiKey = process.env.BIN_API_KEY;
  const url = `https://api.bincodes.com/bin/?format=json&api_key=${apiKey}&bin=${bin}`;
  const response = await fetch(url);
  return await response.json();
}
