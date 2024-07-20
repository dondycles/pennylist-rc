export async function GET() {
  const productLink = "Ah3CP";
  const licenseKey = "EJKPN-RCP8R-XY3D9-WTEKU";
  const apiKey = "c029141d2f32108df98d345ea0eab36eafc868d7";

  const url = `https://payhip.com/api/v1/license/verify?product_link=${productLink}&license_key=${licenseKey}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "payhip-api-key": apiKey,
    },
  });

  const data = await response.json();
  console.log(data);
  return new Response(data, {
    status: 200,
  });
}
