import { clerkMiddleware,createRouteMatcher, getAuth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';


const publicRoutes = ["/", "/api/webhook/register", "/sign-in", "/sign-up", "signout"];
const isPublicRoutes = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
   
    const { userId } = auth;
   

    if(!userId && !isPublicRoutes(req)){
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    try {
      
      if(userId){
        const user = await currentUser();
        const role = user?.publicMetadata?.role as string | undefined
        if(role === "admin" && req.nextUrl.pathname === "/dashboard"){
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }

        if(role !== "admin" && req.nextUrl.pathname.startsWith("/admin")){
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if(isPublicRoutes(req)){
          return NextResponse.redirect(new URL(
            role === "admin"? "/admin/dashboard": "/dashboard"
            , req.url))
        }
      }
    } catch (error) {
      console.error("Error fetching user data from Clerk:", error);
        return NextResponse.redirect(new URL("/error", req.url));
    }

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};