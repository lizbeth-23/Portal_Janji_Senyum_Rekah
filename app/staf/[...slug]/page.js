"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingState } from "@/components/StateFeedback";

export default function StafCatchAllPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const slug = Array.isArray(params?.slug) ? params.slug.join("/") : "";
    router.replace(`/resepsionis/${slug}`);
  }, [router, params]);

  return <LoadingState message="Membuka halaman staf depan..." />;
}
