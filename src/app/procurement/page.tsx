import Items from "@/app/inventory/items/items";
import ItemsView from "@/app/inventory/items/items-view";
import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import RequisitionRequest from "@/app/procurement/requisition-requests/requisition-request";
import RequisitionRequestView from "@/app/procurement/requisition-requests/requisition-request-view";

const ProcurementItems = [
    { name: 'requisition-requests', title: 'Requisition Requests', item: <RequisitionRequest />, itemView: <RequisitionRequestView /> },
    { name: 'request-for-quotation', title: 'Requests For Quotations', item: <Items />, itemView: <ItemsView /> },
];

function InventoryPage() {
    return <InternalMenuSkeletonComponent pageItems={ProcurementItems} title="Procurement Management"  subtitle='Procurement Items'/>;
}

export default InventoryPage;
