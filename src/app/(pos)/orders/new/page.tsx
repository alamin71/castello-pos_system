"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { CategoryRail } from "@/components/create-order/CategoryRail";
import { ProductGrid } from "@/components/create-order/ProductGrid";
import { OfferGrid } from "@/components/create-order/OfferGrid";
import { CartPanel } from "@/components/create-order/CartPanel";
import { ProductCustomizeDialog } from "@/components/create-order/ProductCustomizeDialog";
import { OfferDetailDialog } from "@/components/create-order/OfferDetailDialog";
import { CheckoutView } from "@/components/create-order/CheckoutView";
import { CashPaymentView } from "@/components/payment/CashPaymentView";
import { PaymentCompletedView } from "@/components/payment/PaymentCompletedView";
import { CATEGORIES, PRODUCTS } from "@/lib/mock/catalog.mock";
import { OFFERS } from "@/lib/mock/offers.mock";
import { usePosCartStore, posCartTotal } from "@/store/pos-cart.store";
import type { Product } from "@/types/product.types";
import type { Offer } from "@/types/offer.types";
import type { OrderType, PaymentMethodId } from "@/types/order.types";
import { cn } from "@/lib/utils";

const ORDER_TYPES: { id: OrderType; label: string }[] = [
    { id: "dine-in", label: "Dine-In" },
    { id: "take-away", label: "Take Away" },
    { id: "delivery", label: "Delivery" },
];

type View = "catalog" | "checkout" | "cash-payment" | "payment-completed";

export default function CreateNewOrderPage() {
    const router = useRouter();
    const { orderType, setOrderType, lines, addLine, updateQty, removeLine, clear } = usePosCartStore();

    const [orderId] = useState(() => `${Math.floor(1000000 + Math.random() * 9000000)}SF${Math.floor(1000 + Math.random() * 9000)}`);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[1].id);
    const [search, setSearch] = useState("");
    const [customizeTarget, setCustomizeTarget] = useState<{ product: Product | null; allowHalfHalf: boolean } | null>(null);
    const [offerTarget, setOfferTarget] = useState<Offer | null>(null);
    const [view, setView] = useState<View>("catalog");
    const [pendingMethod, setPendingMethod] = useState<PaymentMethodId>("cash");
    const [paidAmount, setPaidAmount] = useState(0);
    const [changeAmount, setChangeAmount] = useState(0);

    const total = posCartTotal(lines);

    const products = useMemo(() => {
        const byCategory = PRODUCTS.filter((p) => p.categoryId === activeCategory);
        if (!search.trim()) return byCategory;
        const q = search.trim().toLowerCase();
        return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q));
    }, [activeCategory, search]);

    const activeCategoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.name ?? "";

    function handleCancelOrder() {
        clear();
        router.push("/orders");
    }

    function handleProceedToCheckout(method: PaymentMethodId) {
        setPendingMethod(method);
        if (method === "cash") {
            setView("cash-payment");
        } else {
            setPaidAmount(total);
            setView("payment-completed");
        }
    }

    function handleCashSubmit(received: number) {
        setPaidAmount(total);
        setChangeAmount(Math.max(received - total, 0));
        setView("payment-completed");
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
                orderId={orderId}
                orderType={orderType}
                platform="POS"
                paymentMethod={pendingMethod}
                totalBill={total}
                paidAmount={paidAmount}
                changeAmount={pendingMethod === "cash" ? changeAmount : undefined}
                txnId={pendingMethod !== "cash" ? "785SD98S66" : undefined}
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
                    <div className="flex gap-2">
                        {ORDER_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setOrderType(type.id)}
                                className={cn(
                                    "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                                    orderType === type.id
                                        ? "border-secondary text-white"
                                        : "border-white/15 text-white/60 hover:border-white/30"
                                )}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-6">
                    <CategoryRail categories={CATEGORIES} activeId={activeCategory} onSelect={setActiveCategory} />

                    <div className="flex-1">
                        <h2 className="mb-4 text-lg font-bold text-white">{activeCategoryLabel}</h2>

                        {activeCategory === "pizzas" && !search.trim() && (
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

                        {activeCategory === "offers" && !search.trim() ? (
                            <OfferGrid offers={OFFERS} onSelect={setOfferTarget} />
                        ) : (
                            <ProductGrid
                                products={products}
                                onSelect={(product) =>
                                    setCustomizeTarget({ product, allowHalfHalf: product.categoryId === "pizzas" })
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
                offer={offerTarget}
                open={!!offerTarget}
                onOpenChange={(open) => !open && setOfferTarget(null)}
                onAddToCart={addLine}
            />
        </div>
    );
}
