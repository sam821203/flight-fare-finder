# Flight Price Notifier v1

## Build
- Replace the placeholder with a dark, bilingual landing page at `/` using violet accents, a prominent product name, an airfare-focused visual treatment, three requested feature cards, and the 2026 footer.
- Add a combined authentication page at `/auth` with clear Sign In and Sign Up modes using email and password only.
- Add a protected `/app` shell that verifies the signed-in account before rendering, greets the user by email, shows the milestone placeholder, and provides secure sign-out.
- Keep all account state in the built-in authentication system; do not create profile, subscription, or application-data tables.

## Experience
- Use an Inter-based responsive design with near-black surfaces, violet highlights, compact mobile navigation, and restrained entrance/scroll animation.
- Show useful loading and error states for sign-in, sign-up, route protection, and sign-out.
- Redirect successful sign-in/sign-up to `/app`; redirect signed-out visitors from `/app` to `/auth`.

## Validation
- Check the landing page and authentication screens at desktop and mobile sizes.
- Verify protected-route behavior and the signed-out authentication flow.
- Confirm the generated app has no build or browser errors.
