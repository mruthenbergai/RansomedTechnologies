# Ransomed Technologies LLC

Source repository for the future company website.

## Connected services

- GitHub: https://github.com/mruthenbergai/RansomedTechnologies
- Default branch: `main`
- Vercel project: `ransomedtechnologies`
- Vercel dashboard: https://vercel.com/swapwrite/ransomedtechnologies
- Primary domain: `ransomedtechnologies.com`
- Short domain: `ransomedtech.com`, redirected through its existing dedicated Vercel redirect project

## Current state

This repository was initialized on November 3, 2026 to resolve the empty-repository / missing-branch error in Vercel. The user requested repository preparation only. Website design and application implementation have not started.

`vercel.json` sets `git.deploymentEnabled` to `false`. This deliberately prevents automatic deployments while the website is being prepared. Do not try to deploy this documentation-only repository as a finished website.

No database, environment secrets, build dependencies, or framework have been added. The website does not need a database merely to begin development.

## Next website build

1. Confirm the company website brief in `docs/WEBSITE-BRIEF.md`.
2. Implement the website in this repository and set the appropriate Vercel framework/build settings.
3. Check the actual website locally, including desktop/mobile layout, links, and accessibility.
4. As part of the website release, change `git.deploymentEnabled` to `true` (or remove the setting), then push the reviewed site to the intended branch.
5. Verify the successful deployment, HTTPS for the primary domain, and the short-domain redirect.

The domain cannot serve the company website until that website has been implemented and deployed. Vercel's domain and certificate status should be rechecked at that point.

## Local checkout

`C:\Users\MarkRuthenberg\Projects\RansomedTechnologies`

See `AGENTS.md` for project scope and `docs/SETUP.md` for the hosting handoff.