'use client';
import { useParams } from 'next/navigation';
import ImportGoods from '../../components/ImportGoods';

export default function Page() {
    const params = useParams();
    const slug = params?.slug ? Number(params.slug) : undefined;

    return (
        <ImportGoods slug={slug} type='copy' />
    );
}
