<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- The project's own Supabase project (`ftjrymqioaatktnwiclm`) is used for email/password authentication only; do not create application tables because flight-subscription data belongs to the later AWS milestone.
- The app is a plain Vite + React SPA (no SSR). `vite build` outputs static files to `dist/`, and `vercel.json` rewrites every path to `index.html` so deep links resolve client-side.
- Routing uses React Router (`src/App.tsx`): `/`, `/sign-in`, `/sign-up`, `/app` (`/auth` redirects to `/sign-in`).
- The Supabase client is created once in `src/integrations/supabase/client.ts` from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Authenticated screens are nested under the `RequireAuth` layout route so account checks happen before private UI renders.
