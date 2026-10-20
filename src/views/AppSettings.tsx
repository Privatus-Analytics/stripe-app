import { Banner, Box, Inline, Link, SettingsView } from "@stripe/ui-extension-sdk/ui"
import { DOCS_URL, PRIVACY_URL, SIGNUP_URL, SUPPORT_EMAIL } from "../links"

// The settings page Stripe shows after install. Stripe adds its own "View API keys"
// button here, which makes the restricted key. This view only explains what to do
// with it. It stores nothing and calls nothing, so there is no Save button.
const AppSettings = () => (
  <SettingsView>
    <Box css={{ stack: "y", gap: "large" }}>
      <Banner
        type="default"
        title="Connect your subscriptions to Privatus Analytics"
        description="Privatus Analytics is cookieless web analytics. With this app it can also show MRR, churn and retention from your Stripe subscriptions, next to your traffic. It only reads. It never creates, changes or charges anything."
      />

      <Box css={{ stack: "y", gap: "small" }}>
        <Inline css={{ font: "heading" }}>Three steps</Inline>
        <Inline>1. Click View API keys on this page and copy the restricted key. In live mode, Stripe shows a live key only once, so copy it before you close the dialog.</Inline>
        <Inline>2. In Privatus Analytics, open your site, go to Subscriptions and choose Stripe.</Inline>
        <Inline>3. Paste the key and click Connect. Numbers appear as soon as the first sync finishes, and are refreshed every 6 hours after that.</Inline>
      </Box>

      <Box css={{ stack: "y", gap: "small" }}>
        <Inline css={{ font: "heading" }}>What the key can read</Inline>
        <Inline>Subscriptions, product names and coupons. Nothing else. No customer names, emails, cards or payments.</Inline>
        <Inline>You can roll or revoke the key here at any time. Disconnecting in Privatus Analytics also deletes the stored key and the subscription data read with it.</Inline>
      </Box>

      <Box css={{ stack: "y", gap: "xsmall" }}>
        <Link href={DOCS_URL} external>Read the setup guide</Link>
        <Link href={SIGNUP_URL} external>Create a Privatus Analytics account</Link>
        <Link href={PRIVACY_URL} external>Privacy policy</Link>
        <Link href={`mailto:${SUPPORT_EMAIL}`} external>Contact support</Link>
      </Box>
    </Box>
  </SettingsView>
)

export default AppSettings
