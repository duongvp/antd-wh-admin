// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PermissionKey } from './types/permissions';

const protectedRoutes = [
    // { path: '/dashboard', permission: 'dashboard_view' },
    { path: '/products', permission: PermissionKey.PRODUCT_VIEW },
    // { path: '/units', permission: PermissionKey.UNIT_VIEW },
    { path: '/categories', permission: PermissionKey.CATEGORY_VIEW },
    { path: '/transactions/inventory-checks', permission: PermissionKey.STOCK_CHECK_VIEW },
    { path: '/transactions/invoices', permission: PermissionKey.INVOICE_VIEW },
    { path: '/transactions/purchase-orders', permission: PermissionKey.IMPORT_VIEW },
    { path: '/transactions/returns', permission: PermissionKey.RETURN_VIEW },
    { path: '/partners/customers', permission: PermissionKey.CUSTOMER_VIEW },
    { path: '/partners/suppliers', permission: PermissionKey.SUPPLIER_VIEW },
    { path: '/branches', permission: PermissionKey.BRANCH_VIEW },
    { path: '/users', permission: PermissionKey.USER_VIEW },
    { path: '/member-roles', permission: PermissionKey.USER_VIEW },
];

export function middleware(req: NextRequest) {
    console.log('Request URL:', req.url);
    console.log('All headers:', Object.fromEntries(req.headers.entries()));
    console.log('All cookies:', req.cookies.getAll());

    const token = req.cookies.get('refreshToken')?.value;
    const userCookie = req.cookies.get('user')?.value;
    console.log("🚀 ~ middleware ~ userCookie lại11:", userCookie, token)

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

