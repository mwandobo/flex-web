import ItemsView from "@/app/inventory/items/items-view";
import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import RequisitionRequest from "@/app/procurement/requisition-requests/requisition-request";
import RequisitionRequestView from "@/app/procurement/requisition-requests/requisition-request-view";
import Rfq from "@/app/procurement/rfq/rfq";
import RfqView from "@/app/procurement/rfq/rfq-view";

const ProcurementItems = [
    { name: 'requisition-requests', title: 'Requisition Requests', item: <RequisitionRequest />, itemView: <RequisitionRequestView /> },
    { name: 'request-for-quotation', title: 'Requests For Quotations', item: <Rfq />, itemView: <RfqView /> },
];

function InventoryPage() {
    return <InternalMenuSkeletonComponent pageItems={ProcurementItems} title="Procurement Management"  subtitle='Procurement Items'/>;
}

export default InventoryPage;
