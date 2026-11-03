# Repository and hosting handoff

Prepared November 3, 2026.

## Cause of the import error

The GitHub repository existed but had no commits or branches. Its configured default name was main, but there was no main reference for Vercel to resolve. The initial setup commit creates that reference.

## Existing resources

- Repository: mruthenbergai/RansomedTechnologies (public).
- Website project: ransomedtechnologies.
- Website project ID: prj_uixGQpBleaZvQ4fn9G2qoOaVgPpU.
- Vercel team ID: team_axajJk6SAwwAYEA5kFJ9p1V8.
- Existing team display name: SwapWrite. This is the hosting account/team label, not the company website brand.
- Existing short-domain redirect project: ransomedtech-com-redirect.

The website project was already linked to the correct GitHub repository. Reuse it; there is no need to import the repository again or create a replacement project.

## Deployment hold

Automatic Git deployments are disabled in vercel.json because the user requested repository preparation only. There is no index page, application, build command, or database to deploy yet. This setup does not publish a placeholder website.

When the website has been implemented and checked, enable Git deployments as part of the release and verify the actual build output and custom-domain HTTPS.

## Domain setup

Both domains are registered and verified in the connected Vercel team with Vercel nameservers. The short domain already redirects to the primary domain through its dedicated project. The primary custom domain is attached to the website project and verified. www.ransomedtechnologies.com is attached to the same project and redirects to the primary domain. HTTPS serving will be checked again when the website is built and deployed.

No mail provider or MX configuration is set up by this repository preparation. Business email is a separate service configuration.