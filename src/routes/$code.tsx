import { createFileRoute } from "@tanstack/react-router";

import { BASE_URL } from "#/constants";

const notFoundMessage = "Link not found.";
const genericErrorMessage = "Unable to resolve this link.";

export const Route = createFileRoute("/$code")({
  loader: async ({ params }) => {
    const code = params.code?.trim();
    if (!code) {
      return { error: notFoundMessage } as const;
    }

  window.location.replace(`${BASE_URL}/${encodeURIComponent(code)}`);
  return { error: null } as const;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  if (data?.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm mono" style={{ color: "var(--text)" }}>
          {data.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm mono" style={{ color: "var(--text)" }}>
        Redirecting...
      </div>
    </div>
  );
}
