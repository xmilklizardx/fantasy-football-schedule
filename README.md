# Fantasy Football - 14 Week Schedule

Static GitHub Pages site for the league's 14-week fantasy football schedule, now with a shared weekly **Swap High Score** submission system.

## Schedule features

- Full 14-week schedule
- Home / away assignments
- Team filter
- Week filter
- Rivalry, friendship, and previous-standings rounds highlighted
- Exactly 7 home and 7 away games per team
- Maximum home/away streak of 2 games
- Downloadable PDF schedule

## Weekly Swap High Score workflow

Each week:

- The form opens **Tuesday at 12:00 AM Pacific**.
- A manager selects their team from the dropdown and answers **Yes** or **No** to **"Swap high score for this week?"**
- The database accepts submissions until **Sunday at 10:00 AM Pacific**.
- Each team has exactly **3 Yes uses for the entire 14-week season**. The database rejects a fourth Yes.
- Managers can update their answer as many times as they want before the cutoff; the latest answer wins. Changing a current-week Yes back to No before cutoff restores that use.
- Before the cutoff, league-wide answers are hidden.
- At **Sunday 10:00 AM Pacific**, submissions lock and the site displays only the teams that selected **Yes**.
- The locked results also show a **team-by-team tally of Yes uses remaining** (3 down to 0).
- Any team that selected No or did not submit is automatically treated as **No**.
- Results stay locked through Monday.
- The next weekly form opens the following **Tuesday at 12:00 AM Pacific**.
- All timing is enforced by the database server, not a visitor's device clock.

The supplied 2026 setup treats **Tuesday, September 8, 2026** as the opening of Week 1 and runs for 14 weeks.

## One-time Supabase setup

GitHub Pages cannot store shared submissions by itself, so the site uses a free Supabase Postgres backend.

1. Create a Supabase project.
2. Open the project's **SQL Editor**.
3. Copy the entire contents of `supabase/setup.sql` into the SQL Editor and run it. It is safe to run this updated script over the prior version; the weekly window rows are updated without deleting existing submissions.
4. In Supabase, open **Project Settings > API** (or the current API settings page).
5. Copy the project URL and the public/anon key.
6. Open `config.js` and replace:

```js
window.SWAP_CONFIG = {
  supabaseUrl: "YOUR_SUPABASE_PROJECT_URL",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY"
};
```

with your real project URL and public anon key.

The anon key is intentionally used in the browser. Direct table access is revoked; the website can only call the two restricted SQL functions in `supabase/setup.sql`.

### Important trust note

The requested form is **team-dropdown based and does not require login/PIN authentication**. That means the database securely enforces the weekly cutoff, but any person who can access the public site could select another team's name and submit on its behalf. For a private friends league this may be acceptable. If stronger protection is needed, add per-team PINs or authentication before publishing widely.

## Publish on GitHub Pages

1. Create or update the public repository named `fantasy-football-schedule`.
2. Upload/push all files in this repository, including `config.js`, `supabase/setup.sql`, and `.github/workflows/pages.yml`.
3. Open **Settings > Pages**.
4. Under **Build and deployment > Source**, select **GitHub Actions**.
5. The included workflow deploys the site on pushes to `main`.

The public URL will normally be:

`https://YOUR-GITHUB-USERNAME.github.io/fantasy-football-schedule/`
