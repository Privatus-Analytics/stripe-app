import { readFileSync, existsSync } from "node:fs"
import { describe, expect, it } from "vitest"

const manifest = JSON.parse(readFileSync(new URL("../stripe-app.json", import.meta.url), "utf8"))
const settingsSource = readFileSync(new URL("../src/views/AppSettings.tsx", import.meta.url), "utf8")

// Read permissions the subscription metrics provider needs, from
// app/services/subscription_metrics/providers/stripe.rb:
//  GET /v1/subscriptions?expand[]=data.discounts  -> subscription_read, coupon_read (expanded discounts)
//  GET /v1/products/{id}                          -> product_read (optional plan names)
const NEEDED = ["subscription_read", "product_read", "coupon_read"]

describe("stripe-app.json", () => {
  it("is a public, sandbox compatible restricted key app", () => {
    expect(manifest.distribution_type).toBe("public")
    expect(manifest.sandbox_install_compatible).toBe(true)
    expect(manifest.stripe_api_access_type).toBe("restricted_api_key")
  })

  it("requests exactly the read permissions we use and no write permission", () => {
    const names = manifest.permissions.map((p: { permission: string }) => p.permission).sort()
    expect(names).toEqual([...NEEDED].sort())
    expect(names.some((n: string) => n.endsWith("_write"))).toBe(false)
  })

  it("explains every permission to the installer", () => {
    for (const p of manifest.permissions) {
      expect(p.purpose.length).toBeGreaterThan(30)
      expect(p.purpose).toContain("Privatus Analytics")
    }
  })

  it("follows Stripe's naming rules", () => {
    expect(manifest.name.length).toBeLessThanOrEqual(35)
    expect(manifest.name).not.toMatch(/\b(stripe|app|free|paid|rak|api key|generator|authenticator)\b/i)
    expect(manifest.id).toMatch(/^com\.[a-z0-9.]+$/)
  })

  it("ships a 300x300 PNG icon", () => {
    expect(existsSync(new URL("../icon.png", import.meta.url))).toBe(true)
    const png = readFileSync(new URL("../icon.png", import.meta.url))
    expect(png.subarray(1, 4).toString()).toBe("PNG")
    expect(png.readUInt32BE(16)).toBe(300)
    expect(png.readUInt32BE(20)).toBe(300)
  })

  it("has no localhost redirect URIs or hard-coded keys", () => {
    const text = JSON.stringify(manifest) + settingsSource
    expect(text).not.toMatch(/localhost|127\.0\.0\.1/)
    expect(text).not.toMatch(/(rk|sk|pk)_(live|test)_\w+/)
  })

  it("keeps user-facing copy free of em dashes and semicolons", () => {
    const copy = JSON.stringify(manifest.permissions) + settingsSource.replace(/^import.*$/gm, "")
    expect(copy).not.toMatch(/—/)
    const jsxText = [...settingsSource.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]).join(" ")
    expect(jsxText).not.toContain(";")
  })

  it("never says Privatus on its own", () => {
    const text = JSON.stringify(manifest) + settingsSource
    expect(text.match(/Privatus(?! Analytics)(?!analytics)/g) ?? []).toEqual([])
  })
})
