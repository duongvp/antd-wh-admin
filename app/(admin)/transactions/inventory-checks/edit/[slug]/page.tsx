'use client';
import { useParams } from 'next/navigation';
import ImportInventories from '../../components/ImportInventories';

export default function Page() {
    const params = useParams();
    const slug = params?.slug ? Number(params.slug) : undefined;

    return (
        <ImportInventories slug={slug} type="edit" />
    );
}
