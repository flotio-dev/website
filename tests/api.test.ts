import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "../src/lib/api";

describe("API client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("encodes query parameters and sends JSON headers", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(api.get<{ ok: boolean }>("/health", { search: "a b" })).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL || "/api"}/health?search=a+b`,
      expect.objectContaining({
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("surfaces the API error message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(api.get("/private")).rejects.toThrow("denied");
  });
});
