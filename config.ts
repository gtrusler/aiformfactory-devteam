import { ConfigProps, PaymentProvider } from "./types/config";

const config = {
  // REQUIRED
  appName: "AIFormFactory",
  // REQUIRED: a short description of your app for SEO tags
  appDescription: "AI-powered form generation and management system",
  // REQUIRED (no https://, not trailing slash at the end)
  domainName: "aiformfactory.ai",

  colors: {
    main: "#0284c7", // sky-600
    theme: "light",
  },

  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
  },

  crisp: {
    id: "c0f094c9-8ee4-4340-af17-b636ec9e5cb7",
    onlyShowOnRoutes: ["/"],
  },

  canvas: {
    hideShapes: false,
    hideIcons: false,
    hideBrands: false,
    hideUpload: false,
    hideEraser: false,
    hideDownload: false,
    hideClear: false,
    hideUndoRedo: false,
    hideGrid: false,
    hideFullscreen: false,
  },

  paymentProvider: "stripe" as PaymentProvider,

  stripe: {
    plans: [
      {
        name: "Basic",
        priceId: "price_basic",
        description: "Perfect for getting started",
        price: 9,
        credits: 100,
        priority: 1,
        mode: "subscription",
        features: [
          { name: "100 AI Form Generations" },
          { name: "Basic Templates" },
          { name: "Email Support" },
        ],
      },
      {
        name: "Pro",
        priceId: "price_pro",
        description: "For power users",
        price: 29,
        credits: 500,
        priority: 2,
        mode: "subscription",
        features: [
          { name: "500 AI Form Generations" },
          { name: "Advanced Templates" },
          { name: "Priority Support" },
          { name: "Custom Branding" },
        ],
      },
    ],
  },

  lemonsqueezy: {
    plans: [
      {
        name: "Basic",
        variantId: 1,
        description: "Perfect for getting started",
        price: 9,
        credits: 100,
        priority: 1,
        mode: "subscription",
        features: [
          { name: "100 AI Form Generations" },
          { name: "Basic Templates" },
          { name: "Email Support" },
        ],
      },
      {
        name: "Pro",
        variantId: 2,
        description: "For power users",
        price: 29,
        credits: 500,
        priority: 2,
        mode: "subscription",
        features: [
          { name: "500 AI Form Generations" },
          { name: "Advanced Templates" },
          { name: "Priority Support" },
          { name: "Custom Branding" },
        ],
      },
    ],
  },

  mailgun: {
    subdomain: "mail",
    fromNoReply: "no-reply@aiformfactory.ai",
    fromAdmin: "admin@aiformfactory.ai",
    supportEmail: "support@aiformfactory.ai",
  },
} as ConfigProps;

export default config;
