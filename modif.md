Build Fix Walkthrough
I have successfully fixed the build errors in the project.

Changes
1. ESLint Configuration
Added @next/eslint-plugin-next to devDependencies to resolve the Failed to load plugin '@next/next' error.
2. UI Component Migration
Updated 
src/components/landing/DocsCards.tsx
 and 
src/components/landing/LandingFooter.tsx
 to use the new MUI Grid v2 API.
Replaced legacy item, xs, and 
md
 props with the size prop (e.g., size={{ xs: 4, md: 4 }}).
Verification Results
Automated Tests
Ran npm run build and confirmed it completed successfully.
> front@0.1.0 build
> next build
   ▲ Next.js 15.5.9
   Creating an optimized production build ...
 ✓ Compiled successfully
 ...
✓ Generating static pages (5/5)
✓ Finalizing page optimization
...
3. Docker Support
Added 
Dockerfile
 for multi-stage building (deps, builder, runner).
Added 
.dockerignore
 to exclude unnecessary files.
Enabled output: 'standalone' in 
next.config.ts
 to optimize container size.
Docker Verification
Verified that npm run build still works correctly with output: 'standalone'.
You can build the Docker image using:
docker build -t nextjs-docker .
4. Environment Variables
Added NEXT_PUBLIC_API_URL and NEXT_PUBLIC_APP_URL to 
Dockerfile
.
These are set during the build stage to ensure they are available for client-side code generation.