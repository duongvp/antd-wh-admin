// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
    // { path: '/dashboard', permission: 'dashboard_view' },
    { path: '/products', permission: 'product_view' },
    { path: '/units', permission: 'unit_view' },
    { path: '/categories', permission: 'category_view' },
    { path: '/transactions/inventory-checks', permission: 'stock_check_view' },
    { path: '/transactions/invoices', permission: 'invoice_view' },
    { path: '/transactions/purchase-orders', permission: 'import_view' },
    { path: '/transactions/returns', permission: 'return_view' },
    { path: '/partners/customers', permission: 'customer_view' },
    { path: '/partners/suppliers', permission: 'supplier_view' },
    { path: '/branches', permission: 'branch_view' },
    { path: '/users', permission: 'user_view' },
    { path: '/member-roles', permission: 'user_view' },
];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('refreshToken')?.value;
    const userCookie = req.cookies.get('user')?.value;

    if (!token || !userCookie) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const userData = JSON.parse(decodeURIComponent(userCookie));
    const matched = protectedRoutes.find((r) => req.nextUrl.pathname.startsWith(r.path));

    if (matched) {
        if (!userData.permissions?.includes(matched.permission)) {
            return NextResponse.redirect(new URL('/403', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - /_next (static assets)
         * - /api (API routes)
         * - /auth (login/register)
         * - /403 (forbidden page)
        */
        '/((?!_next|api|auth|403).*)',
    ],
};

