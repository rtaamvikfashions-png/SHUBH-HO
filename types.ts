
export interface User {
    id: string;
    name: string;
    mobile: string;
    passwordHash: string;
    secretQuestion: string;
    secretAnswerHash: string;
    isAdmin: boolean;
}

export enum QuotationStatus {
    DRAFT = 'DRAFT',
    SALE = 'SALE',
    CANCEL = 'CANCEL',
    WALK_OUT = 'WALK-OUT',
}

export interface Customer {
    name: string;
    mobile: string;
}

export interface Salesman {
    id: string;
    name: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    mrp: number;
}

export interface ProductItem {
    id: string;
    name: string;
    mrp: number;
}

export interface QuotationItem {
    barcode: string;
    unit: 'MTR' | 'PCS';
    quantity: number;
    mrp: number;
    total: number;
}

export interface StitchingItem {
    name: string;
    unit: 'PCS';
    quantity: number;
    mrp: number;
    total: number;
}

export interface Discount {
    percent: number;
    amount: number;
}

export interface CancellationReason {
    category: string;
    subCategory: string;
}

export interface Quotation {
    id: string;
    quotationNumber: string;
    userId: string; // The mobile number of the user who created it
    customerName: string;
    customerMobile: string;
    trialDate: string;
    deliveryDate: string;
    salesman: string;
    products: QuotationItem[];
    services: StitchingItem[];
    productDiscount: Discount;
    serviceDiscount: Discount;
    productSubtotal: number;
    serviceSubtotal: number;
    grandTotal: number;
    status: QuotationStatus;
    cancellationReason?: CancellationReason | null;
    saleBillNumber?: string;
    saleBillDate?: string;
    createdAt: string;
    updatedAt: string;
}