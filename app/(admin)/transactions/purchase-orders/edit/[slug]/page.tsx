'use client';

import ImportGoods from "../../components/ImportGoods";
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const slug = params?.slug ? Number(params.slug) : undefined;

    return (
        <ImportGoods slug={slug} type="edit" />
    );
}
