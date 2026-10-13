import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap not-found">
      <h1>Page not found</h1>
      <p>
        No story for this path
        {process.env.STORYBLOK_DELIVERY_API_TOKEN
          ? " in Storyblok (or mock fallback when no token)."
          : " in mock data. Add a token and matching story, or use / and /pricing."}
      </p>
      <p>
        <Link href="/">Back home</Link>
      </p>
    </div>
  );
}
