"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { CategoryRail, type CategoryRailItem } from "@/components/create-order/CategoryRail";
import { ProductGrid } from "@/components/create-order/ProductGrid";
import { OfferGrid } from "@/components/create-order/OfferGrid";
import { CartPanel } from "@/components/create-order/CartPanel";
import { ProductCustomizeDialog } from "@/components/create-order/ProductCustomizeDialog";
import { OfferDetailDialog } from "@/components/create-order/OfferDetailDialog";
import { CheckoutView, type CheckoutCustomerInfo } from "@/components/create-order/CheckoutView";
import { CashPaymentView } from "@/components/payment/CashPaymentView";
import { PaymentCompletedView } from "@/components/payment/PaymentCompletedView";
import { useCategories } from "@/hooks/queries/useCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { useOffers } from "@/hooks/queries/useOffers";
import { useCreateOrder } from "@/hooks/mutations/useCreateOrder";
import { useAuthStore } from "@/store/auth.store";
import { usePosCartStore, posCartTotal, toOrderItemsPayload } from "@/store/pos-cart.store";
import type { Product } from "@/types/product.types";
import type { CreateOrderPayload, PaymentMethodValue } from "@/types/orderPayload.types";
import type { PaymentMethodId } from "@/types/order.types";

const OFFERS_RAIL_ID = "__offers__";

type View = "catalog" | "checkout" | "cash-payment" | "payment-completed";

export default function CreateNewOrderPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const { orderType, setOrderType, lines, addLine, updateQty, removeLine, clear } = usePosCartStore();
    const createOrder = useCreateOrder();

    const { data: categories } = useCategories();
    const { data: products } = useProducts();
    const { data: offers } = useOffers();

    const [orderId] = useState(() => `${Math.floor(1000000 + Math.random() * 9000000)}SF${Math.floor(1000 + Math.random() * 9000)}`);
    const [activeCategory, setActiveCategory] = useState<string>(OFFERS_RAIL_ID);
    const [search, setSearch] = useState("");
    const [customizeTarget, setCustomizeTarget] = useState<{ product: Product | null; allowHalfHalf: boolean } | null>(null);
    const [offerTarget, setOfferTarget] = useState<string | null>(null);
    const [view, setView] = useState<View>("catalog");
    const [pendingMethod, setPendingMethod] = useState<PaymentMethodId>("cash");
    const [customerInfo, setCustomerInfo] = useState<CheckoutCustomerInfo | null>(null);
    const [paidAmount, setPaidAmount] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);
    const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

    const total = posCartTotal(lines);

    // Only products flagged for the POS platform should be sellable here — a product can be
    // web-only or kiosk-only while still existing in the shared catalog.
    const posProducts = useMemo(() => (products ?? []).filter((p) => p.availability.pos), [products]);

    const isOffersTab = activeCategory === OFFERS_RAIL_ID && !search.trim();

    const filteredProducts = useMemo(() => {
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            return posProducts.filter((p) => p.name.toLowerCase().includes(q));
        }
        return posProducts.filter((p) => p.categoryId._id === activeCategory);
    }, [posProducts, activeCategory, search]);

    const activeCategoryData = categories?.find((c) => c._id === activeCategory);
    const activeCategoryLabel = isOffersTab ? "Special Offers" : activeCategoryData?.name ?? "";
    const isPizzaCategory = (activeCategoryData?.name ?? "").toLowerCase().includes("pizza");

    const railItems: CategoryRailItem[] = [
        { id: OFFERS_RAIL_ID, name: "Special Offers", icon: <Sparkles className="size-5 shrink-0" /> },
        ...(categories ?? []).map((c) => ({ id: c._id, name: c.name, image: c.image })),
    ];

    function handleCancelOrder() {
        clear();
        router.push("/orders");
    }

    async function submitOrder(method: PaymentMethodId, customer: CheckoutCustomerInfo, received: number) {
        if (!user?.branch._id) {
            toast.error("No branch found for your account");
            setView("checkout");
            return;
        }
        const payload: CreateOrderPayload = {
            branchId: user.branch._id,
            orderType,
            platform: "pos",
            items: toOrderItemsPayload(lines),
            payment: { method: method as PaymentMethodValue },
            guestInfo: { name: customer.name, phone: customer.phone || undefined },
        };
        if (orderType === "dine_in") payload.tableNumber = customer.tableNumber;
        if (orderType === "home_delivery") payload.deliveryAddress = { deliveryAddress: customer.deliveryAddress };

        try {
            const result = await createOrder.mutateAsync(payload);
            setPlacedOrderId(result.orderId);
            setPaidAmount(received);
            setChangeAmount(Math.max(received - result.total, 0));
            setView("payment-completed");
        } catch {
            toast.error("Failed to create order. Please try again.");
            setView("checkout");
        }
    }

    function handleProceedToCheckout(method: PaymentMethodId, customer: CheckoutCustomerInfo) {
        if (createOrder.isPending) return;
        setPendingMethod(method);
        setCustomerInfo(customer);
        if (method === "cash") {
            setView("cash-payment");
        } else {
            submitOrder(method, customer, total);
        }
    }

    function handleCashSubmit(received: number) {
        if (!customerInfo) return;
        submitOrder("cash", customerInfo, received);
    }

    function handleDone() {
        clear();
        router.push("/orders");
    }

    if (view === "cash-payment") {
        return <CashPaymentView total={total} onBack={() => setView("checkout")} onSubmit={handleCashSubmit} />;
    }

    if (view === "payment-completed") {
        return (
            <PaymentCompletedView
                orderId={placedOrderId ?? orderId}
                orderType={orderType}
                platform="POS"
                paymentMethod={pendingMethod}
                totalBill={total}
                paidAmount={paidAmount}
                changeAmount={changeAmount}
                onDone={handleDone}
                onReprintReceipt={() => toast.success("Receipt sent to printer")}
                onSendToKitchen={() => toast.success("Items sent to kitchen")}
            />
        );
    }

    if (view === "checkout") {
        return (
            <CheckoutView
                orderId={orderId}
                lines={lines}
                orderType={orderType}
                onOrderTypeChange={setOrderType}
                onBack={() => setView("catalog")}
                onProceed={handleProceedToCheckout}
            />
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between px-8 py-5">
                <h1 className="text-xl font-bold text-white">Create New Order</h1>
                <div className="flex items-center gap-5 text-sm">
                    <span className="text-white/50">Order ID: {orderId}</span>
                    <button
                        onClick={handleCancelOrder}
                        className="flex items-center gap-1.5 text-red-400 hover:text-red-300"
                    >
                        <X className="size-4" /> Cancel Order
                    </button>
                </div>
            </div>

            <div className="px-8 pb-10">
                <div className="mb-6 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product name"
                            className="h-10 pl-9"
                        />
                    </div>
                </div>

                <div className="flex gap-6">
                    <CategoryRail categories={railItems} activeId={activeCategory} onSelect={setActiveCategory} />

                    <div className="flex-1">
                        <h2 className="mb-4 text-lg font-bold text-white">{activeCategoryLabel}</h2>

                        {isPizzaCategory && !isOffersTab && !search.trim() && (
                            <button
                                onClick={() => setCustomizeTarget({ product: null, allowHalfHalf: true })}
                                className="mb-4 flex w-full items-center gap-3 rounded-xl bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                                    ◐
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">Half & Half Pizza</p>
                                    <p className="text-xs text-white/40">
                                        Here you can choose two pizzas from the menu, each half of them, and customize them.
                                    </p>
                                </div>
                                <ChevronRight className="size-4 shrink-0 text-white/40" />
                            </button>
                        )}

                        {isOffersTab ? (
                            <OfferGrid offers={offers ?? []} onSelect={(offer) => setOfferTarget(offer._id)} />
                        ) : (
                            <ProductGrid
                                products={filteredProducts}
                                onSelect={(product) =>
                                    setCustomizeTarget({
                                        product,
                                        allowHalfHalf: product.categoryId.name.toLowerCase().includes("pizza"),
                                    })
                                }
                            />
                        )}
                    </div>

                    <CartPanel
                        lines={lines}
                        onUpdateQty={updateQty}
                        onRemove={removeLine}
                        onClearAll={clear}
                        onCompleteOrder={() => setView("checkout")}
                    />
                </div>
            </div>

            <ProductCustomizeDialog
                product={customizeTarget?.product ?? null}
                allowHalfHalf={customizeTarget?.allowHalfHalf ?? false}
                open={!!customizeTarget}
                onOpenChange={(open) => !open && setCustomizeTarget(null)}
                onAddToCart={addLine}
            />

            <OfferDetailDialog
                offerId={offerTarget}
                open={!!offerTarget}
                onOpenChange={(open) => !open && setOfferTarget(null)}
                onAddToCart={addLine}
            />
        </div>
    );
}
