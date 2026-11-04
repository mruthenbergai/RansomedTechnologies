# Ransomed Technologies LLC

Source repository for the company website, using the approved red wordmark with a white crown as the “o.”

## Connected services

- GitHub: https://github.com/mruthenbergai/RansomedTechnologies
- Default branch: `main`
- Vercel project: `ransomedtechnologies`
- Vercel dashboard: https://vercel.com/swapwrite/ransomedtechnologies
- Primary domain: `ransomedtechnologies.com`
- Short domain: `ransomedtech.com`, redirected through its existing dedicated Vercel redirect project

## Website

The static site highlights website design and creation, ecommerce integration, app development, AI integration, and strategic brand transformation. It includes light and dark modes and features WelcomeNow, SwapWrite, ReadIt4Me, and JoJo’s Playhouse. Only JoJo’s Playhouse is labeled coming soon.

The user-approved public contact address is `sales@transformedtechnologies.com`. Its spelling is intentional and was supplied by the user.

The source is in `site/`; the build copies only that directory into `dist/`. There are no runtime packages, database, account system, or contact-form backend. See [the confirmed brief](docs/WEBSITE-BRIEF.md) for scope.

## Local development

Use Node.js 20 or newer. No package installation is required.

```powershell
npm run check
npm run build
npm run dev
```

Open `http://127.0.0.1:4173`. The development server serves the built `dist/` directory, so run `npm run build` again after editing `site/`. Set `PORT` if a different local port is needed.

`npm run check` validates local asset and link targets, anchor and ARIA references, CSS asset references, and JavaScript syntax. Browser verification also needs to cover mobile/desktop layouts, keyboard access, both themes, and the complete navigation and contact flows.

## Hosting

Reuse the existing Vercel project and redirect project. The static output directory is `dist`, built with `npm run build`. Review `git.deploymentEnabled` in `vercel.json` as part of a release; its original disabled setting deliberately held deployments during repository preparation.

A local build is not proof of a live release. After publishing, verify the actual deployment, HTTPS for the primary domain, and both short-domain and `www` redirects. The historical setup record is in [docs/SETUP.md](docs/SETUP.md).

## Local checkout

`C:\Users\MarkRuthenberg\Projects\RansomedTechnologies`

See `AGENTS.md` for project scope and `docs/SETUP.md` for the hosting handoff.
