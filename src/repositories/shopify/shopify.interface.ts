/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ShopifyGetProductRes {
  product: {
    id: number;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    created_at: string;
    handle: string;
    updated_at: string;
    published_at: string;
    template_suffix: string;
    status: string;
    published_scope: string;
    tags: string;
    admin_graphql_api_id: string;
    variants: {
      id: number;
      product_id: number;
      title: string;
      price: string;
      sku: string;
      position: number;
      inventory_policy: string;
      compare_at_price: string;
      fulfillment_service: string;
      inventory_management: string;
      option1: string;
      option2: any;
      option3: any;
      created_at: string;
      updated_at: string;
      taxable: boolean;
      barcode: string;
      grams: number;
      image_id: any;
      weight: number;
      weight_unit: string;
      inventory_item_id: number;
      inventory_quantity: number;
      old_inventory_quantity: number;
      requires_shipping: boolean;
      admin_graphql_api_id: string;
    }[];
    options: {
      id: number;
      product_id: number;
      name: string;
      position: number;
      values: string[];
    }[];
    images: {
      id: number;
      product_id: number;
      position: number;
      created_at: string;
      updated_at: string;
      alt: any;
      width: number;
      height: number;
      src: string;
      variant_ids: any[];
      admin_graphql_api_id: string;
    }[];
    image: {
      id: number;
      product_id: number;
      position: number;
      created_at: string;
      updated_at: string;
      alt: any;
      width: number;
      height: number;
      src: string;
      variant_ids: any[];
      admin_graphql_api_id: string;
    };
  };
}

export interface ShopifyGetCustomerRes {
  customer: {
    id: number;
    email: string;
    accepts_marketing: boolean;
    created_at: Date;
    updated_at: Date;
    first_name: string;
    last_name: string;
    orders_count: number;
    state: string;
    total_spent: string;
    last_order_id: number;
    note?: any;
    verified_email: boolean;
    multipass_identifier?: any;
    tax_exempt: boolean;
    phone?: any;
    tags: string;
    last_order_name: string;
    currency: string;
    addresses: {
      id: number;
      customer_id: number;
      first_name: string;
      last_name: string;
      company: string;
      address1: string;
      address2: string;
      city: string;
      province: string;
      country: string;
      zip: string;
      phone: string;
      name: string;
      province_code: string;
      country_code: string;
      country_name: string;
      default: boolean;
    }[];
    accepts_marketing_updated_at: Date;
    marketing_opt_in_level: string;
    tax_exemptions: any[];
    sms_marketing_consent?: any;
    admin_graphql_api_id: string;
    default_address: {
      id: number;
      customer_id: number;
      first_name: string;
      last_name: string;
      company: string;
      address1: string;
      address2: string;
      city: string;
      province: string;
      country: string;
      zip: string;
      phone: string;
      name: string;
      province_code: string;
      country_code: string;
      country_name: string;
      default: boolean;
    };
  };
}

export declare namespace RetrieveOrdersListResponse {
    export interface Root {
        orders: Order[];
    }
    export interface ClientDetails {
        accept_language?: any;
        browser_height?: any;
        browser_ip: string;
        browser_width?: any;
        session_hash?: any;
        user_agent?: any;
    }

    export interface DiscountCode {
        code: string;
        amount: string;
        type: string;
    }

    export interface NoteAttribute {
        name: string;
        value: string;
    }

    export interface ShopMoney {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney {
        amount: string;
        currency_code: string;
    }

    export interface SubtotalPriceSet {
        shop_money: ShopMoney;
        presentment_money: PresentmentMoney;
    }

    export interface ShopMoney2 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney2 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet {
        shop_money: ShopMoney2;
        presentment_money: PresentmentMoney2;
    }

    export interface TaxLine {
        price: string;
        rate: number;
        title: string;
        price_set: PriceSet;
    }

    export interface ShopMoney3 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney3 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountsSet {
        shop_money: ShopMoney3;
        presentment_money: PresentmentMoney3;
    }

    export interface ShopMoney4 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney4 {
        amount: string;
        currency_code: string;
    }

    export interface TotalLineItemsPriceSet {
        shop_money: ShopMoney4;
        presentment_money: PresentmentMoney4;
    }

    export interface ShopMoney5 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney5 {
        amount: string;
        currency_code: string;
    }

    export interface TotalPriceSet {
        shop_money: ShopMoney5;
        presentment_money: PresentmentMoney5;
    }

    export interface ShopMoney6 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney6 {
        amount: string;
        currency_code: string;
    }

    export interface TotalShippingPriceSet {
        shop_money: ShopMoney6;
        presentment_money: PresentmentMoney6;
    }

    export interface ShopMoney7 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney7 {
        amount: string;
        currency_code: string;
    }

    export interface TotalTaxSet {
        shop_money: ShopMoney7;
        presentment_money: PresentmentMoney7;
    }

    export interface BillingAddress {
        first_name: string;
        address1: string;
        phone: string;
        city: string;
        zip: string;
        province: string;
        country: string;
        last_name: string;
        address2: string;
        company?: any;
        latitude: number;
        longitude: number;
        name: string;
        country_code: string;
        province_code: string;
    }

    export interface DefaultAddress {
        id: number;
        customer_id: number;
        first_name?: any;
        last_name?: any;
        company?: any;
        address1: string;
        address2: string;
        city: string;
        province: string;
        country: string;
        zip: string;
        phone: string;
        name: string;
        province_code: string;
        country_code: string;
        country_name: string;
        default: boolean;
    }

    export interface Customer {
        id: number;
        email: string;
        accepts_marketing: boolean;
        created_at: Date;
        updated_at: Date;
        first_name: string;
        last_name: string;
        orders_count: number;
        state: string;
        total_spent: string;
        last_order_id: number;
        note?: any;
        verified_email: boolean;
        multipass_identifier?: any;
        tax_exempt: boolean;
        phone: string;
        tags: string;
        last_order_name: string;
        currency: string;
        accepts_marketing_updated_at: Date;
        marketing_opt_in_level?: any;
        tax_exemptions: any[];
        admin_graphql_api_id: string;
        default_address: DefaultAddress;
    }

    export interface DiscountApplication {
        target_type: string;
        type: string;
        value: string;
        value_type: string;
        allocation_method: string;
        target_selection: string;
        code: string;
    }

    export interface Receipt {
        testcase: boolean;
        authorization: string;
    }

    export interface ShopMoney8 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney8 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet2 {
        shop_money: ShopMoney8;
        presentment_money: PresentmentMoney8;
    }

    export interface Property {
        name: string;
        value: string;
    }

    export interface ShopMoney9 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney9 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountSet {
        shop_money: ShopMoney9;
        presentment_money: PresentmentMoney9;
    }

    export interface ShopMoney10 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney10 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet3 {
        shop_money: ShopMoney10;
        presentment_money: PresentmentMoney10;
    }

    export interface TaxLine2 {
        price: string;
        price_set: PriceSet3;
        rate: number;
        title: string;
    }

    export interface ShopMoney11 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney11 {
        amount: string;
        currency_code: string;
    }

    export interface AmountSet {
        shop_money: ShopMoney11;
        presentment_money: PresentmentMoney11;
    }

    export interface DiscountAllocation {
        amount: string;
        amount_set: AmountSet;
        discount_application_index: number;
    }

    export interface LineItem {
        id: number;
        admin_graphql_api_id: string;
        fulfillable_quantity: number;
        fulfillment_service: string;
        fulfillment_status?: any;
        gift_card: boolean;
        grams: number;
        name: string;
        price: string;
        price_set: PriceSet2;
        product_exists: boolean;
        product_id: number;
        properties: Property[];
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        title: string;
        total_discount: string;
        total_discount_set: TotalDiscountSet;
        variant_id: number;
        variant_inventory_management: string;
        variant_title: string;
        vendor?: any;
        tax_lines: TaxLine2[];
        discount_allocations: DiscountAllocation[];
    }

    export interface Fulfillment {
        id: number;
        admin_graphql_api_id: string;
        created_at: Date;
        location_id: number;
        name: string;
        order_id: number;
        receipt: Receipt;
        service: string;
        shipment_status?: any;
        status: string;
        tracking_company: string;
        tracking_number: string;
        tracking_numbers: string[];
        tracking_url: string;
        tracking_urls: string[];
        updated_at: Date;
        line_items: LineItem[];
    }

    export interface ShopMoney12 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney12 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet4 {
        shop_money: ShopMoney12;
        presentment_money: PresentmentMoney12;
    }

    export interface Property2 {
        name: string;
        value: string;
    }

    export interface ShopMoney13 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney13 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountSet2 {
        shop_money: ShopMoney13;
        presentment_money: PresentmentMoney13;
    }

    export interface ShopMoney14 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney14 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet5 {
        shop_money: ShopMoney14;
        presentment_money: PresentmentMoney14;
    }

    export interface TaxLine3 {
        price: string;
        price_set: PriceSet5;
        rate: number;
        title: string;
    }

    export interface ShopMoney15 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney15 {
        amount: string;
        currency_code: string;
    }

    export interface AmountSet2 {
        shop_money: ShopMoney15;
        presentment_money: PresentmentMoney15;
    }

    export interface DiscountAllocation2 {
        amount: string;
        amount_set: AmountSet2;
        discount_application_index: number;
    }

    export interface LineItem2 {
        id: number;
        admin_graphql_api_id: string;
        fulfillable_quantity: number;
        fulfillment_service: string;
        fulfillment_status?: any;
        gift_card: boolean;
        grams: number;
        name: string;
        price: string;
        price_set: PriceSet4;
        product_exists: boolean;
        product_id: number;
        properties: Property2[];
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        title: string;
        total_discount: string;
        total_discount_set: TotalDiscountSet2;
        variant_id: number;
        variant_inventory_management: string;
        variant_title: string;
        vendor?: any;
        tax_lines: TaxLine3[];
        discount_allocations: DiscountAllocation2[];
    }

    export interface PaymentDetails {
        credit_card_bin?: any;
        avs_result_code?: any;
        cvv_result_code?: any;
        credit_card_number: string;
        credit_card_company: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Receipt2 {
    }

    export interface Transaction {
        id: number;
        admin_graphql_api_id: string;
        amount: string;
        authorization: string;
        created_at: Date;
        currency: string;
        device_id?: any;
        error_code?: any;
        gateway: string;
        kind: string;
        location_id?: any;
        message?: any;
        order_id: number;
        parent_id: number;
        processed_at: Date;
        receipt: Receipt2;
        source_name: string;
        status: string;
        test: boolean;
        user_id?: any;
    }

    export interface ShopMoney16 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney16 {
        amount: string;
        currency_code: string;
    }

    export interface SubtotalSet {
        shop_money: ShopMoney16;
        presentment_money: PresentmentMoney16;
    }

    export interface ShopMoney17 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney17 {
        amount: string;
        currency_code: string;
    }

    export interface TotalTaxSet2 {
        shop_money: ShopMoney17;
        presentment_money: PresentmentMoney17;
    }

    export interface ShopMoney18 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney18 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet6 {
        shop_money: ShopMoney18;
        presentment_money: PresentmentMoney18;
    }

    export interface Property3 {
        name: string;
        value: string;
    }

    export interface ShopMoney19 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney19 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountSet3 {
        shop_money: ShopMoney19;
        presentment_money: PresentmentMoney19;
    }

    export interface ShopMoney20 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney20 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet7 {
        shop_money: ShopMoney20;
        presentment_money: PresentmentMoney20;
    }

    export interface TaxLine4 {
        price: string;
        price_set: PriceSet7;
        rate: number;
        title: string;
    }

    export interface ShopMoney21 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney21 {
        amount: string;
        currency_code: string;
    }

    export interface AmountSet3 {
        shop_money: ShopMoney21;
        presentment_money: PresentmentMoney21;
    }

    export interface DiscountAllocation3 {
        amount: string;
        amount_set: AmountSet3;
        discount_application_index: number;
    }

    export interface LineItem3 {
        id: number;
        admin_graphql_api_id: string;
        fulfillable_quantity: number;
        fulfillment_service: string;
        fulfillment_status?: any;
        gift_card: boolean;
        grams: number;
        name: string;
        price: string;
        price_set: PriceSet6;
        product_exists: boolean;
        product_id: number;
        properties: Property3[];
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        title: string;
        total_discount: string;
        total_discount_set: TotalDiscountSet3;
        variant_id: number;
        variant_inventory_management: string;
        variant_title: string;
        vendor?: any;
        tax_lines: TaxLine4[];
        discount_allocations: DiscountAllocation3[];
    }

    export interface RefundLineItem {
        id: number;
        line_item_id: number;
        location_id: number;
        quantity: number;
        restock_type: string;
        subtotal: number;
        subtotal_set: SubtotalSet;
        total_tax: number;
        total_tax_set: TotalTaxSet2;
        line_item: LineItem3;
    }

    export interface Refund {
        id: number;
        admin_graphql_api_id: string;
        created_at: Date;
        note: string;
        order_id: number;
        processed_at: Date;
        restock: boolean;
        user_id: number;
        order_adjustments: any[];
        transactions: Transaction[];
        refund_line_items: RefundLineItem[];
    }

    export interface ShippingAddress {
        first_name: string;
        address1: string;
        phone: string;
        city: string;
        zip: string;
        province: string;
        country: string;
        last_name: string;
        address2: string;
        company?: any;
        latitude: number;
        longitude: number;
        name: string;
        country_code: string;
        province_code: string;
    }

    export interface ShopMoney22 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney22 {
        amount: string;
        currency_code: string;
    }

    export interface DiscountedPriceSet {
        shop_money: ShopMoney22;
        presentment_money: PresentmentMoney22;
    }

    export interface ShopMoney23 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney23 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet8 {
        shop_money: ShopMoney23;
        presentment_money: PresentmentMoney23;
    }

    export interface ShippingLine {
        id: number;
        carrier_identifier?: any;
        code: string;
        delivery_category?: any;
        discounted_price: string;
        discounted_price_set: DiscountedPriceSet;
        phone?: any;
        price: string;
        price_set: PriceSet8;
        requested_fulfillment_service_id?: any;
        source: string;
        title: string;
        tax_lines: any[];
        discount_allocations: any[];
    }

    export interface Order {
        id: number;
        admin_graphql_api_id: string;
        app_id?: any;
        browser_ip: string;
        buyer_accepts_marketing: boolean;
        cancel_reason?: any;
        cancelled_at?: any;
        cart_token: string;
        checkout_id: number;
        checkout_token: string;
        client_details: ClientDetails;
        closed_at?: any;
        confirmed: boolean;
        contact_email: string;
        created_at: Date;
        currency: string;
        customer_locale?: any;
        device_id?: any;
        discount_codes: DiscountCode[];
        email: string;
        financial_status: string;
        fulfillment_status?: any;
        gateway: string;
        landing_site: string;
        landing_site_ref: string;
        location_id?: any;
        name: string;
        note?: any;
        note_attributes: NoteAttribute[];
        number: number;
        order_number: number;
        order_status_url: string;
        payment_gateway_names: string[];
        phone: string;
        presentment_currency: string;
        processed_at: Date;
        processing_method: string;
        reference: string;
        referring_site: string;
        source_identifier: string;
        source_name: string;
        source_url?: any;
        subtotal_price: string;
        subtotal_price_set: SubtotalPriceSet;
        tags: string;
        tax_lines: TaxLine[];
        taxes_included: boolean;
        test: boolean;
        token: string;
        total_discounts: string;
        total_discounts_set: TotalDiscountsSet;
        total_line_items_price: string;
        total_line_items_price_set: TotalLineItemsPriceSet;
        total_price: string;
        total_price_set: TotalPriceSet;
        total_price_usd: string;
        total_shipping_price_set: TotalShippingPriceSet;
        total_tax: string;
        total_tax_set: TotalTaxSet;
        total_tip_received: string;
        total_weight: number;
        updated_at: Date;
        user_id?: any;
        billing_address: BillingAddress;
        customer: Customer;
        discount_applications: DiscountApplication[];
        fulfillments: Fulfillment[];
        line_items: LineItem2[];
        payment_details: PaymentDetails;
        refunds: Refund[];
        shipping_address: ShippingAddress;
        shipping_lines: ShippingLine[];
    }

}

export declare namespace GetCustomerOrdersByEmailResponse {

    export interface ShopMoney {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney {
        amount: string;
        currency_code: string;
    }

    export interface CurrentSubtotalPriceSet {
        shop_money: ShopMoney;
        presentment_money: PresentmentMoney;
    }

    export interface ShopMoney2 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney2 {
        amount: string;
        currency_code: string;
    }

    export interface CurrentTotalDiscountsSet {
        shop_money: ShopMoney2;
        presentment_money: PresentmentMoney2;
    }

    export interface ShopMoney3 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney3 {
        amount: string;
        currency_code: string;
    }

    export interface CurrentTotalPriceSet {
        shop_money: ShopMoney3;
        presentment_money: PresentmentMoney3;
    }

    export interface ShopMoney4 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney4 {
        amount: string;
        currency_code: string;
    }

    export interface CurrentTotalTaxSet {
        shop_money: ShopMoney4;
        presentment_money: PresentmentMoney4;
    }

    export interface NoteAttribute {
        name: string;
        value: string;
    }

    export interface ShopMoney5 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney5 {
        amount: string;
        currency_code: string;
    }

    export interface SubtotalPriceSet {
        shop_money: ShopMoney5;
        presentment_money: PresentmentMoney5;
    }

    export interface ShopMoney6 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney6 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountsSet {
        shop_money: ShopMoney6;
        presentment_money: PresentmentMoney6;
    }

    export interface ShopMoney7 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney7 {
        amount: string;
        currency_code: string;
    }

    export interface TotalLineItemsPriceSet {
        shop_money: ShopMoney7;
        presentment_money: PresentmentMoney7;
    }

    export interface ShopMoney8 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney8 {
        amount: string;
        currency_code: string;
    }

    export interface TotalPriceSet {
        shop_money: ShopMoney8;
        presentment_money: PresentmentMoney8;
    }

    export interface ShopMoney9 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney9 {
        amount: string;
        currency_code: string;
    }

    export interface TotalShippingPriceSet {
        shop_money: ShopMoney9;
        presentment_money: PresentmentMoney9;
    }

    export interface ShopMoney10 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney10 {
        amount: string;
        currency_code: string;
    }

    export interface TotalTaxSet {
        shop_money: ShopMoney10;
        presentment_money: PresentmentMoney10;
    }

    export interface BillingAddress {
        first_name: string;
        address1: string;
        phone?: any;
        city: string;
        zip: string;
        province: string;
        country: string;
        last_name: string;
        address2?: any;
        company?: any;
        latitude?: number;
        longitude?: number;
        name: string;
        country_code: string;
        province_code: string;
    }

    export interface SmsMarketingConsent {
        state: string;
        opt_in_level: string;
        consent_updated_at: Date;
        consent_collected_from: string;
    }

    export interface DefaultAddress {
        id: any;
        customer_id: any;
        first_name: string;
        last_name: string;
        company: string;
        address1: string;
        address2: string;
        city: string;
        province: string;
        country: string;
        zip: string;
        phone: string;
        name: string;
        province_code: string;
        country_code: string;
        country_name: string;
        default: boolean;
    }

    export interface Customer {
        id: any;
        email: string;
        accepts_marketing: boolean;
        created_at: Date;
        updated_at: Date;
        first_name: string;
        last_name: string;
        orders_count: number;
        state: string;
        total_spent: string;
        last_order_id: any;
        note: string;
        verified_email: boolean;
        multipass_identifier?: any;
        tax_exempt: boolean;
        tags: string;
        last_order_name: string;
        currency: string;
        phone: string;
        accepts_marketing_updated_at: Date;
        marketing_opt_in_level: string;
        tax_exemptions: any[];
        sms_marketing_consent: SmsMarketingConsent;
        admin_graphql_api_id: string;
        default_address: DefaultAddress;
    }

    export interface ShopMoney11 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney11 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet {
        shop_money: ShopMoney11;
        presentment_money: PresentmentMoney11;
    }

    export interface ShopMoney12 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney12 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountSet {
        shop_money: ShopMoney12;
        presentment_money: PresentmentMoney12;
    }

    export interface LineItem {
        id: any;
        admin_graphql_api_id: string;
        fulfillable_quantity: number;
        fulfillment_service: string;
        fulfillment_status?: any;
        gift_card: boolean;
        grams: number;
        name: string;
        price: string;
        price_set: PriceSet;
        product_exists: boolean;
        product_id: any;
        properties: any[];
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        title: string;
        total_discount: string;
        total_discount_set: TotalDiscountSet;
        variant_id: any;
        variant_inventory_management: string;
        variant_title?: any;
        vendor: string;
        tax_lines: any[];
        duties: any[];
        discount_allocations: any[];
    }

    export interface ShippingAddress {
        first_name: string;
        address1: string;
        phone: string;
        city: string;
        zip: string;
        province: string;
        country: string;
        last_name: string;
        address2: string;
        company: string;
        latitude: number;
        longitude: number;
        name: string;
        country_code: string;
        province_code: string;
    }

    export interface ShopMoney13 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney13 {
        amount: string;
        currency_code: string;
    }

    export interface DiscountedPriceSet {
        shop_money: ShopMoney13;
        presentment_money: PresentmentMoney13;
    }

    export interface ShopMoney14 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney14 {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet2 {
        shop_money: ShopMoney14;
        presentment_money: PresentmentMoney14;
    }

    export interface ShippingLine {
        id: any;
        carrier_identifier: string;
        code: string;
        delivery_category?: any;
        discounted_price: string;
        discounted_price_set: DiscountedPriceSet;
        phone?: any;
        price: string;
        price_set: PriceSet2;
        requested_fulfillment_service_id?: any;
        source: string;
        title: string;
        tax_lines: any[];
        discount_allocations: any[];
    }

    export interface Order {
        id: any;
        admin_graphql_api_id: string;
        app_id: number;
        browser_ip?: any;
        buyer_accepts_marketing: boolean;
        cancel_reason?: any;
        cancelled_at?: any;
        cart_token?: any;
        checkout_id?: any;
        checkout_token?: any;
        closed_at?: any;
        confirmed: boolean;
        contact_email: string;
        created_at: Date;
        currency: string;
        current_subtotal_price: string;
        current_subtotal_price_set: CurrentSubtotalPriceSet;
        current_total_discounts: string;
        current_total_discounts_set: CurrentTotalDiscountsSet;
        current_total_duties_set?: any;
        current_total_price: string;
        current_total_price_set: CurrentTotalPriceSet;
        current_total_tax: string;
        current_total_tax_set: CurrentTotalTaxSet;
        customer_locale: string;
        device_id?: any;
        discount_codes: any[];
        email: string;
        estimated_taxes: boolean;
        financial_status: string;
        fulfillment_status?: any;
        gateway: string;
        landing_site?: any;
        landing_site_ref?: any;
        location_id?: any;
        name: string;
        note: string;
        note_attributes: NoteAttribute[];
        number: number;
        order_number: number;
        order_status_url: string;
        original_total_duties_set?: any;
        payment_gateway_names: string[];
        phone: string;
        presentment_currency: string;
        processed_at: Date;
        processing_method: string;
        reference?: any;
        referring_site?: any;
        source_identifier?: any;
        source_name: string;
        source_url?: any;
        subtotal_price: string;
        subtotal_price_set: SubtotalPriceSet;
        tags: string;
        tax_lines: any[];
        taxes_included: boolean;
        test: boolean;
        token: string;
        total_discounts: string;
        total_discounts_set: TotalDiscountsSet;
        total_line_items_price: string;
        total_line_items_price_set: TotalLineItemsPriceSet;
        total_outstanding: string;
        total_price: string;
        total_price_set: TotalPriceSet;
        total_price_usd: string;
        total_shipping_price_set: TotalShippingPriceSet;
        total_tax: string;
        total_tax_set: TotalTaxSet;
        total_tip_received: string;
        total_weight: number;
        updated_at: Date;
        user_id?: any;
        billing_address: BillingAddress;
        customer: Customer;
        discount_applications: any[];
        fulfillments: any[];
        line_items: LineItem[];
        payment_terms?: any;
        refunds: any[];
        shipping_address: ShippingAddress;
        shipping_lines: ShippingLine[];
    }

    export interface RootObject {
        orders: Order[];
    }

}

export declare namespace GetShopifyOrderByApiId {

    export interface NoteAttribute {
        name: string;
        value: string;
    }

    export interface EmailMarketingConsent {
        state: string;
        opt_in_level: string;
        consent_updated_at?: any;
    }

    export interface SmsMarketingConsent {
        state: string;
        opt_in_level: string;
        consent_updated_at?: any;
        consent_collected_from: string;
    }

    export interface DefaultAddress {
        id: number;
        customer_id: number;
        first_name: string;
        last_name: string;
        company?: any;
        address1: string;
        address2: string;
        city: string;
        province: string;
        country: string;
        zip: string;
        phone: string;
        name: string;
        province_code: string;
        country_code: string;
        country_name: string;
        default: boolean;
    }

    export interface Customer {
        id: number;
        email: string;
        accepts_marketing: boolean;
        created_at: Date;
        updated_at: Date;
        first_name: string;
        last_name: string;
        state: string;
        note?: any;
        verified_email: boolean;
        multipass_identifier?: any;
        tax_exempt: boolean;
        tags: string;
        currency: string;
        phone: string;
        accepts_marketing_updated_at: Date;
        marketing_opt_in_level?: any;
        tax_exemptions: any[];
        email_marketing_consent: EmailMarketingConsent;
        sms_marketing_consent: SmsMarketingConsent;
        admin_graphql_api_id: string;
        default_address: DefaultAddress;
    }

    export interface OriginLocation {
        id: number;
        country_code: string;
        province_code: string;
        name: string;
        address1: string;
        address2: string;
        city: string;
        zip: string;
    }

    export interface ShopMoney {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney {
        amount: string;
        currency_code: string;
    }

    export interface PriceSet {
        shop_money: ShopMoney;
        presentment_money: PresentmentMoney;
    }

    export interface ShopMoney2 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney2 {
        amount: string;
        currency_code: string;
    }

    export interface TotalDiscountSet {
        shop_money: ShopMoney2;
        presentment_money: PresentmentMoney2;
    }

    export interface ShopMoney3 {
        amount: string;
        currency_code: string;
    }

    export interface PresentmentMoney3 {
        amount: string;
        currency_code: string;
    }

    export interface AmountSet {
        shop_money: ShopMoney3;
        presentment_money: PresentmentMoney3;
    }

    export interface DiscountAllocation {
        amount: string;
        amount_set: AmountSet;
        discount_application_index: number;
    }

    export interface LineItem {
        id: number;
        admin_graphql_api_id: string;
        fulfillable_quantity: number;
        fulfillment_service: string;
        fulfillment_status?: any;
        gift_card: boolean;
        grams: number;
        name: string;
        origin_location: OriginLocation;
        price: string;
        price_set: PriceSet;
        product_exists: boolean;
        product_id: number;
        properties: any[];
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        title: string;
        total_discount: string;
        total_discount_set: TotalDiscountSet;
        variant_id: number;
        variant_inventory_management: string;
        variant_title: string;
        vendor: string;
        tax_lines: any[];
        duties: any[];
        discount_allocations: DiscountAllocation[];
    }

    export interface Order {
        id: number;
        admin_graphql_api_id: string;
        name: string;
        note_attributes: NoteAttribute[];
        total_price: string;
        customer: Customer;
        line_items: LineItem[];
    }

    export interface RootObject {
        order: Order;
    }

}

