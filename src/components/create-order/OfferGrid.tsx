"use client";

import type { Offer } from "@/types/offer.types";

export function OfferGrid({
    offers,
    onSelect,
}: {
    offers: Offer[];
    onSelect: (offer: Offer) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer) => (
                <button
                    key={offer.id}
                    onClick={() => onSelect(offer)}
                    className="flex flex-col overflow-hidden rounded-xl bg-white/5 text-left transition-colors hover:bg-white/10"
                >
                    <div className="flex h-28 items-center justify-center bg-white/5 text-5xl">
                        {offer.image}
                    </div>
                    <div className="p-3">
                        <p className="text-sm font-medium text-white">{offer.title}</p>
                        <p className="text-xs text-white/40">{offer.price.toLocaleString()} kr.</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
