import { Suspense } from "react";
import ListingsPage from "@/components/ListingsPage";

export const metadata = {
  title: "Property Listings | Verified ₹2 Cr+ Homes in Mumbai | The Propertist",
  description:
    "Browse verified luxury properties in Mumbai. Filter by locality, BHK configuration, developer and status. Zero brokerage. RERA approved projects.",
};

export default function ListingsRoute() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f3f4f6" }} />}>
      <ListingsPage />
    </Suspense>
  );
}
