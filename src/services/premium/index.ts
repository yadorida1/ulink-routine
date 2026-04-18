// Premium subscription service
//
// INTEGRATION POINT: RevenueCat
// ─────────────────────────────────────────────────────────────────────────────
// Install: react-native-purchases
// Docs:    https://docs.revenuecat.com/docs/react-native
//
// Setup:
//   1. Purchases.configure({ apiKey: REVENUECAT_PUBLIC_SDK_KEY })
//   2. After sign-in: Purchases.logIn(userId)
//   3. After sign-out: Purchases.logOut()
//
// Product IDs (configure in App Store Connect + Google Play Console):
//   - ulink_routine_premium_monthly
//   - ulink_routine_premium_yearly
//
// Entitlement ID (configure in RevenueCat dashboard):
//   - premium
// ─────────────────────────────────────────────────────────────────────────────

export interface PremiumPackage {
  id: string;
  title: string;
  price: string;
  period: 'monthly' | 'yearly';
  savings?: string;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
}

export const getAvailablePackages = async (): Promise<PremiumPackage[]> => {
  // TODO:
  // const offerings = await Purchases.getOfferings();
  // const pkgs = offerings.current?.availablePackages ?? [];
  // return pkgs.map(p => ({ id: p.identifier, title: p.product.title, price: p.product.priceString, ... }));
  return [
    {
      id: 'monthly',
      title: '월간 구독',
      price: '₩4,900 / 월',
      period: 'monthly',
    },
    {
      id: 'yearly',
      title: '연간 구독',
      price: '₩39,900 / 년',
      period: 'yearly',
      savings: '32% 절약',
    },
  ];
};

export const purchasePremium = async (_packageId: string): Promise<PurchaseResult> => {
  // TODO:
  // const offerings = await Purchases.getOfferings();
  // const selectedPkg = offerings.current?.availablePackages.find(p => p.identifier === packageId);
  // if (!selectedPkg) return { success: false, error: 'Package not found' };
  // const { customerInfo } = await Purchases.purchasePackage(selectedPkg);
  // if (customerInfo.entitlements.active['premium']) return { success: true };
  return { success: true };
};

export const restorePurchases = async (): Promise<PurchaseResult> => {
  // TODO:
  // const customerInfo = await Purchases.restorePurchases();
  // if (customerInfo.entitlements.active['premium']) return { success: true };
  return { success: false, error: '이전 구독 내역을 찾을 수 없어요' };
};

export const checkPremiumStatus = async (_userId: string): Promise<boolean> => {
  // TODO:
  // const customerInfo = await Purchases.getCustomerInfo();
  // return !!customerInfo.entitlements.active['premium'];
  return false;
};
