export async function binCheck(bin: string) {
  const apiKey = process.env.BIN_API_KEY;
  const url = `https://api.bincodes.com/bin/?format=json&api_key=${apiKey}&bin=${bin}`;
  const response = await fetch(url);
  return await response.json();
}
