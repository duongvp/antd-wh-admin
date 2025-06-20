'use client';
import { useParams } from 'next/navigation';
import ReturnOrders from "../../components/ReturnOrders";

export default function Page() {
    const params = useParams();
    const slug = params?.slug ? Number(params.slug) : undefined;

    return (
        <ReturnOrders slug={slug} type="edit" />
    );
}
