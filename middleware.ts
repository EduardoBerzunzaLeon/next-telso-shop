// import { NextResponse } from 'next/server';
// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// import * as jose from 'jose'

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';
// import { NextRequest, NextResponse } from "next/server";

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
// export default withAuth(
//     // `withAuth` augments your `Request` with the user's token.
//     function middleware(req: NextRequest & { nextauth: { token: any } }) {
//         console.log("Middleware token", req.nextauth.token)
//         return NextResponse.next()
//       },
//     {
//       callbacks: {
//         authorized: ({ token }) => token?.role === "admin",
//       },
//     }
//   )


export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const session:any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        const validRoles =['admin', 'super-user', 'SEO'];
        
        if( !validRoles.includes( session.user.role )) {
            return NextResponse.redirect('/');
        }

        return NextResponse.next();
    }
   
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
        const session:any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        if( !session ) {
            // Note: Middleware is returning a response body, which is not supported
            // return new Response( JSON.stringify({ message: 'No autorizado' }), {
            //     status: 401,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            // const requestedPage = req.nextUrl.pathname;
            const url = req.nextUrl.clone()
            url.pathname = '/auth/login';
            return NextResponse.redirect(url)
        }

        

        return NextResponse.next();
    }
}

// export async function middleware(req: NextRequest) {

//     if (req.nextUrl.pathname.startsWith('/checkout')) {

//         const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET  });

//         console.log(session);
//         console.log(process.env.NEXTAUTH_SECRET);
//         if( !session ) {
//             // const url = req.nextUrl.clone();
//             // const { pathname } = req.nextUrl;

//             // console.log(`${ url.origin }/auth/login?p=${ pathname }`);
//             // return NextResponse.redirect(`${ url.origin }/auth/login?p=${ pathname }`);
//             const requestedPage = req.nextUrl.pathname;
//             const url = req.nextUrl.clone();
//             url.pathname = `/auth/login`;
//             url.search = `p=${requestedPage}`;
//             // return NextResponse.redirect(url);
//         }

//         return NextResponse.next();
        // const response = NextResponse.next();

        // Getting cookies from the request
        // const token = request.cookies.get('token');
        // let isValidToken = false;

        // try {
        //     await jose.jwtVerify(token || '', new TextEncoder().encode(process.env.JWT_SECRET || ''));
        //     // await jose.jwtVerify(token || '', process.env.JWT_SECRET || '');
        //     isValidToken = true;
        //     return NextResponse.next();
        // } catch (error) {
        //     console.error(`JWT Invalid or not signed in`, { error });
        //     isValidToken = false;
        // }

        // if (!isValidToken) {
        //     const { pathname } = request.nextUrl;
        //     return NextResponse.redirect(
        //         new URL(`/auth/login?p=${pathname}`, request.url)
        //     );
        // }
//     }
// }
      
export const config = {
    matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
    // matcher: ['/checkout/address', '/checkout/summary']
};