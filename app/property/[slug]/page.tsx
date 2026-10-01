import { ALL_PROPERTIES } from "../../../utilities/masterData";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { notFound } from "next/navigation";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const property = ALL_PROPERTIES.find(p => p.slug === resolvedParams.slug);

  if (!property) {
    // Optionally return 404 if property not found
    notFound();
  }

  return <PropertyDetailsClient property={property} />;
}
