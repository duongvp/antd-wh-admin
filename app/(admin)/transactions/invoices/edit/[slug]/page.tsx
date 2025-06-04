'use client';

import ImportOrders from "../../components/ImportOrders";
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const slug = params?.slug ? Number(params.slug) : undefined;

    return (
        <ImportOrders slug={slug} type="edit" />
    );
}
