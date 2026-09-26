export const API = {
    posAuth: {
        login: "/pos/auth/login",
        forgotPassword: "/pos/auth/forgot-password",
        verifyOtp: "/pos/auth/verify-otp",
        resetPassword: "/pos/auth/reset-password",
        me: "/pos/auth/me",
        removePhoto: "/pos/auth/me/photo",
        changePassword: "/pos/auth/me/change-password",
    },
    orders: "/orders",
    kitchen: {
        queue: "/kitchen/queue",
    },
    menu: {
        categories: "/admin/menu/categories",
        products: "/admin/menu/products",
    },
    toppings: {
        categories: "/admin/menu/toppings/categories",
        items: "/admin/menu/toppings/items",
    },
    promotions: {
        offers: "/admin/promotions/offers",
    },
};
