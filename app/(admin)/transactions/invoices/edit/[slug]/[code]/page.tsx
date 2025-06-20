'use client';

import ImportOrders from "../../../components/ImportOrders";
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const slug = params?.slug ? Number(params.slug) : undefined;
    const code = (params.code as string) ?? '';

    return (
        <ImportOrders slug={slug} type="edit" code={code} />
    );
}
