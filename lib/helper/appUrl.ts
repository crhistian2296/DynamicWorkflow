export function getAppUrl(path: string) {
  const localUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  const baseUrl =
    process.env.NODE_ENV === "development" ? localUrl : vercelUrl || localUrl;
  return `${baseUrl}/${path}`;
}
