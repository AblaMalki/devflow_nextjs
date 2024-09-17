import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/ask-question(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
export const config = {
  matcher: [
    // // Public routes
    // "/",
    // "/api/webhook",
    // "/question/:id",
    // "/tags",
    // "/tags/:id",
    // "/profile/:id",
    // "/community",
    // "/jobs",

    // // Ignored routes
    // "/api/chatgpt",

    // General matcher: Skipping Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
