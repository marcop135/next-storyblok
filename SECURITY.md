# Security policy

## Supported versions

Only the current `main` branch, deployed at [nextstory.marcopontili.com](https://nextstory.marcopontili.com), receives fixes.

## Reporting a vulnerability

Do not open a public issue. Use GitHub's private reporting on this repository: **Security → Advisories → Report a vulnerability**. If that is unavailable, email marcop135.github@gmail.com with `[security]` in the subject.

Include the route or file affected, how to reproduce it, and what an attacker gains. Expect an acknowledgement within 7 days and an assessment within 14.

## In scope

- `/api/preview`, `/api/exit-preview`, and `/api/revalidate`: secret checks, slug validation, open redirects, cache poisoning.
- A Storyblok token or secret reaching the browser, a log, or a tracked file.
- The Content-Security-Policy and other headers in `next.config.ts`.

Storyblok and Next.js themselves belong upstream: [Storyblok security](https://www.storyblok.com/security) and [Next.js security](https://github.com/vercel/next.js/security).
