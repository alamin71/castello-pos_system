"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TopBar } from "@/components/pos/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillTabs, type PillTabOption } from "@/components/orders/PillTabs";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderDetailsView } from "@/components/orders/OrderDetailsView";
import { SendToKitchenDialog } from "@/components/orders/SendToKitchenDialog";
import { CashPaymentView } from "@/components/payment/CashPaymentView";
import { PaymentCompletedView } from "@/components/payment/PaymentCompletedView";
import { MOCK_ORDERS } from "@/lib/mock/orders.mock";
import type { Order, OrderType, PaymentMethodId } from "@/types/order.types";

type OrderTypeFilter = OrderType | "all";
type StatusFilter = "new" | "active" | "completed" | "all";
type View = "list" | "details" | "cash-payment" | "payment-completed";

function matchesStatusFilter(order: Order, filter: StatusFilter) {
    if (filter === "all") return true;
    if (filter === "new") return order.status === "order-placed";
    if (filter === "completed") return order.status === "completed";
    return ["sent-to-kitchen", "preparing", "prepared"].includes(order.status);
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [typeFilter, setTypeFilter] = useState<OrderTypeFilter>("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [search, setSearch] = useState("");

    const [view, setView] = useState<View>("list");
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [sendToKitchenOpen, setSendToKitchenOpen] = useState(false);
    const [pendingPaymentMethod, setPendingPaymentMethod] = useState<PaymentMethodId>("cash");
    const [lastCashChange, setLastCashChange] = useState(0);
    const [lastPaidAmount, setLastPaidAmount] = useState(0);

    const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

    const typeOptions: PillTabOption<OrderTypeFilter>[] = useMemo(
        () => [
            { value: "dine-in", label: "Dine-In", count: orders.filter((o) => o.type === "dine-in").length },
            { value: "take-away", label: "Take Away", count: orders.filter((o) => o.type === "take-away").length },
            { value: "delivery", label: "Delivery", count: orders.filter((o) => o.type === "delivery").length },
            { value: "all", label: "All Orders", count: orders.length },
        ],
        [orders]
    );

    const statusOptions: PillTabOption<StatusFilter>[] = useMemo(
        () => [
            { value: "new", label: "New Orders", count: orders.filter((o) => matchesStatusFilter(o, "new")).length },
            { value: "active", label: "Active Orders", count: orders.filter((o) => matchesStatusFilter(o, "active")).length },
            { value: "completed", label: "Completed Orders", count: orders.filter((o) => matchesStatusFilter(o, "completed")).length },
            { value: "all", label: "All Orders", count: orders.length },
        ],
        [orders]
    );

    const filteredOrders = orders.filter((order) => {
        if (typeFilter !== "all" && order.type !== typeFilter) return false;
        if (!matchesStatusFilter(order, statusFilter)) return false;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            if (
                !order.id.toLowerCase().includes(q) &&
                !order.customer.name.toLowerCase().includes(q) &&
                !order.customer.phone?.toLowerCase().includes(q)
            ) {
                return false;
            }
        }
        return true;
    });

    function updateOrder(id: string, patch: Partial<Order>) {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    }

    function handleSelectOrder(order: Order) {
        setSelectedOrderId(order.id);
        setView("details");
    }

    function handleCloseDetails() {
        setSelectedOrderId(null);
        setView("list");
    }

    function handleCancelOrder() {
        if (!selectedOrder) return;
        updateOrder(selectedOrder.id, { status: "cancelled" });
        toast.success(`Order ${selectedOrder.id} cancelled`);
        handleCloseDetails();
    }

    function handleTakePayment(method: PaymentMethodId) {
        setPendingPaymentMethod(method);
        if (method === "cash") {
            setView("cash-payment");
        } else {
            if (selectedOrder) {
                updateOrder(selectedOrder.id, { paymentStatus: "paid", paymentMethod: method });
                setLastPaidAmount(selectedOrder.total);
            }
            setView("payment-completed");
        }
    }

    function handleCashSubmit(received: number) {
        if (!selectedOrder) return;
        updateOrder(selectedOrder.id, { paymentStatus: "paid", paymentMethod: "cash" });
        setLastPaidAmount(selectedOrder.total);
        setLastCashChange(Math.max(received - selectedOrder.total, 0));
        setView("payment-completed");
    }

    if (selectedOrder && view === "cash-payment") {
        return (
            <CashPaymentView
                total={selectedOrder.total}
                onBack={() => setView("details")}
                onSubmit={handleCashSubmit}
            />
        );
    }

    if (selectedOrder && view === "payment-completed") {
        return (
            <PaymentCompletedView
                orderId={selectedOrder.id}
                orderType={selectedOrder.type}
                platform={selectedOrder.platform}
                paymentMethod={pendingPaymentMethod}
                totalBill={selectedOrder.total}
                paidAmount={lastPaidAmount}
                changeAmount={pendingPaymentMethod === "cash" ? lastCashChange : undefined}
                txnId={pendingPaymentMethod !== "cash" ? "785SD98S66" : undefined}
                onDone={handleCloseDetails}
                onReprintReceipt={() => toast.success("Receipt sent to printer")}
                onSendToKitchen={() => setSendToKitchenOpen(true)}
            />
        );
    }

    if (selectedOrder && view === "details") {
        return (
            <>
                <OrderDetailsView
                    order={selectedOrder}
                    onClose={handleCloseDetails}
                    onCancelOrder={handleCancelOrder}
                    onSendToKitchen={() => setSendToKitchenOpen(true)}
                    onTakePayment={handleTakePayment}
                />
                <SendToKitchenDialog
                    order={selectedOrder}
                    open={sendToKitchenOpen}
                    onOpenChange={setSendToKitchenOpen}
                    onSent={() => updateOrder(selectedOrder.id, { status: "sent-to-kitchen" })}
                />
            </>
        );
    }

    return (
        <div>
            <TopBar
                rightAction={
                    <Button
                        onClick={() => router.push("/orders/new")}
                        className="h-9 bg-zinc-100 text-zinc-900 hover:bg-white"
                    >
                        <Plus className="size-4" />
                        Create New Order
                    </Button>
                }
            />

            <div className="px-8 pb-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <PillTabs options={typeOptions} value={typeFilter} onChange={setTypeFilter} variant="outline" />
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search order id, customer, phone..."
                            className="h-10 pl-9"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <PillTabs options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
                </div>

                <OrdersTable orders={filteredOrders} onSelect={handleSelectOrder} />
            </div>
        </div>
    );
}
