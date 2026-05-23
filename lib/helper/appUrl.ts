export function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const localUrl = appUrl || "http://localhost:3000";
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? localUrl
      : appUrl || vercelUrl || localUrl;
  return `${baseUrl}/${path}`;
}
