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

    try {
      const response = await fetch(`${BASE_URL}/${encodeURIComponent(code)}`, {
        method: "GET",
        redirect: "follow",
      });

      if (response.ok && response.redirected) {
        window.location.replace(response.url);
        return { error: null } as const;
      }

      if (response.status === 404) {
        return { error: notFoundMessage } as const;
      }

      return { error: genericErrorMessage } as const;
    } catch {
      return { error: genericErrorMessage } as const;
    }
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
