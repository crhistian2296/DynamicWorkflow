export function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const localUrl = "http://localhost:3000";

  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : appUrl;
  return `${baseUrl}/${path}`;
}
