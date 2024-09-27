import ItemsCategories from "@/app/inventory/items-categories/items-categories";
import ItemsCategoryView from "@/app/inventory/items-categories/items-category-view";
import Items from "@/app/inventory/items/items";
import ItemsView from "@/app/inventory/items/items-view";
import Suppliers from "@/app/inventory/suppliers/suppliers";
import SuppliersView from "@/app/inventory/suppliers/suppliers-view";
import Stores from "@/app/inventory/stores/stores";
import StoresView from "@/app/inventory/stores/stores-view";
import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";

const InventoryItems = [
    { name: 'item-categories', title: 'Item Categories', item: <ItemsCategories />, itemView: <ItemsCategoryView /> },
    { name: 'items', title: 'Items', item: <Items />, itemView: <ItemsView /> },
    { name: 'suppliers', title: 'Suppliers', item: <Suppliers />, itemView: <SuppliersView /> },
    { name: 'stores', title: 'Stores', item: <Stores />, itemView: <StoresView /> },
];

function InventoryPage() {
    return <InternalMenuSkeletonComponent pageItems={InventoryItems} title="Inventory Management" />;
}

export default InventoryPage;
