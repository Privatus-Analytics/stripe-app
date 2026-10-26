# Privatus Analytics for Stripe

**See your subscription revenue next to your website traffic.**

Your visitors are in one dashboard and your subscription money is in Stripe. So
it is hard to see if more visitors really means more paying customers.

This Stripe app makes a read-only key for Privatus Analytics in a few clicks.
Paste it into your site's Subscriptions settings, and Privatus Analytics reads
your subscriptions. The key can't change anything in your Stripe account.

So you see your monthly recurring revenue (MRR) and churn (the share of
customers who cancel) next to your traffic, and you can get an alert when MRR
falls. The numbers are honest too. Privatus Analytics counts visits without
cookies, so there is no cookie pop-up for your analytics, and it leaves bots
out.

**Free plan, no card:** 10,000 events a month (an event is a page view or an action you track) on up to 3 sites. [Start free at privatusanalytics.com](https://privatusanalytics.com).

## About this repo

A data-only Stripe App with restricted API key (RAK) authentication. When a customer
installs it, Stripe makes a restricted key that has only the permissions below. The customer
copies it from the app's settings page and pastes it into Privatus Analytics under
Site, Subscriptions, Stripe. That is the same connection customers make today by hand
(`app/services/subscription_metrics/providers/stripe.rb`), minus choosing permissions
in the Stripe key form. There is no OAuth, no app backend and no data leaves the Stripe
Dashboard from this app. It does not touch event ingest: visits only come from the tracker script.

## What the key can read

Derived from `SubscriptionMetrics::Providers::Stripe` (pinned API version `2024-06-20`):

| Call | Permission | Why |
|---|---|---|
| `GET /v1/subscriptions?status=all&expand[]=data.discounts` | `subscription_read` | status, dates, price, quantity, currency, plan nickname. Required |
| the expanded `discounts` (coupons) on those subscriptions | `coupon_read` | MRR net of recurring discounts. See the open item below |
| `GET /v1/products/{id}` | `product_read` | plan names. Without it plans fall back to the price nickname or stay unnamed |

No `_write` permission, nothing for customers, charges, invoices, payment methods or
payments. The key is read-only by construction. Customer facing docs
(`content/docs/features/subscription-metrics.md`) tell people to give a hand-made key
Read on Subscriptions only. That works because product and coupon access are optional there.
The app asks for three because Stripe's rule is that expanding an object needs a permission for it.

Open item: `coupon_read` is my reading of that rule. In step 5 of the test plan, install the app and
connect with the generated key. If sync works with `coupon_read` removed from
`stripe-app.json`, remove it (fewer permissions is better for review). If you drop `product_read`
the only loss is plan names.

## Files

- `stripe-app.json` the manifest (validated against Stripe's published JSON schema)
- `src/views/AppSettings.tsx` the settings view with the three steps (`settings` viewport). Stripe adds its own View API keys button on that page
- `icon.png` 300 x 300 manifest icon, `assets/icon-512.png` larger copy
- `test/manifest.test.ts` checks permissions, naming rules, icon size and copy rules
- `SUBMISSION.md` listing copy, the test plan Stripe review needs, and your steps

## Develop

```sh
npm install
npm test
npm run typecheck
npm run start     # stripe apps start (needs stripe login)
npm run upload    # stripe apps upload
```
