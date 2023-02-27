import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Decimal: any;
  GenericScalar: any;
  ISODateTime: any;
  Money: any;
};

export type AbortInventorySyncInput = {
  reason?: InputMaybe<Scalars['String']>;
  sync_id: Scalars['String'];
};

export type AbortInventorySyncOutput = {
  __typename?: 'AbortInventorySyncOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  sync?: Maybe<InventorySyncStatus>;
};

export type Account = {
  __typename?: 'Account';
  customers?: Maybe<AccountConnection>;
  cycle_count_enabled?: Maybe<Scalars['Boolean']>;
  dynamic_slotting?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  is_3pl?: Maybe<Scalars['Boolean']>;
  is_multi_warehouse?: Maybe<Scalars['Boolean']>;
  legacy_id?: Maybe<Scalars['Int']>;
  ship_backorders?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  warehouses?: Maybe<Array<Maybe<Warehouse>>>;
};


export type AccountCustomersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type AccountConnection = {
  __typename?: 'AccountConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AccountEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Account` and its cursor. */
export type AccountEdge = {
  __typename?: 'AccountEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Account>;
};

export type AccountQueryResult = {
  __typename?: 'AccountQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Account>;
  request_id?: Maybe<Scalars['String']>;
};

export type AddHistoryInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  history_entry?: InputMaybe<UserNoteInput>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
};

export type AddLineItemsInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  line_items: Array<InputMaybe<CreateLineItemInput>>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
};

export type AddProductToVendorInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  manufacturer_sku?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  vendor_id: Scalars['String'];
};

export type AddProductToWarehouseInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  inventory_bin?: InputMaybe<Scalars['String']>;
  inventory_overstock_bin?: InputMaybe<Scalars['String']>;
  on_hand?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['String']>;
  reorder_amount?: InputMaybe<Scalars['Int']>;
  reorder_level?: InputMaybe<Scalars['Int']>;
  replenishment_level?: InputMaybe<Scalars['Int']>;
  reserve_inventory?: InputMaybe<Scalars['Int']>;
  sku: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type AddPurchaseOrderAttachmentInput = {
  description?: InputMaybe<Scalars['String']>;
  file_type?: InputMaybe<Scalars['String']>;
  filename?: InputMaybe<Scalars['String']>;
  po_id: Scalars['String'];
  url: Scalars['String'];
};

export type AddPurchaseOrderAttachmentOutput = {
  __typename?: 'AddPurchaseOrderAttachmentOutput';
  attachment?: Maybe<PurchaseOrderAttachment>;
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
};

export type Address = {
  __typename?: 'Address';
  /** Address line 1 */
  address1?: Maybe<Scalars['String']>;
  /** Address line 2 */
  address2?: Maybe<Scalars['String']>;
  /** Address's City */
  city?: Maybe<Scalars['String']>;
  /** Address's Country */
  country?: Maybe<Scalars['String']>;
  /** The address's name or name of the person assigned to the address */
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  /** Address's State */
  state?: Maybe<Scalars['String']>;
  /** Address's Postal Code */
  zip?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};

/** GraphQL input type for assigning a Lot to a Location. */
export type AssignLotToLocationInput = {
  /** Unique identifier of the Location the product is placed at */
  location_id: Scalars['String'];
  /** Unique identifier of the Lot the product belongs to */
  lot_id: Scalars['String'];
};

/** GraphQL output type for assigning a Lot to a Location. */
export type AssignLotToLocationOutput = {
  __typename?: 'AssignLotToLocationOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  warehouse_product?: Maybe<WarehouseProduct>;
};

export type Authorization = {
  __typename?: 'Authorization';
  authorized_amount?: Maybe<Scalars['String']>;
  card_type?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['ISODateTime']>;
  postauthed_amount?: Maybe<Scalars['String']>;
  refunded_amount?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

export type Bill = {
  __typename?: 'Bill';
  amount?: Maybe<Scalars['Money']>;
  bill_exports?: Maybe<BillExportsConnection>;
  billing_frequency?: Maybe<Scalars['String']>;
  billing_period?: Maybe<BillingPeriod>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  customer_name?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  profile_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  totals?: Maybe<FeeCategoryTotalConnection>;
};


export type BillBill_ExportsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type BillTotalsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type BillConnection = {
  __typename?: 'BillConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BillEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Bill` and its cursor. */
export type BillEdge = {
  __typename?: 'BillEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Bill>;
};

export type BillExports = {
  __typename?: 'BillExports';
  file_url?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
};

export type BillExportsConnection = {
  __typename?: 'BillExportsConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BillExportsEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `BillExports` and its cursor. */
export type BillExportsEdge = {
  __typename?: 'BillExportsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<BillExports>;
};

export type BillQueryResult = {
  __typename?: 'BillQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Bill>;
  request_id?: Maybe<Scalars['String']>;
};

export type BillingPeriod = {
  __typename?: 'BillingPeriod';
  end?: Maybe<Scalars['ISODateTime']>;
  start?: Maybe<Scalars['ISODateTime']>;
};

export type BillsQueryResult = {
  __typename?: 'BillsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<BillConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type BillsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type BuildKitComponentInput = {
  quantity: Scalars['Int'];
  sku: Scalars['String'];
};

export type BuildKitInput = {
  components: Array<InputMaybe<BuildKitComponentInput>>;
  kit_build?: InputMaybe<Scalars['Boolean']>;
  sku: Scalars['String'];
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type CancelOrderInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  /** Cancel an order even if it has valid labels and completed shipments */
  force?: InputMaybe<Scalars['Boolean']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
  /** Whether or not to void the order on the sales platform */
  void_on_platform?: InputMaybe<Scalars['Boolean']>;
};

export type CancelPurchaseOrderInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  po_id: Scalars['String'];
};

export type CancelPurchaseOrderOutput = {
  __typename?: 'CancelPurchaseOrderOutput';
  complexity?: Maybe<Scalars['Int']>;
  purchase_order?: Maybe<PurchaseOrder>;
  request_id?: Maybe<Scalars['String']>;
};

export type Case = {
  __typename?: 'Case';
  case_barcode?: Maybe<Scalars['String']>;
  case_quantity?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
};

export type ChangeOrderWarehouseInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type ClearKitInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
};

export type ClosePurchaseOrderInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  po_id: Scalars['String'];
};

export type ClosePurchaseOrderOutput = {
  __typename?: 'ClosePurchaseOrderOutput';
  complexity?: Maybe<Scalars['Int']>;
  purchase_order?: Maybe<PurchaseOrder>;
  request_id?: Maybe<Scalars['String']>;
};

export type CreateBillInput = {
  customer_account_id: Scalars['String'];
  end_date: Scalars['ISODateTime'];
  start_date: Scalars['ISODateTime'];
};

export type CreateBillOutput = {
  __typename?: 'CreateBillOutput';
  bill?: Maybe<Bill>;
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
};

export type CreateExchangeItem = {
  exchange_product_sku: Scalars['String'];
  quantity: Scalars['Int'];
  return_item_id: Scalars['String'];
};

export type CreateLabelResourceInput = {
  image_location?: InputMaybe<Scalars['String']>;
  paper_pdf_location?: InputMaybe<Scalars['String']>;
  pdf_location?: InputMaybe<Scalars['String']>;
  thermal_pdf_location?: InputMaybe<Scalars['String']>;
};

export type CreateLineItemInput = {
  barcode?: InputMaybe<Scalars['String']>;
  custom_barcode?: InputMaybe<Scalars['String']>;
  custom_options?: InputMaybe<Scalars['GenericScalar']>;
  /** A decimal value used for customs */
  customs_value?: InputMaybe<Scalars['String']>;
  eligible_for_return?: InputMaybe<Scalars['Boolean']>;
  fulfillment_status?: InputMaybe<Scalars['String']>;
  option_title?: InputMaybe<Scalars['String']>;
  /** A unique identifier, usually the customer's internal id. It should be unique across all the order's line items, and is recommended to be unique accross the entire store. */
  partner_line_item_id: Scalars['String'];
  price: Scalars['String'];
  product_name?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Int'];
  quantity_pending_fulfillment?: InputMaybe<Scalars['Int']>;
  sku: Scalars['String'];
  /** Set to lock to that warehouse. The item will not be moved in any multi-warehouse processing */
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type CreateLocationInput = {
  dimensions?: InputMaybe<DimensionsInput>;
  is_cart?: InputMaybe<Scalars['Boolean']>;
  location_type_id?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  pick_priority?: InputMaybe<Scalars['Int']>;
  pickable?: InputMaybe<Scalars['Boolean']>;
  sellable?: InputMaybe<Scalars['Boolean']>;
  temperature?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
  zone: Scalars['String'];
};

/** GraphQL input type for Lot creation. */
export type CreateLotInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  expires_at?: InputMaybe<Scalars['ISODateTime']>;
  is_active?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  sku: Scalars['String'];
};

/** GraphQL output type for Lot creation. */
export type CreateLotOutput = {
  __typename?: 'CreateLotOutput';
  complexity?: Maybe<Scalars['Int']>;
  lot?: Maybe<Lot>;
  request_id?: Maybe<Scalars['String']>;
};

/**
 * Order type for addresses. Orders have addresses with more details than the rest of the system
 * so we use our own types
 */
export type CreateOrderAddressInput = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  country_code?: InputMaybe<Scalars['String']>;
  /** Order email takes precedence, followed by shipping address email, then billing address email */
  email?: InputMaybe<Scalars['String']>;
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  state_code?: InputMaybe<Scalars['String']>;
  zip?: InputMaybe<Scalars['String']>;
};

export type CreateOrderInput = {
  address_is_business?: InputMaybe<Scalars['Boolean']>;
  adult_signature_required?: InputMaybe<Scalars['Boolean']>;
  alcohol?: InputMaybe<Scalars['Boolean']>;
  allocation_priority?: InputMaybe<Scalars['Int']>;
  allow_partial?: InputMaybe<Scalars['Boolean']>;
  allow_split?: InputMaybe<Scalars['Boolean']>;
  auto_print_return_label?: InputMaybe<Scalars['Boolean']>;
  billing_address?: InputMaybe<CreateOrderAddressInput>;
  box_name?: InputMaybe<Scalars['String']>;
  currency?: InputMaybe<Scalars['String']>;
  custom_invoice_url?: InputMaybe<Scalars['String']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  dry_ice_weight_in_lbs?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  flagged?: InputMaybe<Scalars['Boolean']>;
  from_name?: InputMaybe<Scalars['String']>;
  ftr_exemption?: InputMaybe<Scalars['Decimal']>;
  /** Status of the order (pending, fulfilled, cancelled, etc) */
  fulfillment_status?: InputMaybe<Scalars['String']>;
  gift_invoice?: InputMaybe<Scalars['Boolean']>;
  gift_note?: InputMaybe<Scalars['String']>;
  hold_until_date?: InputMaybe<Scalars['ISODateTime']>;
  holds?: InputMaybe<HoldsInput>;
  /** US addresses are be validated and when errors occur the order will have an address hold created. If this flag is set then the error validation is skipped and no address hold is created */
  ignore_address_validation_errors?: InputMaybe<Scalars['Boolean']>;
  incoterms?: InputMaybe<Scalars['String']>;
  insurance?: InputMaybe<Scalars['Boolean']>;
  line_items?: InputMaybe<Array<InputMaybe<CreateLineItemInput>>>;
  note_attributes?: InputMaybe<Array<InputMaybe<OrderNoteAttributeInput>>>;
  order_date?: InputMaybe<Scalars['ISODateTime']>;
  /** The store's internal order number */
  order_number?: InputMaybe<Scalars['String']>;
  packing_note?: InputMaybe<Scalars['String']>;
  partner_order_id?: InputMaybe<Scalars['String']>;
  priority_flag?: InputMaybe<Scalars['Boolean']>;
  profile?: InputMaybe<Scalars['String']>;
  ready_to_ship?: InputMaybe<Scalars['Boolean']>;
  require_signature?: InputMaybe<Scalars['Boolean']>;
  required_ship_date?: InputMaybe<Scalars['ISODateTime']>;
  saturday_delivery?: InputMaybe<Scalars['Boolean']>;
  shipping_address: CreateOrderAddressInput;
  shipping_lines?: InputMaybe<CreateShippingLinesInput>;
  shop_name?: InputMaybe<Scalars['String']>;
  /** Not address validation will be performed */
  skip_address_validation?: InputMaybe<Scalars['Boolean']>;
  subtotal?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tax_id?: InputMaybe<Scalars['String']>;
  tax_type?: InputMaybe<Scalars['String']>;
  total_discounts?: InputMaybe<Scalars['String']>;
  total_price?: InputMaybe<Scalars['String']>;
  total_tax?: InputMaybe<Scalars['String']>;
};

export type CreateProductCaseInput = {
  case_barcode: Scalars['String'];
  case_quantity: Scalars['Int'];
};

export type CreateProductImageInput = {
  position?: InputMaybe<Scalars['Int']>;
  src: Scalars['String'];
};

export type CreateProductInput = {
  barcode?: InputMaybe<Scalars['String']>;
  cases?: InputMaybe<Array<InputMaybe<CreateProductCaseInput>>>;
  country_of_manufacture?: InputMaybe<Scalars['String']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  customs_description?: InputMaybe<Scalars['String']>;
  customs_value?: InputMaybe<Scalars['String']>;
  dimensions?: InputMaybe<DimensionsInput>;
  dropship?: InputMaybe<Scalars['Boolean']>;
  final_sale?: InputMaybe<Scalars['Boolean']>;
  images?: InputMaybe<Array<InputMaybe<CreateProductImageInput>>>;
  kit?: InputMaybe<Scalars['Boolean']>;
  kit_build?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  needs_lot_tracking?: InputMaybe<Scalars['Boolean']>;
  needs_serial_number?: InputMaybe<Scalars['Boolean']>;
  no_air?: InputMaybe<Scalars['Boolean']>;
  not_owned?: InputMaybe<Scalars['Boolean']>;
  packer_note?: InputMaybe<Scalars['String']>;
  /** Will be used as the default price for each warehouse product, if no priceis defined on them. */
  price?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tariff_code?: InputMaybe<Scalars['String']>;
  /** Will be used as the default value for each warehouse product, if no valueis defined on them. */
  value?: InputMaybe<Scalars['String']>;
  vendors?: InputMaybe<Array<InputMaybe<CreateProductVendorInput>>>;
  virtual?: InputMaybe<Scalars['Boolean']>;
  warehouse_products: Array<InputMaybe<CreateWarehouseProductInput>>;
};

export type CreateProductOutput = {
  __typename?: 'CreateProductOutput';
  complexity?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
  request_id?: Maybe<Scalars['String']>;
};

export type CreateProductVendorInput = {
  price?: InputMaybe<Scalars['String']>;
  vendor_id: Scalars['String'];
  vendor_sku: Scalars['String'];
};

export type CreatePurchaseOrderAttachmentInput = {
  description?: InputMaybe<Scalars['String']>;
  file_type?: InputMaybe<Scalars['String']>;
  filename?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type CreatePurchaseOrderInput = {
  attachments?: InputMaybe<Array<InputMaybe<CreatePurchaseOrderAttachmentInput>>>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<Scalars['String']>;
  fulfillment_status?: InputMaybe<Scalars['String']>;
  line_items: Array<InputMaybe<CreatePurchaseOrderLineItemInput>>;
  origin_of_shipment?: InputMaybe<Scalars['String']>;
  packing_note?: InputMaybe<Scalars['String']>;
  partner_order_number?: InputMaybe<Scalars['String']>;
  po_date?: InputMaybe<Scalars['ISODateTime']>;
  po_note?: InputMaybe<Scalars['String']>;
  po_number: Scalars['String'];
  shipping_price: Scalars['String'];
  subtotal: Scalars['String'];
  tax?: InputMaybe<Scalars['String']>;
  total_price: Scalars['String'];
  tracking_number?: InputMaybe<Scalars['String']>;
  vendor_id?: InputMaybe<Scalars['String']>;
  warehouse?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
};

export type CreatePurchaseOrderLineItemInput = {
  expected_weight_in_lbs: Scalars['String'];
  fulfillment_status?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  option_title?: InputMaybe<Scalars['String']>;
  partner_line_item_id?: InputMaybe<Scalars['String']>;
  price: Scalars['String'];
  product_name?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Int'];
  quantity_received?: InputMaybe<Scalars['Int']>;
  quantity_rejected?: InputMaybe<Scalars['Int']>;
  sell_ahead?: InputMaybe<Scalars['Int']>;
  sku: Scalars['String'];
  variant_id?: InputMaybe<Scalars['Int']>;
  vendor_id?: InputMaybe<Scalars['String']>;
  vendor_sku?: InputMaybe<Scalars['String']>;
};

export type CreatePurchaseOrderOutput = {
  __typename?: 'CreatePurchaseOrderOutput';
  complexity?: Maybe<Scalars['Int']>;
  purchase_order?: Maybe<PurchaseOrder>;
  request_id?: Maybe<Scalars['String']>;
};

export type CreateReturnExchangeInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  exchange_items: Array<InputMaybe<CreateExchangeItem>>;
  return_id: Scalars['String'];
};

export type CreateReturnExchangeOutput = {
  __typename?: 'CreateReturnExchangeOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  return_exchange?: Maybe<ReturnExchange>;
};

export type CreateReturnInput = {
  address: AddressInput;
  /** If you want us to generate a label for the return */
  create_label?: InputMaybe<Scalars['Boolean']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  dimensions: DimensionsInput;
  /** If the user can have access to the refund form */
  display_issue_refund?: InputMaybe<Scalars['Boolean']>;
  label_cost: Scalars['String'];
  label_type: ReturnLabelType;
  line_items: Array<InputMaybe<CreateReturnLineItemInput>>;
  order_id: Scalars['String'];
  partner_id?: InputMaybe<Scalars['String']>;
  /** If a scheduled return is needed */
  return_pickup_datetime?: InputMaybe<Scalars['DateTime']>;
  return_reason: Scalars['String'];
  shipping_carrier: Scalars['String'];
  shipping_method: Scalars['String'];
  /** If a label was generated outside of ShipHero, you can send us that tracking number so we can create a generic label with it and assign it to the return. */
  tracking_number?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
};

export type CreateReturnItemExchangeInput = {
  exchange_product_sku: Scalars['String'];
  quantity: Scalars['Int'];
};

export type CreateReturnLineItemInput = {
  condition?: InputMaybe<Scalars['String']>;
  exchange_items?: InputMaybe<Array<InputMaybe<CreateReturnItemExchangeInput>>>;
  is_component?: InputMaybe<Scalars['Boolean']>;
  quantity: Scalars['Int'];
  return_reason: Scalars['String'];
  /** The sku of one of the order's line items that is been returned */
  sku: Scalars['String'];
};

export type CreateReturnOutput = {
  __typename?: 'CreateReturnOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  return?: Maybe<Return>;
};

export type CreateShipmentInput = {
  address: AddressInput;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<InputMaybe<CreateShipmentShippingLabelInput>>>;
  line_items: Array<InputMaybe<CreateShipmentLineItemInput>>;
  notify_customer_via_shiphero?: InputMaybe<Scalars['Boolean']>;
  notify_customer_via_store?: InputMaybe<Scalars['Boolean']>;
  order_id: Scalars['String'];
  profile?: InputMaybe<Scalars['String']>;
  shipped_off_shiphero?: InputMaybe<Scalars['Boolean']>;
  warehouse_id: Scalars['String'];
};

export type CreateShipmentLineItemInput = {
  line_item_id: Scalars['String'];
  quantity: Scalars['Int'];
};

export type CreateShipmentOutput = {
  __typename?: 'CreateShipmentOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  shipment?: Maybe<Shipment>;
};

export type CreateShipmentShippingLabelInput = {
  address: AddressInput;
  carrier: Scalars['String'];
  cost: Scalars['String'];
  dimensions: DimensionsInput;
  label: CreateLabelResourceInput;
  /** Specify the line items that should be associated with the label been created. The ids can be shipment line item ids or order line item ids (the ones used to create the shipment line items) */
  line_item_ids: Array<InputMaybe<Scalars['String']>>;
  shipping_method: Scalars['String'];
  shipping_name: Scalars['String'];
  tracking_number?: InputMaybe<Scalars['String']>;
  tracking_url?: InputMaybe<Scalars['String']>;
};

export type CreateShippingLabelInput = {
  address: AddressInput;
  carrier: Scalars['String'];
  cost: Scalars['String'];
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  dimensions: DimensionsInput;
  label: CreateLabelResourceInput;
  /** Specify the line items that should be associated with the label been created. The ids can be shipment line item ids or order line item ids (the ones used to create the shipment line items) */
  line_item_ids: Array<InputMaybe<Scalars['String']>>;
  shipment_id: Scalars['String'];
  shipping_method: Scalars['String'];
  shipping_name: Scalars['String'];
  tracking_number?: InputMaybe<Scalars['String']>;
};

export type CreateShippingLabelOutput = {
  __typename?: 'CreateShippingLabelOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  shipping_label?: Maybe<ShippingLabel>;
};

export type CreateShippingLinesInput = {
  carrier?: InputMaybe<Scalars['String']>;
  method?: InputMaybe<Scalars['String']>;
  price: Scalars['String'];
  title: Scalars['String'];
};

export type CreateShippingPlanInput = {
  line_items: Array<InputMaybe<LineItemInput>>;
  packages?: InputMaybe<Array<InputMaybe<PackageInput>>>;
  pallet?: InputMaybe<PalletData>;
  shipping_price?: InputMaybe<Scalars['String']>;
  subtotal?: InputMaybe<Scalars['String']>;
  total_price?: InputMaybe<Scalars['String']>;
  vendor_po_number?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
  warehouse_note?: InputMaybe<Scalars['String']>;
};

export type CreateShippingPlanOutput = {
  __typename?: 'CreateShippingPlanOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  shipping_plan?: Maybe<ShippingPlan>;
};

export type CreateVendorInput = {
  account_number?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<AddressInput>;
  currency?: InputMaybe<Scalars['String']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  default_po_note?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  internal_note?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  partner_vendor_id?: InputMaybe<Scalars['Int']>;
};

export type CreateVendorOutput = {
  __typename?: 'CreateVendorOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  vendor?: Maybe<Vendor>;
};

export type CreateWarehouseProductInput = {
  custom?: InputMaybe<Scalars['Boolean']>;
  inventory_bin?: InputMaybe<Scalars['String']>;
  inventory_overstock_bin?: InputMaybe<Scalars['String']>;
  on_hand: Scalars['Int'];
  price?: InputMaybe<Scalars['String']>;
  reorder_amount?: InputMaybe<Scalars['Int']>;
  reorder_level?: InputMaybe<Scalars['Int']>;
  replenishment_level?: InputMaybe<Scalars['Int']>;
  reserve_inventory?: InputMaybe<Scalars['Int']>;
  value?: InputMaybe<Scalars['String']>;
  value_currency?: InputMaybe<Scalars['String']>;
  warehouse?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
};

export type CreateWebhookInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  shop_name?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type CreateWebhookOutput = {
  __typename?: 'CreateWebhookOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  webhook?: Maybe<Webhook>;
};

export type CurrentUserQueryResult = {
  __typename?: 'CurrentUserQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<User>;
  request_id?: Maybe<Scalars['String']>;
};

export type DeleteBillInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};

/** GraphQL input type for Lot delete. */
export type DeleteLotInput = {
  lot_id: Scalars['String'];
};

/** GraphQL output type for Lot delete. */
export type DeleteLotOutput = {
  __typename?: 'DeleteLotOutput';
  complexity?: Maybe<Scalars['Int']>;
  lot?: Maybe<Lot>;
  request_id?: Maybe<Scalars['String']>;
};

export type DeleteProductInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
};

export type DeleteVendorInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  vendor_id: Scalars['String'];
};

export type DeleteWarehouseProductInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type DeleteWebhookInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  shop_name?: InputMaybe<Scalars['String']>;
};

export type Dimensions = {
  __typename?: 'Dimensions';
  /** Height in unit configured in the account (In by default) */
  height?: Maybe<Scalars['String']>;
  /** Lenght in unit configured in the account (In by default) */
  length?: Maybe<Scalars['String']>;
  /** Weight in unit configured in the account (Oz by default) */
  weight?: Maybe<Scalars['String']>;
  /** Width in unit configured in the account (In by default) */
  width?: Maybe<Scalars['String']>;
};

export type DimensionsInput = {
  /** Height in unit configured in the account (In by default) */
  height?: InputMaybe<Scalars['String']>;
  /** Lenght in unit configured in the account (In by default) */
  length?: InputMaybe<Scalars['String']>;
  /** Weight in unit configured in the account (Oz by default) */
  weight?: InputMaybe<Scalars['String']>;
  /** Width in unit configured in the account (In by default) */
  width?: InputMaybe<Scalars['String']>;
};

export enum EntityType {
  Account = 'Account',
  Bin = 'Bin',
  LineItem = 'LineItem',
  LocationType = 'LocationType',
  Order = 'Order',
  Product = 'Product',
  PurchaseOrder = 'PurchaseOrder',
  PurchaseOrderLineItem = 'PurchaseOrderLineItem',
  Return = 'Return',
  ReturnItem = 'ReturnItem',
  Shipment = 'Shipment',
  ShippedLineItem = 'ShippedLineItem',
  Tote = 'Tote',
  User = 'User',
  Vendor = 'Vendor',
  Warehouse = 'Warehouse',
  WarehouseProduct = 'WarehouseProduct'
}

export type FbaInventory = {
  __typename?: 'FbaInventory';
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  marketplace_id?: Maybe<Scalars['String']>;
  merchant_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
};

export type FeeCategoryTotal = {
  __typename?: 'FeeCategoryTotal';
  amount?: Maybe<Scalars['Money']>;
  category?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
};

export type FeeCategoryTotalConnection = {
  __typename?: 'FeeCategoryTotalConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FeeCategoryTotalEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FeeCategoryTotal` and its cursor. */
export type FeeCategoryTotalEdge = {
  __typename?: 'FeeCategoryTotalEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FeeCategoryTotal>;
};

export type FulfillOrderInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  note?: InputMaybe<Scalars['String']>;
  notify_customer_via_shiphero?: InputMaybe<Scalars['Boolean']>;
  notify_customer_via_store?: InputMaybe<Scalars['Boolean']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  packages: Array<InputMaybe<ShippedPackagesInput>>;
  shipped_off_shiphero?: InputMaybe<Scalars['Boolean']>;
  tote_id: Scalars['String'];
};

export type FulfillmentInvoice = {
  __typename?: 'FulfillmentInvoice';
  account_id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  cc_info?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  inbound_shipping_items?: Maybe<FulfillmentInvoiceInboundShippingItemConnection>;
  legacy_id?: Maybe<Scalars['Int']>;
  returns_items?: Maybe<FulfillmentInvoiceReturnItemConnection>;
  shipping_items?: Maybe<FulfillmentInvoiceShippingItemConnection>;
  storage_items?: Maybe<FulfillmentInvoiceStorageItemConnection>;
  stripe_charge_id?: Maybe<Scalars['String']>;
  stripe_invoice_id?: Maybe<Scalars['String']>;
  stripe_invoice_number?: Maybe<Scalars['String']>;
  stripe_invoice_status?: Maybe<Scalars['String']>;
  stripe_invoice_url?: Maybe<Scalars['String']>;
  stripe_next_payment_attempt?: Maybe<Scalars['ISODateTime']>;
};


export type FulfillmentInvoiceInbound_Shipping_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type FulfillmentInvoiceReturns_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type FulfillmentInvoiceShipping_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type FulfillmentInvoiceStorage_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type FulfillmentInvoiceConnection = {
  __typename?: 'FulfillmentInvoiceConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FulfillmentInvoiceEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FulfillmentInvoice` and its cursor. */
export type FulfillmentInvoiceEdge = {
  __typename?: 'FulfillmentInvoiceEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FulfillmentInvoice>;
};

export type FulfillmentInvoiceInboundShippingItem = {
  __typename?: 'FulfillmentInvoiceInboundShippingItem';
  account_id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  purchase_order_id?: Maybe<Scalars['String']>;
  shipment_id?: Maybe<Scalars['String']>;
  shipping_label_id?: Maybe<Scalars['String']>;
};

export type FulfillmentInvoiceInboundShippingItemConnection = {
  __typename?: 'FulfillmentInvoiceInboundShippingItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FulfillmentInvoiceInboundShippingItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FulfillmentInvoiceInboundShippingItem` and its cursor. */
export type FulfillmentInvoiceInboundShippingItemEdge = {
  __typename?: 'FulfillmentInvoiceInboundShippingItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FulfillmentInvoiceInboundShippingItem>;
};

export type FulfillmentInvoiceQueryResult = {
  __typename?: 'FulfillmentInvoiceQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<FulfillmentInvoice>;
  request_id?: Maybe<Scalars['String']>;
};

export type FulfillmentInvoiceReturnItem = {
  __typename?: 'FulfillmentInvoiceReturnItem';
  account_id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  inspection_fee?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  order_id?: Maybe<Scalars['String']>;
  picking_fee?: Maybe<Scalars['String']>;
  restocking_fee?: Maybe<Scalars['String']>;
  rma_id?: Maybe<Scalars['String']>;
  rma_label_id?: Maybe<Scalars['String']>;
  shipping_rate?: Maybe<Scalars['String']>;
};

export type FulfillmentInvoiceReturnItemConnection = {
  __typename?: 'FulfillmentInvoiceReturnItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FulfillmentInvoiceReturnItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FulfillmentInvoiceReturnItem` and its cursor. */
export type FulfillmentInvoiceReturnItemEdge = {
  __typename?: 'FulfillmentInvoiceReturnItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FulfillmentInvoiceReturnItem>;
};

export type FulfillmentInvoiceShippingItem = {
  __typename?: 'FulfillmentInvoiceShippingItem';
  account_id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  order_id?: Maybe<Scalars['String']>;
  overcharge_fee?: Maybe<Scalars['String']>;
  picking_fee?: Maybe<Scalars['String']>;
  processing_fee?: Maybe<Scalars['String']>;
  shipment_id?: Maybe<Scalars['String']>;
  shipping_label_id?: Maybe<Scalars['String']>;
  shipping_rate?: Maybe<Scalars['String']>;
};

export type FulfillmentInvoiceShippingItemConnection = {
  __typename?: 'FulfillmentInvoiceShippingItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FulfillmentInvoiceShippingItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FulfillmentInvoiceShippingItem` and its cursor. */
export type FulfillmentInvoiceShippingItemEdge = {
  __typename?: 'FulfillmentInvoiceShippingItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FulfillmentInvoiceShippingItem>;
};

export type FulfillmentInvoiceStorageItem = {
  __typename?: 'FulfillmentInvoiceStorageItem';
  account_id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  invoice_id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type FulfillmentInvoiceStorageItemConnection = {
  __typename?: 'FulfillmentInvoiceStorageItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<FulfillmentInvoiceStorageItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `FulfillmentInvoiceStorageItem` and its cursor. */
export type FulfillmentInvoiceStorageItemEdge = {
  __typename?: 'FulfillmentInvoiceStorageItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<FulfillmentInvoiceStorageItem>;
};

export type FulfillmentInvoicesQueryResult = {
  __typename?: 'FulfillmentInvoicesQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<FulfillmentInvoiceConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type FulfillmentInvoicesQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type HoldsInput = {
  address_hold?: InputMaybe<Scalars['Boolean']>;
  client_hold?: InputMaybe<Scalars['Boolean']>;
  fraud_hold?: InputMaybe<Scalars['Boolean']>;
  operator_hold?: InputMaybe<Scalars['Boolean']>;
  payment_hold?: InputMaybe<Scalars['Boolean']>;
};

export type InventoryAbortSnapshotInput = {
  reason?: InputMaybe<Scalars['String']>;
  snapshot_id: Scalars['String'];
};

export type InventoryChange = {
  __typename?: 'InventoryChange';
  account_id?: Maybe<Scalars['String']>;
  change_in_on_hand?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  cycle_counted?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['String']>;
  previous_on_hand?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
  reason?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type InventoryChangeConnection = {
  __typename?: 'InventoryChangeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InventoryChangeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `InventoryChange` and its cursor. */
export type InventoryChangeEdge = {
  __typename?: 'InventoryChangeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<InventoryChange>;
};

export type InventoryChangesQueryResult = {
  __typename?: 'InventoryChangesQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<InventoryChangeConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type InventoryChangesQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type InventoryGenerateSnapshotInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  /** to filter out products that don't have inventory */
  has_inventory?: InputMaybe<Scalars['Boolean']>;
  /**
   * If True, the snapshot structure will be organized by customer account id, rather than by
   * SKU alone, adding support for different customer accounts having repeated SKUs.
   *
   */
  new_format?: InputMaybe<Scalars['Boolean']>;
  notification_email?: InputMaybe<Scalars['String']>;
  post_url?: InputMaybe<Scalars['String']>;
  /**
   * If false, a pre-check on the POST URL will not be performed.
   * This eliminates immediate validation and feedback in the mutation response, before sending the request to the worker.
   * Nonetheless, disabling this check can be useful if a one-time token is used to authenticate the endpoint.
   *
   */
  post_url_pre_check?: InputMaybe<Scalars['Boolean']>;
  /** to filter out products updated since that time */
  updated_from?: InputMaybe<Scalars['ISODateTime']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type InventorySnapshot = {
  __typename?: 'InventorySnapshot';
  created_at?: Maybe<Scalars['ISODateTime']>;
  customer_account_id?: Maybe<Scalars['String']>;
  email_error?: Maybe<Scalars['String']>;
  enqueued_at?: Maybe<Scalars['ISODateTime']>;
  error?: Maybe<Scalars['String']>;
  job_account_id?: Maybe<Scalars['String']>;
  job_user_id?: Maybe<Scalars['String']>;
  new_format?: Maybe<Scalars['Boolean']>;
  notification_email?: Maybe<Scalars['String']>;
  post_error?: Maybe<Scalars['String']>;
  post_url?: Maybe<Scalars['String']>;
  post_url_pre_check?: Maybe<Scalars['Boolean']>;
  snapshot_expiration?: Maybe<Scalars['ISODateTime']>;
  snapshot_id?: Maybe<Scalars['String']>;
  snapshot_url?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type InventorySnapshotConnection = {
  __typename?: 'InventorySnapshotConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InventorySnapshotEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `InventorySnapshot` and its cursor. */
export type InventorySnapshotEdge = {
  __typename?: 'InventorySnapshotEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<InventorySnapshot>;
};

export type InventorySnapshotOutput = {
  __typename?: 'InventorySnapshotOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  snapshot?: Maybe<InventorySnapshot>;
};

export type InventorySnapshotQueryResult = {
  __typename?: 'InventorySnapshotQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  snapshot?: Maybe<InventorySnapshot>;
};

export type InventorySnapshotsQueryResult = {
  __typename?: 'InventorySnapshotsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  snapshots?: Maybe<InventorySnapshotConnection>;
};


export type InventorySnapshotsQueryResultSnapshotsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type InventorySyncBatchQueryResult = {
  __typename?: 'InventorySyncBatchQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<InventorySyncStatus>;
  request_id?: Maybe<Scalars['String']>;
};

export type InventorySyncBatchesQueryResult = {
  __typename?: 'InventorySyncBatchesQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<InventorySyncStatusConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type InventorySyncBatchesQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type InventorySyncInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type InventorySyncItemStatus = {
  __typename?: 'InventorySyncItemStatus';
  action?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  error?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  reason?: Maybe<Scalars['String']>;
  row?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
};

export type InventorySyncItemStatusConnection = {
  __typename?: 'InventorySyncItemStatusConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InventorySyncItemStatusEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `InventorySyncItemStatus` and its cursor. */
export type InventorySyncItemStatusEdge = {
  __typename?: 'InventorySyncItemStatusEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<InventorySyncItemStatus>;
};

export type InventorySyncOutput = {
  __typename?: 'InventorySyncOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  sync_id?: Maybe<Scalars['String']>;
};

export type InventorySyncRowsQueryResult = {
  __typename?: 'InventorySyncRowsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<InventorySyncItemStatusConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type InventorySyncRowsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type InventorySyncStatus = {
  __typename?: 'InventorySyncStatus';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  customer_account_id?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  error_count?: Maybe<Scalars['Int']>;
  finished_count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  success_count?: Maybe<Scalars['Int']>;
  total_count?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  url?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type InventorySyncStatusConnection = {
  __typename?: 'InventorySyncStatusConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InventorySyncStatusEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `InventorySyncStatus` and its cursor. */
export type InventorySyncStatusEdge = {
  __typename?: 'InventorySyncStatusEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<InventorySyncStatus>;
};

export type ItemLocation = {
  __typename?: 'ItemLocation';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  expiration_lot?: Maybe<Lot>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  location?: Maybe<Location>;
  location_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type ItemLocationConnection = {
  __typename?: 'ItemLocationConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ItemLocationEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ItemLocation` and its cursor. */
export type ItemLocationEdge = {
  __typename?: 'ItemLocationEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ItemLocation>;
};

export type KitComponent = {
  __typename?: 'KitComponent';
  account_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  /** Amount of product units within the kit */
  quantity?: Maybe<Scalars['Int']>;
  /** Stock Keeping Unit */
  sku?: Maybe<Scalars['String']>;
};

export type LabelResource = {
  __typename?: 'LabelResource';
  image_location?: Maybe<Scalars['String']>;
  paper_pdf_location?: Maybe<Scalars['String']>;
  pdf_location?: Maybe<Scalars['String']>;
  thermal_pdf_location?: Maybe<Scalars['String']>;
};

export type LegacyId = {
  __typename?: 'LegacyId';
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
};

export type LegacyIdQueryResult = {
  __typename?: 'LegacyIdQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<LegacyId>;
  request_id?: Maybe<Scalars['String']>;
};

export type LineItem = {
  __typename?: 'LineItem';
  backorder_quantity?: Maybe<Scalars['Int']>;
  barcode?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  custom_barcode?: Maybe<Scalars['String']>;
  custom_options?: Maybe<Scalars['GenericScalar']>;
  customs_value?: Maybe<Scalars['String']>;
  eligible_for_return?: Maybe<Scalars['Boolean']>;
  fulfillment_status?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  /** This field was deprecated on accounts with Multi Warehouse Allocation rules */
  locked_to_warehouse_id?: Maybe<Scalars['String']>;
  option_title?: Maybe<Scalars['String']>;
  order_id?: Maybe<Scalars['String']>;
  partner_line_item_id?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  /** @deprecated Products should be referenced by sku */
  product_id?: Maybe<Scalars['String']>;
  product_name?: Maybe<Scalars['String']>;
  promotion_discount?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  quantity_allocated?: Maybe<Scalars['Int']>;
  quantity_pending_fulfillment?: Maybe<Scalars['Int']>;
  quantity_shipped?: Maybe<Scalars['Int']>;
  serial_numbers?: Maybe<Array<Maybe<LineItemSerialNumber>>>;
  shipped_line_item_lots?: Maybe<Array<Maybe<ShippedLineItemLot>>>;
  sku?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['String']>;
  tote_picks?: Maybe<Array<Maybe<TotePick>>>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  warehouse?: Maybe<Scalars['String']>;
  /** @deprecated Use order allocations instead */
  warehouse_id?: Maybe<Scalars['String']>;
};

export type LineItemInput = {
  product_name: Scalars['String'];
  quantity: Scalars['Int'];
  sku: Scalars['String'];
};

export type LineItemQuerySpecConnection = {
  __typename?: 'LineItemQuerySpecConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LineItemQuerySpecEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  total_count?: Maybe<Scalars['Int']>;
};

/** A Relay edge containing a `LineItemQuerySpec` and its cursor. */
export type LineItemQuerySpecEdge = {
  __typename?: 'LineItemQuerySpecEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<LineItem>;
};

export type LineItemSerialNumber = {
  __typename?: 'LineItemSerialNumber';
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_item_id?: Maybe<Scalars['String']>;
  scanned?: Maybe<Scalars['Boolean']>;
  serial_number?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
};

export type Location = {
  __typename?: 'Location';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  dimensions?: Maybe<Dimensions>;
  expiration_lots?: Maybe<LotConnection>;
  /** @deprecated Not used anymore. Use dimensions */
  height?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  is_cart?: Maybe<Scalars['Boolean']>;
  last_counted?: Maybe<Scalars['ISODateTime']>;
  legacy_id?: Maybe<Scalars['Int']>;
  /** @deprecated Not used anymore. Use dimensions */
  length?: Maybe<Scalars['String']>;
  /** @deprecated Not used anymore. Use dimensions */
  max_weight?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pick_priority?: Maybe<Scalars['Int']>;
  pickable?: Maybe<Scalars['Boolean']>;
  sellable?: Maybe<Scalars['Boolean']>;
  temperature?: Maybe<Scalars['String']>;
  type?: Maybe<LocationType>;
  warehouse_id?: Maybe<Scalars['String']>;
  /** @deprecated Not used anymore. Use dimensions */
  width?: Maybe<Scalars['String']>;
  zone?: Maybe<Scalars['String']>;
};


export type LocationExpiration_LotsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type LocationConnection = {
  __typename?: 'LocationConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LocationEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Location` and its cursor. */
export type LocationEdge = {
  __typename?: 'LocationEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Location>;
};

export type LocationOutput = {
  __typename?: 'LocationOutput';
  complexity?: Maybe<Scalars['Int']>;
  location?: Maybe<Location>;
  request_id?: Maybe<Scalars['String']>;
};

export type LocationQueryResult = {
  __typename?: 'LocationQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Location>;
  request_id?: Maybe<Scalars['String']>;
};

export type LocationType = {
  __typename?: 'LocationType';
  account_id?: Maybe<Scalars['String']>;
  daily_storage_cost?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type LocationsQueryResult = {
  __typename?: 'LocationsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<LocationConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type LocationsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type Lot = {
  __typename?: 'Lot';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  expires_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  legacy_id?: Maybe<Scalars['Int']>;
  locations?: Maybe<LocationConnection>;
  name?: Maybe<Scalars['String']>;
  po_id?: Maybe<Scalars['String']>;
  received_at?: Maybe<Scalars['ISODateTime']>;
  sku?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
};


export type LotLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type LotConnection = {
  __typename?: 'LotConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LotEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Lot` and its cursor. */
export type LotEdge = {
  __typename?: 'LotEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Lot>;
};

export type LotsQueryResult = {
  __typename?: 'LotsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<LotConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type LotsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type MergedOrder = {
  __typename?: 'MergedOrder';
  /** Indicates if it's the master order */
  is_master?: Maybe<Scalars['Boolean']>;
  order_id?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  bill_create?: Maybe<CreateBillOutput>;
  bill_delete?: Maybe<MutationOutput>;
  bill_recalculate?: Maybe<RecalculateBillOutput>;
  bill_submit?: Maybe<MutationOutput>;
  bill_update?: Maybe<MutationOutput>;
  inventory_abort_snapshot?: Maybe<InventorySnapshotOutput>;
  inventory_add?: Maybe<UpdateInventoryOutput>;
  inventory_generate_snapshot?: Maybe<InventorySnapshotOutput>;
  inventory_remove?: Maybe<UpdateInventoryOutput>;
  inventory_replace?: Maybe<UpdateInventoryOutput>;
  inventory_subtract?: Maybe<UpdateInventoryOutput>;
  inventory_sync?: Maybe<InventorySyncOutput>;
  inventory_sync_abort?: Maybe<AbortInventorySyncOutput>;
  inventory_transfer?: Maybe<TransferInventoryOutput>;
  kit_build?: Maybe<ProductMutationOutput>;
  kit_clear?: Maybe<MutationOutput>;
  kit_remove_components?: Maybe<ProductMutationOutput>;
  location_create?: Maybe<LocationOutput>;
  location_update?: Maybe<LocationOutput>;
  lot_assign_to_location?: Maybe<AssignLotToLocationOutput>;
  lot_create?: Maybe<CreateLotOutput>;
  lot_delete?: Maybe<DeleteLotOutput>;
  lot_update?: Maybe<UpdateLotOutput>;
  lots_update?: Maybe<UpdateLotsOutput>;
  /** The ID of the object */
  node?: Maybe<Node>;
  order_add_history_entry?: Maybe<OrderMutationOutput>;
  order_add_line_items?: Maybe<OrderMutationOutput>;
  order_add_tags?: Maybe<OrderMutationOutput>;
  order_cancel?: Maybe<OrderMutationOutput>;
  order_change_warehouse?: Maybe<OrderMutationOutput>;
  order_clear_tags?: Maybe<OrderMutationOutput>;
  order_create?: Maybe<OrderMutationOutput>;
  order_fulfill?: Maybe<OrderShipmentMutationOutput>;
  order_remove_line_items?: Maybe<OrderMutationOutput>;
  order_update?: Maybe<OrderMutationOutput>;
  order_update_fulfillment_status?: Maybe<OrderMutationOutput>;
  order_update_holds?: Maybe<OrderMutationOutput>;
  order_update_line_items?: Maybe<OrderMutationOutput>;
  order_update_tags?: Maybe<OrderMutationOutput>;
  product_add_to_warehouse?: Maybe<WarehouseProductMutationOutput>;
  product_create?: Maybe<CreateProductOutput>;
  product_delete?: Maybe<MutationOutput>;
  product_update?: Maybe<ProductMutationOutput>;
  purchase_order_add_attachment?: Maybe<AddPurchaseOrderAttachmentOutput>;
  purchase_order_cancel?: Maybe<CancelPurchaseOrderOutput>;
  purchase_order_close?: Maybe<ClosePurchaseOrderOutput>;
  purchase_order_create?: Maybe<CreatePurchaseOrderOutput>;
  purchase_order_set_fulfillment_status?: Maybe<SetPurchaseOrderFulfillmentStatusOutput>;
  purchase_order_update?: Maybe<UpdatePurchaseOrderOutput>;
  return_create?: Maybe<CreateReturnOutput>;
  return_create_exchange?: Maybe<CreateReturnExchangeOutput>;
  return_update_status?: Maybe<UpdateReturnStatusOutput>;
  shipment_create?: Maybe<CreateShipmentOutput>;
  shipment_create_shipping_label?: Maybe<CreateShippingLabelOutput>;
  shipping_plan_create?: Maybe<CreateShippingPlanOutput>;
  vendor_add_product?: Maybe<MutationOutput>;
  vendor_create?: Maybe<CreateVendorOutput>;
  vendor_delete?: Maybe<MutationOutput>;
  vendor_remove_product?: Maybe<MutationOutput>;
  warehouse_product_delete?: Maybe<MutationOutput>;
  warehouse_product_update?: Maybe<WarehouseProductMutationOutput>;
  webhook_create?: Maybe<CreateWebhookOutput>;
  webhook_delete?: Maybe<MutationOutput>;
};


export type MutationBill_CreateArgs = {
  data: CreateBillInput;
};


export type MutationBill_DeleteArgs = {
  data: DeleteBillInput;
};


export type MutationBill_RecalculateArgs = {
  data: RecalculateBillInput;
};


export type MutationBill_SubmitArgs = {
  data: SubmitBillInput;
};


export type MutationBill_UpdateArgs = {
  data: UpdateBillInput;
};


export type MutationInventory_Abort_SnapshotArgs = {
  data: InventoryAbortSnapshotInput;
};


export type MutationInventory_AddArgs = {
  data: UpdateInventoryInput;
};


export type MutationInventory_Generate_SnapshotArgs = {
  data: InventoryGenerateSnapshotInput;
};


export type MutationInventory_RemoveArgs = {
  data: UpdateInventoryInput;
};


export type MutationInventory_ReplaceArgs = {
  data: ReplaceInventoryInput;
};


export type MutationInventory_SubtractArgs = {
  data: UpdateInventoryInput;
};


export type MutationInventory_SyncArgs = {
  data: InventorySyncInput;
};


export type MutationInventory_Sync_AbortArgs = {
  data: AbortInventorySyncInput;
};


export type MutationInventory_TransferArgs = {
  data: TransferInventoryInput;
};


export type MutationKit_BuildArgs = {
  data: BuildKitInput;
};


export type MutationKit_ClearArgs = {
  data: ClearKitInput;
};


export type MutationKit_Remove_ComponentsArgs = {
  data: RemoveKitComponentsInput;
};


export type MutationLocation_CreateArgs = {
  data: CreateLocationInput;
};


export type MutationLocation_UpdateArgs = {
  data: UpdateLocationInput;
};


export type MutationLot_Assign_To_LocationArgs = {
  data: AssignLotToLocationInput;
};


export type MutationLot_CreateArgs = {
  data: CreateLotInput;
};


export type MutationLot_DeleteArgs = {
  data: DeleteLotInput;
};


export type MutationLot_UpdateArgs = {
  data: UpdateLotInput;
};


export type MutationLots_UpdateArgs = {
  data: UpdateLotsInput;
};


export type MutationNodeArgs = {
  id: Scalars['ID'];
};


export type MutationOrder_Add_History_EntryArgs = {
  data: AddHistoryInput;
};


export type MutationOrder_Add_Line_ItemsArgs = {
  data: AddLineItemsInput;
};


export type MutationOrder_Add_TagsArgs = {
  data: UpdateTagsInput;
};


export type MutationOrder_CancelArgs = {
  data: CancelOrderInput;
};


export type MutationOrder_Change_WarehouseArgs = {
  data: ChangeOrderWarehouseInput;
};


export type MutationOrder_Clear_TagsArgs = {
  data: UpdateOrderInputBase;
};


export type MutationOrder_CreateArgs = {
  data: CreateOrderInput;
};


export type MutationOrder_FulfillArgs = {
  data: FulfillOrderInput;
};


export type MutationOrder_Remove_Line_ItemsArgs = {
  data: RemoveLineItemsInput;
};


export type MutationOrder_UpdateArgs = {
  data: UpdateOrderInput;
};


export type MutationOrder_Update_Fulfillment_StatusArgs = {
  data: UpdateOrderFulfillmentStatusInput;
};


export type MutationOrder_Update_HoldsArgs = {
  data: UpdateOrderHoldsInput;
};


export type MutationOrder_Update_Line_ItemsArgs = {
  data: UpdateLineItemsInput;
};


export type MutationOrder_Update_TagsArgs = {
  data: UpdateTagsInput;
};


export type MutationProduct_Add_To_WarehouseArgs = {
  data: AddProductToWarehouseInput;
};


export type MutationProduct_CreateArgs = {
  data: CreateProductInput;
};


export type MutationProduct_DeleteArgs = {
  data: DeleteProductInput;
};


export type MutationProduct_UpdateArgs = {
  data: UpdateProductInput;
};


export type MutationPurchase_Order_Add_AttachmentArgs = {
  data: AddPurchaseOrderAttachmentInput;
};


export type MutationPurchase_Order_CancelArgs = {
  data: CancelPurchaseOrderInput;
};


export type MutationPurchase_Order_CloseArgs = {
  data: ClosePurchaseOrderInput;
};


export type MutationPurchase_Order_CreateArgs = {
  data: CreatePurchaseOrderInput;
};


export type MutationPurchase_Order_Set_Fulfillment_StatusArgs = {
  data: SetPurchaseOrderFulfillmentStatusInput;
};


export type MutationPurchase_Order_UpdateArgs = {
  data: UpdatePurchaseOrderInput;
};


export type MutationReturn_CreateArgs = {
  data: CreateReturnInput;
};


export type MutationReturn_Create_ExchangeArgs = {
  data: CreateReturnExchangeInput;
};


export type MutationReturn_Update_StatusArgs = {
  data: UpdateReturnStatusInput;
};


export type MutationShipment_CreateArgs = {
  data: CreateShipmentInput;
};


export type MutationShipment_Create_Shipping_LabelArgs = {
  data: CreateShippingLabelInput;
};


export type MutationShipping_Plan_CreateArgs = {
  data: CreateShippingPlanInput;
};


export type MutationVendor_Add_ProductArgs = {
  data: AddProductToVendorInput;
};


export type MutationVendor_CreateArgs = {
  data: CreateVendorInput;
};


export type MutationVendor_DeleteArgs = {
  data: DeleteVendorInput;
};


export type MutationVendor_Remove_ProductArgs = {
  data: RemoveProductFromVendorInput;
};


export type MutationWarehouse_Product_DeleteArgs = {
  data: DeleteWarehouseProductInput;
};


export type MutationWarehouse_Product_UpdateArgs = {
  data: UpdateWarehouseProductInput;
};


export type MutationWebhook_CreateArgs = {
  data: CreateWebhookInput;
};


export type MutationWebhook_DeleteArgs = {
  data: DeleteWebhookInput;
};

export type MutationOutput = {
  __typename?: 'MutationOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  account_id?: Maybe<Scalars['String']>;
  address_is_business?: Maybe<Scalars['Boolean']>;
  adult_signature_required?: Maybe<Scalars['Boolean']>;
  alcohol?: Maybe<Scalars['Boolean']>;
  allocation_priority?: Maybe<Scalars['Int']>;
  allocations?: Maybe<Array<Maybe<OrderWarehouseAllocation>>>;
  allow_partial?: Maybe<Scalars['Boolean']>;
  allow_split?: Maybe<Scalars['Boolean']>;
  authorizations?: Maybe<Array<Maybe<Authorization>>>;
  auto_print_return_label?: Maybe<Scalars['Boolean']>;
  billing_address?: Maybe<OrderAddress>;
  box_name?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  custom_invoice_url?: Maybe<Scalars['String']>;
  dry_ice_weight_in_lbs?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  expected_weight_in_oz?: Maybe<Scalars['String']>;
  flagged?: Maybe<Scalars['Boolean']>;
  ftr_exemption?: Maybe<Scalars['Decimal']>;
  /** Status of the order (pending, fulfilled, cancelled, etc) */
  fulfillment_status?: Maybe<Scalars['String']>;
  gift_invoice?: Maybe<Scalars['Boolean']>;
  gift_note?: Maybe<Scalars['String']>;
  has_dry_ice?: Maybe<Scalars['Boolean']>;
  hold_until_date?: Maybe<Scalars['ISODateTime']>;
  holds?: Maybe<OrderHolds>;
  id?: Maybe<Scalars['String']>;
  ignore_address_validation_errors?: Maybe<Scalars['Boolean']>;
  incoterms?: Maybe<Scalars['String']>;
  insurance?: Maybe<Scalars['Boolean']>;
  insurance_amount?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_items?: Maybe<LineItemQuerySpecConnection>;
  merged_orders?: Maybe<Array<Maybe<MergedOrder>>>;
  order_date?: Maybe<Scalars['ISODateTime']>;
  order_history?: Maybe<Array<Maybe<OrderHistory>>>;
  /** The store's internal order number */
  order_number?: Maybe<Scalars['String']>;
  packing_note?: Maybe<Scalars['String']>;
  /** The order ID assigned by the storefront */
  partner_order_id?: Maybe<Scalars['String']>;
  priority_flag?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<Scalars['String']>;
  /** @deprecated This field is no longer being updated and should not be used or relied on */
  ready_to_ship?: Maybe<Scalars['Boolean']>;
  require_signature?: Maybe<Scalars['Boolean']>;
  required_ship_date?: Maybe<Scalars['ISODateTime']>;
  returns?: Maybe<Array<Maybe<Return>>>;
  rma_labels?: Maybe<Array<Maybe<RmaLabel>>>;
  saturday_delivery?: Maybe<Scalars['Boolean']>;
  shipments?: Maybe<Array<Maybe<Shipment>>>;
  shipping_address?: Maybe<OrderAddress>;
  shipping_lines?: Maybe<ShippingLines>;
  shop_name?: Maybe<Scalars['String']>;
  skip_address_validation?: Maybe<Scalars['Boolean']>;
  source?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  tax_id?: Maybe<Scalars['String']>;
  tax_type?: Maybe<Scalars['String']>;
  third_party_shipper?: Maybe<OrderThirdPartyShipper>;
  total_discounts?: Maybe<Scalars['String']>;
  total_price?: Maybe<Scalars['String']>;
  total_tax?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
};


export type OrderLine_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['GenericScalar']>;
  sort?: InputMaybe<Scalars['String']>;
};

/**
 * Order type for addresses. Orders have addresses with more details than the rest of the system
 * so we use our own types
 */
export type OrderAddress = {
  __typename?: 'OrderAddress';
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  state_code?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrderEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Order` and its cursor. */
export type OrderEdge = {
  __typename?: 'OrderEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Order>;
};

export type OrderHistory = {
  __typename?: 'OrderHistory';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  information?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  order?: Maybe<Order>;
  order_id?: Maybe<Scalars['String']>;
  order_number?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type OrderHistoryConnection = {
  __typename?: 'OrderHistoryConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrderHistoryEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `OrderHistory` and its cursor. */
export type OrderHistoryEdge = {
  __typename?: 'OrderHistoryEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<OrderHistory>;
};

export type OrderHistoryQueryResult = {
  __typename?: 'OrderHistoryQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<OrderHistoryConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type OrderHistoryQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type OrderHolds = {
  __typename?: 'OrderHolds';
  address_hold?: Maybe<Scalars['Boolean']>;
  client_hold?: Maybe<Scalars['Boolean']>;
  fraud_hold?: Maybe<Scalars['Boolean']>;
  operator_hold?: Maybe<Scalars['Boolean']>;
  payment_hold?: Maybe<Scalars['Boolean']>;
  shipping_method_hold?: Maybe<Scalars['Boolean']>;
};

export type OrderLineItemAllocation = {
  __typename?: 'OrderLineItemAllocation';
  allocated_at?: Maybe<Scalars['ISODateTime']>;
  allocation_reference?: Maybe<Scalars['String']>;
  is_kit_component?: Maybe<Scalars['Boolean']>;
  line_item_id?: Maybe<Scalars['String']>;
  order_id?: Maybe<Scalars['String']>;
  quantity_allocated?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type OrderMutationOutput = {
  __typename?: 'OrderMutationOutput';
  complexity?: Maybe<Scalars['Int']>;
  order?: Maybe<Order>;
  request_id?: Maybe<Scalars['String']>;
};

export type OrderNoteAttributeInput = {
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type OrderQueryResult = {
  __typename?: 'OrderQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Order>;
  request_id?: Maybe<Scalars['String']>;
};

export type OrderShipmentMutationOutput = {
  __typename?: 'OrderShipmentMutationOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  shipment?: Maybe<Shipment>;
};

export type OrderThirdPartyShipper = {
  __typename?: 'OrderThirdPartyShipper';
  account_number?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  zip?: Maybe<Scalars['String']>;
};

export type OrderWarehouseAllocation = {
  __typename?: 'OrderWarehouseAllocation';
  allocated_at?: Maybe<Scalars['ISODateTime']>;
  allocation_reference?: Maybe<Scalars['String']>;
  line_items?: Maybe<Array<Maybe<OrderLineItemAllocation>>>;
  order_id?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type OrdersQueryResult = {
  __typename?: 'OrdersQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<OrderConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type OrdersQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type Package = {
  __typename?: 'Package';
  /** The nuber of barcodes scanned in the package */
  barcodes_scanned?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  order?: Maybe<Order>;
  order_id?: Maybe<Scalars['String']>;
  order_number?: Maybe<Scalars['String']>;
  shipment?: Maybe<Shipment>;
  shipment_id?: Maybe<Scalars['String']>;
  /** The sum of every shipped item's quantity in the package */
  total_items?: Maybe<Scalars['Int']>;
  /** The number of unique shipped items in the package */
  unique_items?: Maybe<Scalars['Int']>;
  user_first_name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  user_last_name?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type PackageConnection = {
  __typename?: 'PackageConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PackageEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Package` and its cursor. */
export type PackageEdge = {
  __typename?: 'PackageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Package>;
};

export type PackageInput = {
  line_items: Array<InputMaybe<PackageLineItemInput>>;
};

export type PackageLineItemInput = {
  quantity: Scalars['Int'];
  sku: Scalars['String'];
};

export type PacksPerDayQueryResult = {
  __typename?: 'PacksPerDayQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<PackageConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type PacksPerDayQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PalletData = {
  floor_loaded?: InputMaybe<Scalars['Boolean']>;
  /** One of 'ftl', 'ltl', 'container' */
  kind?: InputMaybe<Scalars['String']>;
  /** One of '4x6', 'letter' */
  page_size?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Int'];
};

export type Pick = {
  __typename?: 'Pick';
  barcode_scanned?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  inventory_bin?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_item?: Maybe<LineItem>;
  line_item_id?: Maybe<Scalars['String']>;
  location_id?: Maybe<Scalars['String']>;
  order?: Maybe<Order>;
  order_id?: Maybe<Scalars['String']>;
  order_number?: Maybe<Scalars['String']>;
  pending_shipment_line_item_id?: Maybe<Scalars['String']>;
  pick_type?: Maybe<Scalars['String']>;
  /** The number that was picked */
  picked_quantity?: Maybe<Scalars['Int']>;
  /** The number required */
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  tote_id?: Maybe<Scalars['String']>;
  user_first_name?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
  user_last_name?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type PickConnection = {
  __typename?: 'PickConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PickEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Pick` and its cursor. */
export type PickEdge = {
  __typename?: 'PickEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Pick>;
};

export type PicksPerDayQueryResult = {
  __typename?: 'PicksPerDayQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<PickConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type PicksPerDayQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'Product';
  account_id?: Maybe<Scalars['String']>;
  /** @deprecated This is a warehouse specific field */
  active?: Maybe<Scalars['Boolean']>;
  barcode?: Maybe<Scalars['String']>;
  cases?: Maybe<Array<Maybe<Case>>>;
  /**
   * For kits, this will be the list of products that make up the kit
   * @deprecated This has been replaced by kit_components
   */
  components?: Maybe<Array<Maybe<Product>>>;
  country_of_manufacture?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  customs_description?: Maybe<Scalars['String']>;
  customs_value?: Maybe<Scalars['String']>;
  dimensions?: Maybe<Dimensions>;
  dropship?: Maybe<Scalars['Boolean']>;
  /** Inventory available at FBA */
  fba_inventory?: Maybe<Array<Maybe<FbaInventory>>>;
  final_sale?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  ignore_on_customs?: Maybe<Scalars['Boolean']>;
  ignore_on_invoice?: Maybe<Scalars['Boolean']>;
  images?: Maybe<Array<Maybe<ProductImage>>>;
  kit?: Maybe<Scalars['Boolean']>;
  kit_build?: Maybe<Scalars['Boolean']>;
  /** For kits, this will be the list of references to the products that make up the kit and their quantities */
  kit_components?: Maybe<Array<Maybe<KitComponent>>>;
  large_thumbnail?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  /** Name of the product */
  name?: Maybe<Scalars['String']>;
  needs_lot_tracking?: Maybe<Scalars['Boolean']>;
  needs_serial_number?: Maybe<Scalars['Boolean']>;
  no_air?: Maybe<Scalars['Boolean']>;
  not_owned?: Maybe<Scalars['Boolean']>;
  packer_note?: Maybe<Scalars['String']>;
  /**
   * Price of the product
   * @deprecated This is a warehouse specific field
   */
  price?: Maybe<Scalars['String']>;
  product_note?: Maybe<Scalars['String']>;
  /** Stock Keeping Unit */
  sku?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  tariff_code?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  /**
   * Price paid for the product
   * @deprecated This is a warehouse specific field
   */
  value?: Maybe<Scalars['String']>;
  /** @deprecated This is a warehouse specific field */
  value_currency?: Maybe<Scalars['String']>;
  vendors?: Maybe<Array<Maybe<ProductVendor>>>;
  virtual?: Maybe<Scalars['Boolean']>;
  /** The physical instances of the product, stored in warehouses */
  warehouse_products?: Maybe<Array<Maybe<WarehouseProduct>>>;
};

export type ProductConnection = {
  __typename?: 'ProductConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ProductEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Product` and its cursor. */
export type ProductEdge = {
  __typename?: 'ProductEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Product>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  /** The order in which the image should appear */
  position?: Maybe<Scalars['Int']>;
  /** The url where the image is hosted */
  src?: Maybe<Scalars['String']>;
};

export type ProductMutationOutput = {
  __typename?: 'ProductMutationOutput';
  complexity?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
  request_id?: Maybe<Scalars['String']>;
};

export type ProductQueryResult = {
  __typename?: 'ProductQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Product>;
  request_id?: Maybe<Scalars['String']>;
};

export type ProductVendor = {
  __typename?: 'ProductVendor';
  price?: Maybe<Scalars['String']>;
  vendor_id?: Maybe<Scalars['String']>;
  vendor_sku?: Maybe<Scalars['String']>;
};

export type ProductsQueryResult = {
  __typename?: 'ProductsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<ProductConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type ProductsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  account_id?: Maybe<Scalars['String']>;
  arrived_at?: Maybe<Scalars['ISODateTime']>;
  attachments?: Maybe<PurchaseOrderAttachmentConnection>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  date_closed?: Maybe<Scalars['ISODateTime']>;
  description?: Maybe<Scalars['String']>;
  discount?: Maybe<Scalars['String']>;
  fulfillment_status?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  images?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_items?: Maybe<PurchaseOrderLineItemConnection>;
  locked_by_user_id?: Maybe<Scalars['String']>;
  locking?: Maybe<Scalars['String']>;
  origin_of_shipment?: Maybe<Scalars['String']>;
  packing_note?: Maybe<Scalars['String']>;
  partner_order_number?: Maybe<Scalars['String']>;
  payment_due_by?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  payment_note?: Maybe<Scalars['String']>;
  pdf?: Maybe<Scalars['String']>;
  /** The expected date to arrive at the warehouse. */
  po_date?: Maybe<Scalars['ISODateTime']>;
  po_note?: Maybe<Scalars['String']>;
  po_number?: Maybe<Scalars['String']>;
  ship_date?: Maybe<Scalars['DateTime']>;
  shipping_carrier?: Maybe<Scalars['String']>;
  shipping_method?: Maybe<Scalars['String']>;
  shipping_name?: Maybe<Scalars['String']>;
  shipping_price?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['String']>;
  total_price?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
  tracking_numbers?: Maybe<PurchaseOrderTrackingNumberConnection>;
  vendor?: Maybe<Vendor>;
  vendor_id?: Maybe<Scalars['String']>;
  warehouse?: Maybe<Warehouse>;
  warehouse_id?: Maybe<Scalars['String']>;
};


export type PurchaseOrderAttachmentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type PurchaseOrderLine_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type PurchaseOrderTracking_NumbersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type PurchaseOrderAttachment = {
  __typename?: 'PurchaseOrderAttachment';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  description?: Maybe<Scalars['String']>;
  file_size?: Maybe<Scalars['Int']>;
  file_type?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  po_li_sku?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

export type PurchaseOrderAttachmentConnection = {
  __typename?: 'PurchaseOrderAttachmentConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PurchaseOrderAttachmentEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PurchaseOrderAttachment` and its cursor. */
export type PurchaseOrderAttachmentEdge = {
  __typename?: 'PurchaseOrderAttachmentEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PurchaseOrderAttachment>;
};

export type PurchaseOrderConnection = {
  __typename?: 'PurchaseOrderConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PurchaseOrderEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PurchaseOrder` and its cursor. */
export type PurchaseOrderEdge = {
  __typename?: 'PurchaseOrderEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PurchaseOrder>;
};

export type PurchaseOrderLineItem = {
  __typename?: 'PurchaseOrderLineItem';
  account_id?: Maybe<Scalars['String']>;
  barcode?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  expected_weight_in_lbs?: Maybe<Scalars['String']>;
  expiration_lots?: Maybe<LotConnection>;
  fulfillment_status?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  note?: Maybe<Scalars['String']>;
  option_title?: Maybe<Scalars['String']>;
  partner_line_item_id?: Maybe<Scalars['String']>;
  po_id?: Maybe<Scalars['String']>;
  po_number?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  product?: Maybe<WarehouseProduct>;
  product_id?: Maybe<Scalars['String']>;
  product_name?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  quantity_received?: Maybe<Scalars['Int']>;
  quantity_rejected?: Maybe<Scalars['Int']>;
  sell_ahead?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  variant_id?: Maybe<Scalars['Int']>;
  vendor?: Maybe<Vendor>;
  vendor_id?: Maybe<Scalars['String']>;
  vendor_sku?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};


export type PurchaseOrderLineItemExpiration_LotsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type PurchaseOrderLineItemConnection = {
  __typename?: 'PurchaseOrderLineItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PurchaseOrderLineItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PurchaseOrderLineItem` and its cursor. */
export type PurchaseOrderLineItemEdge = {
  __typename?: 'PurchaseOrderLineItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PurchaseOrderLineItem>;
};

export type PurchaseOrderQueryResult = {
  __typename?: 'PurchaseOrderQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<PurchaseOrder>;
  request_id?: Maybe<Scalars['String']>;
};

export type PurchaseOrderTrackingNumber = {
  __typename?: 'PurchaseOrderTrackingNumber';
  carrier_id?: Maybe<Scalars['String']>;
  carrier_value?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  po_id?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
};

export type PurchaseOrderTrackingNumberConnection = {
  __typename?: 'PurchaseOrderTrackingNumberConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PurchaseOrderTrackingNumberEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `PurchaseOrderTrackingNumber` and its cursor. */
export type PurchaseOrderTrackingNumberEdge = {
  __typename?: 'PurchaseOrderTrackingNumberEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PurchaseOrderTrackingNumber>;
};

export type PurchaseOrdersQueryResult = {
  __typename?: 'PurchaseOrdersQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<PurchaseOrderConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type PurchaseOrdersQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  account?: Maybe<AccountQueryResult>;
  bill?: Maybe<BillQueryResult>;
  bills?: Maybe<BillsQueryResult>;
  expiration_lots?: Maybe<LotsQueryResult>;
  fulfillment_invoice?: Maybe<FulfillmentInvoiceQueryResult>;
  fulfillment_invoices?: Maybe<FulfillmentInvoicesQueryResult>;
  inventory_changes?: Maybe<InventoryChangesQueryResult>;
  inventory_snapshot?: Maybe<InventorySnapshotQueryResult>;
  inventory_snapshots?: Maybe<InventorySnapshotsQueryResult>;
  inventory_sync_items_status?: Maybe<InventorySyncRowsQueryResult>;
  inventory_sync_status?: Maybe<InventorySyncBatchQueryResult>;
  inventory_sync_statuses?: Maybe<InventorySyncBatchesQueryResult>;
  location?: Maybe<LocationQueryResult>;
  locations?: Maybe<LocationsQueryResult>;
  me?: Maybe<CurrentUserQueryResult>;
  /** The ID of the object */
  node?: Maybe<Node>;
  order?: Maybe<OrderQueryResult>;
  order_history?: Maybe<OrderHistoryQueryResult>;
  orders?: Maybe<OrdersQueryResult>;
  /** Gets the detail of each shipment's package between the specified dates.Results are sorted by date, warehouse and user, but they can be filteredby warehouse_id if only interested in the packages from a particular warehouse.The sorting can be overriden by specifying any other field or list of fields from the output type. */
  packs_per_day?: Maybe<PacksPerDayQueryResult>;
  /** Gets the detail of each line item picked between the specified dates.Results are sorted by date, warehouse and user, but they can be filteredby warehouse_id if only interested in the picks from a particular warehouse.The sorting can be overriden by specifying any other field or list of fields from the output type. */
  picks_per_day?: Maybe<PicksPerDayQueryResult>;
  product?: Maybe<ProductQueryResult>;
  products?: Maybe<ProductsQueryResult>;
  purchase_order?: Maybe<PurchaseOrderQueryResult>;
  purchase_orders?: Maybe<PurchaseOrdersQueryResult>;
  return?: Maybe<ReturnQueryResult>;
  return_exchange?: Maybe<ReturnExchangeQueryResult>;
  returns?: Maybe<ReturnsQueryResult>;
  shipment?: Maybe<ShipmentQueryResult>;
  shipments?: Maybe<ShipmentsQueryResult>;
  shipping_plan?: Maybe<ShippingPlanQueryResult>;
  tote?: Maybe<ToteContentQueryResult>;
  tote_history?: Maybe<ToteHistoryQueryResult>;
  user_quota?: Maybe<UserQuota>;
  /** When using the old webhooks you might receive resource ids as numeric ids.If you need any of those ids in one of our new queries or mutations, you can usethis query to retrieve the uuid corresponding to that resource/entity numeric id */
  uuid?: Maybe<LegacyIdQueryResult>;
  vendors?: Maybe<VendorsQueryResult>;
  warehouse_products?: Maybe<WarehouseProductsQueryResult>;
  webhooks?: Maybe<WebhooksQueryResult>;
};


export type QueryAccountArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
};


export type QueryBillArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type QueryBillsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  from_date?: InputMaybe<Scalars['ISODateTime']>;
  status?: InputMaybe<Scalars['String']>;
  to_date?: InputMaybe<Scalars['ISODateTime']>;
};


export type QueryExpiration_LotsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  po_id?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
};


export type QueryFulfillment_InvoiceArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
};


export type QueryFulfillment_InvoicesArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
};


export type QueryInventory_ChangesArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
  location_id?: InputMaybe<Scalars['String']>;
  location_name?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryInventory_SnapshotArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  snapshot_id: Scalars['String'];
};


export type QueryInventory_SnapshotsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryInventory_Sync_Items_StatusArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  status?: InputMaybe<Scalars['String']>;
};


export type QueryInventory_Sync_StatusArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
};


export type QueryInventory_Sync_StatusesArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryLocationArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryLocationsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  sku?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryMeArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryOrderArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type QueryOrder_HistoryArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  date_from?: InputMaybe<Scalars['Date']>;
  date_to?: InputMaybe<Scalars['Date']>;
  order_id?: InputMaybe<Scalars['String']>;
  order_number?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};


export type QueryOrdersArgs = {
  address_hold?: InputMaybe<Scalars['Boolean']>;
  allocated_warehouse_id?: InputMaybe<Scalars['String']>;
  analyze?: InputMaybe<Scalars['Boolean']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  fraud_hold?: InputMaybe<Scalars['Boolean']>;
  fulfillment_status?: InputMaybe<Scalars['String']>;
  operator_hold?: InputMaybe<Scalars['Boolean']>;
  order_date_from?: InputMaybe<Scalars['ISODateTime']>;
  order_date_to?: InputMaybe<Scalars['ISODateTime']>;
  order_number?: InputMaybe<Scalars['String']>;
  partner_order_id?: InputMaybe<Scalars['String']>;
  payment_hold?: InputMaybe<Scalars['Boolean']>;
  shop_name?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  updated_from?: InputMaybe<Scalars['ISODateTime']>;
  updated_to?: InputMaybe<Scalars['ISODateTime']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryPacks_Per_DayArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
  order_id?: InputMaybe<Scalars['String']>;
  order_number?: InputMaybe<Scalars['String']>;
  user_id?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryPicks_Per_DayArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryProductArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
};


export type QueryProductsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  created_from?: InputMaybe<Scalars['ISODateTime']>;
  created_to?: InputMaybe<Scalars['ISODateTime']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  has_kits?: InputMaybe<Scalars['Boolean']>;
  sku?: InputMaybe<Scalars['String']>;
  updated_from?: InputMaybe<Scalars['ISODateTime']>;
  updated_to?: InputMaybe<Scalars['ISODateTime']>;
};


export type QueryPurchase_OrderArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
  po_number?: InputMaybe<Scalars['String']>;
};


export type QueryPurchase_OrdersArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  created_from?: InputMaybe<Scalars['ISODateTime']>;
  created_to?: InputMaybe<Scalars['ISODateTime']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  date_closed_from?: InputMaybe<Scalars['ISODateTime']>;
  date_closed_to?: InputMaybe<Scalars['ISODateTime']>;
  po_date_from?: InputMaybe<Scalars['ISODateTime']>;
  po_date_to?: InputMaybe<Scalars['ISODateTime']>;
  sku?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryReturnArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type QueryReturn_ExchangeArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
};


export type QueryReturnsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
  order_id?: InputMaybe<Scalars['String']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryShipmentArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
};


export type QueryShipmentsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
  order_date_from?: InputMaybe<Scalars['ISODateTime']>;
  order_date_to?: InputMaybe<Scalars['ISODateTime']>;
  order_id?: InputMaybe<Scalars['String']>;
  tracking_number?: InputMaybe<Scalars['String']>;
};


export type QueryShipping_PlanArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['String']>;
};


export type QueryToteArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  barcode: Scalars['String'];
};


export type QueryTote_HistoryArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  date_from?: InputMaybe<Scalars['ISODateTime']>;
  date_to?: InputMaybe<Scalars['ISODateTime']>;
  tote_id?: InputMaybe<Scalars['String']>;
  tote_name?: InputMaybe<Scalars['String']>;
};


export type QueryUuidArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  entity: EntityType;
  legacy_id: Scalars['Int'];
};


export type QueryVendorsArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
};


export type QueryWarehouse_ProductsArgs = {
  active?: InputMaybe<Scalars['Boolean']>;
  analyze?: InputMaybe<Scalars['Boolean']>;
  created_from?: InputMaybe<Scalars['ISODateTime']>;
  created_to?: InputMaybe<Scalars['ISODateTime']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
  updated_from?: InputMaybe<Scalars['ISODateTime']>;
  updated_to?: InputMaybe<Scalars['ISODateTime']>;
  warehouse_id?: InputMaybe<Scalars['String']>;
};


export type QueryWebhooksArgs = {
  analyze?: InputMaybe<Scalars['Boolean']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
};

export type RmaLabel = {
  __typename?: 'RMALabel';
  account_id?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  box_code?: Maybe<Scalars['String']>;
  carrier?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  delivered?: Maybe<Scalars['Boolean']>;
  dimensions?: Maybe<Dimensions>;
  full_size_to_print?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image_location?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  needs_refund?: Maybe<Scalars['Boolean']>;
  order_id?: Maybe<Scalars['String']>;
  paper_pdf_location?: Maybe<Scalars['String']>;
  partner_fulfillment_id?: Maybe<Scalars['String']>;
  pdf_location?: Maybe<Scalars['String']>;
  picked_up?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<Scalars['String']>;
  refunded?: Maybe<Scalars['Boolean']>;
  rma_id?: Maybe<Scalars['String']>;
  shipment_id?: Maybe<Scalars['String']>;
  shipping_method?: Maybe<Scalars['String']>;
  shipping_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  thermal_pdf_location?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
};

export type RmaLabelType = {
  __typename?: 'RMALabelType';
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address_city?: Maybe<Scalars['String']>;
  address_country?: Maybe<Scalars['String']>;
  address_state?: Maybe<Scalars['String']>;
  address_zip?: Maybe<Scalars['String']>;
  carrier?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['ISODateTime']>;
  dimensions?: Maybe<Dimensions>;
  /** @deprecated Use dimensions instead */
  height?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  /** @deprecated Use dimensions instead */
  length?: Maybe<Scalars['Float']>;
  pdf_location?: Maybe<Scalars['String']>;
  shipping_method?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  to_name?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
  /** @deprecated Use dimensions instead */
  weight?: Maybe<Scalars['Float']>;
  /** @deprecated Use dimensions instead */
  width?: Maybe<Scalars['Float']>;
};

export type RecalculateBillInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};

export type RecalculateBillOutput = {
  __typename?: 'RecalculateBillOutput';
  bill?: Maybe<Bill>;
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
};

export type RemoveKitComponentInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
};

export type RemoveKitComponentsInput = {
  components: Array<InputMaybe<RemoveKitComponentInput>>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
};

export type RemoveLineItemsInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  line_item_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
};

export type RemoveProductFromVendorInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  vendor_id: Scalars['String'];
};

export type ReplaceInventoryInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  includes_non_sellable?: InputMaybe<Scalars['Boolean']>;
  location_id?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Int'];
  reason?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type Return = {
  __typename?: 'Return';
  account_id?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  cost_to_customer?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  dimensions?: Maybe<Dimensions>;
  display_issue_refund?: Maybe<Scalars['Boolean']>;
  exchanges?: Maybe<Array<Maybe<ReturnExchange>>>;
  id?: Maybe<Scalars['String']>;
  label_cost?: Maybe<Scalars['String']>;
  label_type?: Maybe<ReturnLabelType>;
  labels?: Maybe<Array<Maybe<RmaLabelType>>>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_items?: Maybe<Array<Maybe<ReturnLineItem>>>;
  order?: Maybe<Order>;
  order_id?: Maybe<Scalars['String']>;
  partner_id?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  shipping_carrier?: Maybe<Scalars['String']>;
  shipping_method?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  total_items_expected?: Maybe<Scalars['Int']>;
  total_items_received?: Maybe<Scalars['Int']>;
  total_items_restocked?: Maybe<Scalars['Int']>;
};

export type ReturnConnection = {
  __typename?: 'ReturnConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ReturnEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Return` and its cursor. */
export type ReturnEdge = {
  __typename?: 'ReturnEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Return>;
};

export type ReturnExchange = {
  __typename?: 'ReturnExchange';
  account_id?: Maybe<Scalars['String']>;
  exchange_items?: Maybe<Array<Maybe<ReturnExchangeItem>>>;
  exchange_order?: Maybe<Order>;
  exchange_order_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  original_return?: Maybe<Return>;
  return_id?: Maybe<Scalars['String']>;
};

export type ReturnExchangeItem = {
  __typename?: 'ReturnExchangeItem';
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  return_item_id?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
};

export type ReturnExchangeQueryResult = {
  __typename?: 'ReturnExchangeQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<ReturnExchange>;
  request_id?: Maybe<Scalars['String']>;
};

export enum ReturnLabelType {
  FlatRate = 'FLAT_RATE',
  Free = 'FREE',
  Paid = 'PAID',
  SelfReturn = 'SELF_RETURN'
}

export type ReturnLineItem = {
  __typename?: 'ReturnLineItem';
  account_id?: Maybe<Scalars['String']>;
  condition?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  is_component?: Maybe<Scalars['Boolean']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_item?: Maybe<LineItem>;
  line_item_id?: Maybe<Scalars['String']>;
  product_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  quantity_received?: Maybe<Scalars['Int']>;
  reason?: Maybe<Scalars['String']>;
  restock?: Maybe<Scalars['Int']>;
  return_id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  warehouse?: Maybe<Warehouse>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type ReturnQueryResult = {
  __typename?: 'ReturnQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Return>;
  request_id?: Maybe<Scalars['String']>;
};

export type ReturnsQueryResult = {
  __typename?: 'ReturnsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<ReturnConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type ReturnsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type SetPurchaseOrderFulfillmentStatusInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  po_id: Scalars['String'];
  status: Scalars['String'];
};

export type SetPurchaseOrderFulfillmentStatusOutput = {
  __typename?: 'SetPurchaseOrderFulfillmentStatusOutput';
  complexity?: Maybe<Scalars['Int']>;
  purchase_order?: Maybe<PurchaseOrder>;
  request_id?: Maybe<Scalars['String']>;
};

export type Shipment = {
  __typename?: 'Shipment';
  address?: Maybe<Address>;
  /** This field indicates if store was notified about the shipment. It should be 'true' by default and 'false' when using the Bulk Ship UI. */
  completed?: Maybe<Scalars['Boolean']>;
  created_date?: Maybe<Scalars['ISODateTime']>;
  delivered?: Maybe<Scalars['Boolean']>;
  dropshipment?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_items?: Maybe<ShipmentLineItemConnection>;
  needs_refund?: Maybe<Scalars['Boolean']>;
  order?: Maybe<Order>;
  order_id?: Maybe<Scalars['String']>;
  pending_shipment_id?: Maybe<Scalars['String']>;
  picked_up?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<Scalars['String']>;
  refunded?: Maybe<Scalars['Boolean']>;
  shipped_off_shiphero?: Maybe<Scalars['Boolean']>;
  shipping_labels?: Maybe<Array<Maybe<ShippingLabel>>>;
  total_packages?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['String']>;
  warehouse?: Maybe<Warehouse>;
  warehouse_id?: Maybe<Scalars['String']>;
};


export type ShipmentLine_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type ShipmentConnection = {
  __typename?: 'ShipmentConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShipmentEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Shipment` and its cursor. */
export type ShipmentEdge = {
  __typename?: 'ShipmentEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Shipment>;
};

export type ShipmentLineItem = {
  __typename?: 'ShipmentLineItem';
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_item?: Maybe<LineItem>;
  line_item_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  shipment_id?: Maybe<Scalars['String']>;
  shipping_label_id?: Maybe<Scalars['String']>;
};

export type ShipmentLineItemConnection = {
  __typename?: 'ShipmentLineItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShipmentLineItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ShipmentLineItem` and its cursor. */
export type ShipmentLineItemEdge = {
  __typename?: 'ShipmentLineItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ShipmentLineItem>;
};

export type ShipmentQueryResult = {
  __typename?: 'ShipmentQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Shipment>;
  request_id?: Maybe<Scalars['String']>;
};

export type ShipmentsQueryResult = {
  __typename?: 'ShipmentsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<ShipmentConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type ShipmentsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type ShippedLineItemInput = {
  quantity: Scalars['Int'];
  sku: Scalars['String'];
};

export type ShippedLineItemLot = {
  __typename?: 'ShippedLineItemLot';
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_item_id?: Maybe<Scalars['String']>;
  lot_expiration_date?: Maybe<Scalars['ISODateTime']>;
  lot_id?: Maybe<Scalars['String']>;
  lot_name?: Maybe<Scalars['String']>;
};

export type ShippedPackagesInput = {
  address: CreateOrderAddressInput;
  carrier: Scalars['String'];
  cost?: InputMaybe<Scalars['String']>;
  dimensions?: InputMaybe<DimensionsInput>;
  label_url?: InputMaybe<Scalars['String']>;
  line_items?: InputMaybe<Array<InputMaybe<ShippedLineItemInput>>>;
  method: Scalars['String'];
  tracking_number?: InputMaybe<Scalars['String']>;
  tracking_url?: InputMaybe<Scalars['String']>;
};

export type ShippingLabel = {
  __typename?: 'ShippingLabel';
  account_id?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  box_code?: Maybe<Scalars['String']>;
  box_id?: Maybe<Scalars['String']>;
  box_name?: Maybe<Scalars['String']>;
  carrier?: Maybe<Scalars['String']>;
  carrier_account_id?: Maybe<Scalars['String']>;
  cost?: Maybe<Scalars['String']>;
  created_date?: Maybe<Scalars['ISODateTime']>;
  delivered?: Maybe<Scalars['Boolean']>;
  device_id?: Maybe<Scalars['String']>;
  dimensions?: Maybe<Dimensions>;
  full_size_to_print?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  insurance_amount?: Maybe<Scalars['String']>;
  label?: Maybe<LabelResource>;
  legacy_id?: Maybe<Scalars['Int']>;
  needs_refund?: Maybe<Scalars['Boolean']>;
  order?: Maybe<Order>;
  order_account_id?: Maybe<Scalars['String']>;
  order_id?: Maybe<Scalars['String']>;
  order_number?: Maybe<Scalars['String']>;
  package_number?: Maybe<Scalars['Int']>;
  packing_slip?: Maybe<Scalars['String']>;
  parcelview_url?: Maybe<Scalars['String']>;
  partner_fulfillment_id?: Maybe<Scalars['String']>;
  picked_up?: Maybe<Scalars['Boolean']>;
  profile?: Maybe<Scalars['String']>;
  refunded?: Maybe<Scalars['Boolean']>;
  shipment_id?: Maybe<Scalars['String']>;
  shipment_line_items?: Maybe<ShipmentLineItemConnection>;
  shipping_method?: Maybe<Scalars['String']>;
  shipping_name?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
  tracking_url?: Maybe<Scalars['String']>;
  warehouse?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};


export type ShippingLabelShipment_Line_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type ShippingLines = {
  __typename?: 'ShippingLines';
  carrier?: Maybe<Scalars['String']>;
  method?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type ShippingPlan = {
  __typename?: 'ShippingPlan';
  account_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  fulfillment_status?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_items?: Maybe<ShippingPlanLineItemConnection>;
  origin_of_shipment?: Maybe<Scalars['String']>;
  packages?: Maybe<ShippingPlanPackageConnection>;
  pallets?: Maybe<ShippingPlanPalletConnection>;
  pdf_location?: Maybe<Scalars['String']>;
  shipping_carrier?: Maybe<Scalars['String']>;
  shipping_method?: Maybe<Scalars['String']>;
  shipping_name?: Maybe<Scalars['String']>;
  shipping_price?: Maybe<Scalars['String']>;
  subtotal?: Maybe<Scalars['String']>;
  total_price?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
  tracking_numbers?: Maybe<ShippingPlanTrackingNumberConnection>;
  vendor_po_number?: Maybe<Scalars['String']>;
  warehouse?: Maybe<Warehouse>;
  warehouse_id?: Maybe<Scalars['String']>;
  warehouse_note?: Maybe<Scalars['String']>;
};


export type ShippingPlanLine_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type ShippingPlanPackagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type ShippingPlanPalletsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};


export type ShippingPlanTracking_NumbersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type ShippingPlanLineItem = {
  __typename?: 'ShippingPlanLineItem';
  account_id?: Maybe<Scalars['String']>;
  barcode?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  expected_weight_in_lbs?: Maybe<Scalars['String']>;
  fulfillment_status?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  note?: Maybe<Scalars['String']>;
  option_title?: Maybe<Scalars['String']>;
  partner_line_item_id?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  product?: Maybe<WarehouseProduct>;
  product_id?: Maybe<Scalars['String']>;
  product_name?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  quantity_received?: Maybe<Scalars['Int']>;
  quantity_rejected?: Maybe<Scalars['Int']>;
  sell_ahead?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  variant_id?: Maybe<Scalars['Int']>;
  vendor_sku?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type ShippingPlanLineItemConnection = {
  __typename?: 'ShippingPlanLineItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShippingPlanLineItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ShippingPlanLineItem` and its cursor. */
export type ShippingPlanLineItemEdge = {
  __typename?: 'ShippingPlanLineItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ShippingPlanLineItem>;
};

export type ShippingPlanPackage = {
  __typename?: 'ShippingPlanPackage';
  box_number?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_items?: Maybe<ShippingPlanPackageLineItemConnection>;
};


export type ShippingPlanPackageLine_ItemsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type ShippingPlanPackageConnection = {
  __typename?: 'ShippingPlanPackageConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShippingPlanPackageEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ShippingPlanPackage` and its cursor. */
export type ShippingPlanPackageEdge = {
  __typename?: 'ShippingPlanPackageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ShippingPlanPackage>;
};

export type ShippingPlanPackageLineItem = {
  __typename?: 'ShippingPlanPackageLineItem';
  created_at?: Maybe<Scalars['ISODateTime']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
};

export type ShippingPlanPackageLineItemConnection = {
  __typename?: 'ShippingPlanPackageLineItemConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShippingPlanPackageLineItemEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ShippingPlanPackageLineItem` and its cursor. */
export type ShippingPlanPackageLineItemEdge = {
  __typename?: 'ShippingPlanPackageLineItemEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ShippingPlanPackageLineItem>;
};

export type ShippingPlanPallet = {
  __typename?: 'ShippingPlanPallet';
  floor_loaded?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  kind?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  page_size?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
};

export type ShippingPlanPalletConnection = {
  __typename?: 'ShippingPlanPalletConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShippingPlanPalletEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ShippingPlanPallet` and its cursor. */
export type ShippingPlanPalletEdge = {
  __typename?: 'ShippingPlanPalletEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ShippingPlanPallet>;
};

export type ShippingPlanQueryResult = {
  __typename?: 'ShippingPlanQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<ShippingPlan>;
  request_id?: Maybe<Scalars['String']>;
};

export type ShippingPlanTrackingNumber = {
  __typename?: 'ShippingPlanTrackingNumber';
  carrier_id?: Maybe<Scalars['String']>;
  carrier_value?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  po_id?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
};

export type ShippingPlanTrackingNumberConnection = {
  __typename?: 'ShippingPlanTrackingNumberConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ShippingPlanTrackingNumberEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ShippingPlanTrackingNumber` and its cursor. */
export type ShippingPlanTrackingNumberEdge = {
  __typename?: 'ShippingPlanTrackingNumberEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ShippingPlanTrackingNumber>;
};

export type SubmitBillInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
};

export type Tote = {
  __typename?: 'Tote';
  barcode?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  orders?: Maybe<Array<Maybe<Order>>>;
  picks?: Maybe<Array<Maybe<TotePick>>>;
  warehouse?: Maybe<Warehouse>;
};

export type ToteContentQueryResult = {
  __typename?: 'ToteContentQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<Tote>;
  request_id?: Maybe<Scalars['String']>;
};

export type ToteHistory = {
  __typename?: 'ToteHistory';
  action?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  tote_id?: Maybe<Scalars['String']>;
  tote_name?: Maybe<Scalars['String']>;
};

export type ToteHistoryConnection = {
  __typename?: 'ToteHistoryConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ToteHistoryEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `ToteHistory` and its cursor. */
export type ToteHistoryEdge = {
  __typename?: 'ToteHistoryEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ToteHistory>;
};

export type ToteHistoryQueryResult = {
  __typename?: 'ToteHistoryQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<ToteHistoryConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type ToteHistoryQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type TotePick = {
  __typename?: 'TotePick';
  created_at?: Maybe<Scalars['ISODateTime']>;
  current?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  inventory_bin?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  line_item?: Maybe<LineItem>;
  location?: Maybe<Location>;
  picked_quantity?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  tote_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
};

export type TransferInventoryInput = {
  customer_account_id?: InputMaybe<Scalars['String']>;
  location_from_id: Scalars['String'];
  location_to_id: Scalars['String'];
  quantity: Scalars['Int'];
  reason?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type TransferInventoryOutput = {
  __typename?: 'TransferInventoryOutput';
  complexity?: Maybe<Scalars['Int']>;
  ok?: Maybe<Scalars['Boolean']>;
  request_id?: Maybe<Scalars['String']>;
};

export type UpdateBillInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  /** Bill status: draft, paid, finalize */
  status: Scalars['String'];
};

export type UpdateInventoryInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  location_id?: InputMaybe<Scalars['String']>;
  quantity: Scalars['Int'];
  reason?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  warehouse_id: Scalars['String'];
};

export type UpdateInventoryOutput = {
  __typename?: 'UpdateInventoryOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  warehouse_product?: Maybe<WarehouseProduct>;
};

export type UpdateLineItemInput = {
  barcode?: InputMaybe<Scalars['String']>;
  custom_barcode?: InputMaybe<Scalars['String']>;
  custom_options?: InputMaybe<Scalars['GenericScalar']>;
  /** A decimal value used for customs */
  customs_value?: InputMaybe<Scalars['String']>;
  eligible_for_return?: InputMaybe<Scalars['Boolean']>;
  fulfillment_status?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  option_title?: InputMaybe<Scalars['String']>;
  partner_line_item_id?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  product_name?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  quantity_pending_fulfillment?: InputMaybe<Scalars['Int']>;
  /** Set to lock to that warehouse. The item will not be moved in any multi-warhouse processing */
  warehouse_id?: InputMaybe<Scalars['String']>;
};

export type UpdateLineItemsInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  line_items?: InputMaybe<Array<InputMaybe<UpdateLineItemInput>>>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
};

export type UpdateLocationInput = {
  dimensions?: InputMaybe<DimensionsInput>;
  is_cart?: InputMaybe<Scalars['Boolean']>;
  /** The id of the location you want to modify */
  location_id: Scalars['String'];
  location_type_id?: InputMaybe<Scalars['String']>;
  pick_priority?: InputMaybe<Scalars['Int']>;
  pickable?: InputMaybe<Scalars['Boolean']>;
  sellable?: InputMaybe<Scalars['Boolean']>;
  temperature?: InputMaybe<Scalars['String']>;
  zone?: InputMaybe<Scalars['String']>;
};

/** GraphQL input type for Lot update. */
export type UpdateLotInput = {
  expires_at?: InputMaybe<Scalars['ISODateTime']>;
  is_active?: InputMaybe<Scalars['Boolean']>;
  lot_id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  sku?: InputMaybe<Scalars['String']>;
};

/** GraphQL output type for Lot update. */
export type UpdateLotOutput = {
  __typename?: 'UpdateLotOutput';
  complexity?: Maybe<Scalars['Int']>;
  lot?: Maybe<Lot>;
  request_id?: Maybe<Scalars['String']>;
};

/** GraphQL input type for Lots update. */
export type UpdateLotsInput = {
  is_active?: InputMaybe<Scalars['Boolean']>;
  lots_ids: Array<InputMaybe<Scalars['String']>>;
};

/** GraphQL output type for Lots update. */
export type UpdateLotsOutput = {
  __typename?: 'UpdateLotsOutput';
  complexity?: Maybe<Scalars['Int']>;
  ok?: Maybe<Scalars['Boolean']>;
  request_id?: Maybe<Scalars['String']>;
};

export type UpdateOrderFulfillmentStatusInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  fulfillment_status: Scalars['String'];
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  reason?: InputMaybe<Scalars['String']>;
  /** Whether or not to remove inventory if the order is being cancelled */
  remove_inventory?: InputMaybe<Scalars['Boolean']>;
  /** Whether or not to void the order on the sales platform if the order is being cancelled */
  void_on_platform?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateOrderHoldsInput = {
  address_hold?: InputMaybe<Scalars['Boolean']>;
  client_hold?: InputMaybe<Scalars['Boolean']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  fraud_hold?: InputMaybe<Scalars['Boolean']>;
  operator_hold?: InputMaybe<Scalars['Boolean']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  payment_hold?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateOrderInput = {
  address_is_business?: InputMaybe<Scalars['Boolean']>;
  adult_signature_required?: InputMaybe<Scalars['Boolean']>;
  alcohol?: InputMaybe<Scalars['Boolean']>;
  allocation_priority?: InputMaybe<Scalars['Int']>;
  allow_partial?: InputMaybe<Scalars['Boolean']>;
  allow_split?: InputMaybe<Scalars['Boolean']>;
  auto_print_return_label?: InputMaybe<Scalars['Boolean']>;
  billing_address?: InputMaybe<CreateOrderAddressInput>;
  box_name?: InputMaybe<Scalars['String']>;
  custom_invoice_url?: InputMaybe<Scalars['String']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  dry_ice_weight_in_lbs?: InputMaybe<Scalars['String']>;
  ftr_exemption?: InputMaybe<Scalars['Decimal']>;
  fulfillment_status?: InputMaybe<Scalars['String']>;
  gift_invoice?: InputMaybe<Scalars['Boolean']>;
  gift_note?: InputMaybe<Scalars['String']>;
  history_entry?: InputMaybe<UserNoteInput>;
  hold_until_date?: InputMaybe<Scalars['ISODateTime']>;
  /** US addresses are be validated and when errors occur the order will have an address hold created. If this flag is set then the error validation is skipped and no address hold is created */
  ignore_address_validation_errors?: InputMaybe<Scalars['Boolean']>;
  incoterms?: InputMaybe<Scalars['String']>;
  insurance?: InputMaybe<Scalars['Boolean']>;
  note_attributes?: InputMaybe<Array<InputMaybe<OrderNoteAttributeInput>>>;
  order_date?: InputMaybe<Scalars['ISODateTime']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  order_number?: InputMaybe<Scalars['String']>;
  packing_note?: InputMaybe<Scalars['String']>;
  partner_order_id?: InputMaybe<Scalars['String']>;
  priority_flag?: InputMaybe<Scalars['Boolean']>;
  profile?: InputMaybe<Scalars['String']>;
  ready_to_ship?: InputMaybe<Scalars['Boolean']>;
  require_signature?: InputMaybe<Scalars['Boolean']>;
  required_ship_date?: InputMaybe<Scalars['ISODateTime']>;
  shipping_address?: InputMaybe<CreateOrderAddressInput>;
  shipping_lines?: InputMaybe<CreateShippingLinesInput>;
  /** Not address validation will be performed */
  skip_address_validation?: InputMaybe<Scalars['Boolean']>;
  subtotal?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tax_id?: InputMaybe<Scalars['String']>;
  tax_type?: InputMaybe<Scalars['String']>;
  total_discounts?: InputMaybe<Scalars['String']>;
  total_price?: InputMaybe<Scalars['String']>;
  total_tax?: InputMaybe<Scalars['String']>;
};

export type UpdateOrderInputBase = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
};

export type UpdateProductCaseInput = {
  case_barcode: Scalars['String'];
  case_quantity: Scalars['Int'];
};

export type UpdateProductImageInput = {
  position?: InputMaybe<Scalars['Int']>;
  src: Scalars['String'];
};

export type UpdateProductInput = {
  barcode?: InputMaybe<Scalars['String']>;
  cases?: InputMaybe<Array<InputMaybe<UpdateProductCaseInput>>>;
  country_of_manufacture?: InputMaybe<Scalars['String']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  customs_description?: InputMaybe<Scalars['String']>;
  dimensions?: InputMaybe<DimensionsInput>;
  dropship?: InputMaybe<Scalars['Boolean']>;
  final_sale?: InputMaybe<Scalars['Boolean']>;
  images?: InputMaybe<Array<InputMaybe<UpdateProductImageInput>>>;
  name?: InputMaybe<Scalars['String']>;
  needs_lot_tracking?: InputMaybe<Scalars['Boolean']>;
  needs_serial_number?: InputMaybe<Scalars['Boolean']>;
  packer_note?: InputMaybe<Scalars['String']>;
  product_note?: InputMaybe<Scalars['String']>;
  sku: Scalars['String'];
  /** Fully replaces existen tags with the ones provided */
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tariff_code?: InputMaybe<Scalars['String']>;
  vendors?: InputMaybe<Array<InputMaybe<UpdateProductVendorInput>>>;
  virtual?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateProductVendorInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  vendor_id: Scalars['String'];
  vendor_sku?: InputMaybe<Scalars['String']>;
};

export type UpdatePurchaseOrderInput = {
  clear_po_date?: InputMaybe<Scalars['Boolean']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  discount?: InputMaybe<Scalars['String']>;
  line_items?: InputMaybe<Array<InputMaybe<UpdatePurchaseOrderLineItemInput>>>;
  packing_note?: InputMaybe<Scalars['String']>;
  partner_order_number?: InputMaybe<Scalars['String']>;
  payment_due_by?: InputMaybe<Scalars['String']>;
  payment_method?: InputMaybe<Scalars['String']>;
  payment_note?: InputMaybe<Scalars['String']>;
  pdf?: InputMaybe<Scalars['String']>;
  po_date?: InputMaybe<Scalars['ISODateTime']>;
  po_id: Scalars['String'];
  po_note?: InputMaybe<Scalars['String']>;
  shipping_carrier?: InputMaybe<Scalars['String']>;
  shipping_method?: InputMaybe<Scalars['String']>;
  shipping_name?: InputMaybe<Scalars['String']>;
  shipping_price?: InputMaybe<Scalars['String']>;
  tax?: InputMaybe<Scalars['String']>;
  tracking_number?: InputMaybe<Scalars['String']>;
};

export type UpdatePurchaseOrderLineItemInput = {
  note?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  quantity_received?: InputMaybe<Scalars['Int']>;
  quantity_rejected?: InputMaybe<Scalars['Int']>;
  sell_ahead?: InputMaybe<Scalars['Int']>;
  sku: Scalars['String'];
};

export type UpdatePurchaseOrderOutput = {
  __typename?: 'UpdatePurchaseOrderOutput';
  complexity?: Maybe<Scalars['Int']>;
  purchase_order?: Maybe<PurchaseOrder>;
  request_id?: Maybe<Scalars['String']>;
};

export type UpdateReturnStatusInput = {
  return_id: Scalars['String'];
  status: Scalars['String'];
};

export type UpdateReturnStatusOutput = {
  __typename?: 'UpdateReturnStatusOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  return?: Maybe<Return>;
};

export type UpdateTagsInput = {
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  /** The id of the order you want to modify */
  order_id: Scalars['String'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UpdateWarehouseProductInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  /** Use this when you are a 3PL acting on behalf of one of your customers */
  customer_account_id?: InputMaybe<Scalars['String']>;
  customs_value?: InputMaybe<Scalars['String']>;
  inventory_bin?: InputMaybe<Scalars['String']>;
  inventory_overstock_bin?: InputMaybe<Scalars['String']>;
  on_hand?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['String']>;
  reorder_amount?: InputMaybe<Scalars['Int']>;
  reorder_level?: InputMaybe<Scalars['Int']>;
  replenishment_level?: InputMaybe<Scalars['Int']>;
  reserve_inventory?: InputMaybe<Scalars['Int']>;
  sku: Scalars['String'];
  value?: InputMaybe<Scalars['String']>;
  value_currency?: InputMaybe<Scalars['String']>;
  warehouse_id: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  account?: Maybe<Account>;
  email?: Maybe<Scalars['String']>;
  first_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
};

export type UserNoteInput = {
  message?: InputMaybe<Scalars['String']>;
  source?: InputMaybe<Scalars['String']>;
};

export type UserQuota = {
  __typename?: 'UserQuota';
  credits_remaining?: Maybe<Scalars['Int']>;
  /** @deprecated There's no time window anymore, this will be always empty */
  expiration_date?: Maybe<Scalars['ISODateTime']>;
  increment_rate?: Maybe<Scalars['Int']>;
  /** @deprecated There's no time window anymore, this will be always False */
  is_expired?: Maybe<Scalars['Boolean']>;
  max_available?: Maybe<Scalars['Int']>;
  /** @deprecated There's no time window anymore, this will be always empty */
  time_remaining?: Maybe<Scalars['String']>;
};

export type Vendor = {
  __typename?: 'Vendor';
  account_id?: Maybe<Scalars['String']>;
  account_number?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  currency?: Maybe<Scalars['String']>;
  default_po_note?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  internal_note?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  partner_vendor_id?: Maybe<Scalars['Int']>;
};

export type VendorConnection = {
  __typename?: 'VendorConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<VendorEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Vendor` and its cursor. */
export type VendorEdge = {
  __typename?: 'VendorEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Vendor>;
};

export type VendorsQueryResult = {
  __typename?: 'VendorsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<VendorConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type VendorsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type Warehouse = {
  __typename?: 'Warehouse';
  account_id?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  company_alias?: Maybe<Scalars['String']>;
  company_name?: Maybe<Scalars['String']>;
  dynamic_slotting?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  /** Name of the warehouse */
  identifier?: Maybe<Scalars['String']>;
  invoice_email?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  phone_number?: Maybe<Scalars['String']>;
  products?: Maybe<ProductConnection>;
  profile?: Maybe<Scalars['String']>;
  return_address?: Maybe<Address>;
};


export type WarehouseProductsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type WarehouseProduct = {
  __typename?: 'WarehouseProduct';
  account_id?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  /** Count of how many units you have in stock and owe to customers for open orders */
  allocated?: Maybe<Scalars['Int']>;
  /** The number of available stock for any given SKU that is pushed to any connected sales channel. This is On Hand minus any allocations to open orders. */
  available?: Maybe<Scalars['Int']>;
  /** Count of how many units you owe to customers for open orders and don’t have stock for in the warehouse */
  backorder?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['ISODateTime']>;
  custom?: Maybe<Scalars['Boolean']>;
  customs_value?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  inbounds?: Maybe<WarehouseProductInboundConnection>;
  /** The name of the bin where the product is stored */
  inventory_bin?: Maybe<Scalars['String']>;
  /** The name of the bin where overstock is stored */
  inventory_overstock_bin?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  locations?: Maybe<ItemLocationConnection>;
  /** Count of non sellable units of a SKU in the warehouse. */
  non_sellable_quantity?: Maybe<Scalars['Int']>;
  /** The total count of a SKU physically in the warehouse. (Note, Available is the count indicated in your sales channels) */
  on_hand?: Maybe<Scalars['Int']>;
  /** Price of the product */
  price?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  /** The number that should be reordered when a SKU reaches the Reorder Level */
  reorder_amount?: Maybe<Scalars['Int']>;
  /** The Available value a SKU must reach to trigger a Reorder. (See Reorder Amount). Setting this to 0 will prevent a SKU from automatically being added to a PO */
  reorder_level?: Maybe<Scalars['Int']>;
  /** Available only for accounts that use Dynamic Slotting and used specifically for replenishment reports. SKUs will appear on the replenishment report if inventory allocated and not enough in pickable bins, or if the pickable bin inventory is less than the replenishment level */
  replenishment_level?: Maybe<Scalars['Int']>;
  /** Count of a SKU that is not to be sold in your sales channel.For example, if you’re running a flash sale and want to hold some stock for returns or exchanges, you would enter your full inventory of say 100 units as the On Hand and a Reserve of 5 units. We’ll then tell the platform that you have 95 available for sale (On Hand minus Reserve). The Available count will remain 100 */
  reserve_inventory?: Maybe<Scalars['Int']>;
  sell_ahead?: Maybe<Scalars['Int']>;
  /** Stock Keeping Unit */
  sku?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['ISODateTime']>;
  /** Price paid for the product */
  value?: Maybe<Scalars['String']>;
  value_currency?: Maybe<Scalars['String']>;
  warehouse?: Maybe<Warehouse>;
  warehouse_id?: Maybe<Scalars['String']>;
  /** The warehouse identifier, usually Primary/Secondary */
  warehouse_identifier?: Maybe<Scalars['String']>;
};


export type WarehouseProductInboundsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  created_from?: InputMaybe<Scalars['ISODateTime']>;
  created_to?: InputMaybe<Scalars['ISODateTime']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};


export type WarehouseProductLocationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  customer_account_id?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type WarehouseProductConnection = {
  __typename?: 'WarehouseProductConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<WarehouseProductEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `WarehouseProduct` and its cursor. */
export type WarehouseProductEdge = {
  __typename?: 'WarehouseProductEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<WarehouseProduct>;
};

export type WarehouseProductInbound = {
  __typename?: 'WarehouseProductInbound';
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  po_date?: Maybe<Scalars['ISODateTime']>;
  po_id?: Maybe<Scalars['String']>;
  purchase_order_line_item_id?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  quantity_received?: Maybe<Scalars['Int']>;
  quantity_rejected?: Maybe<Scalars['Int']>;
  sell_ahead?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  warehouse_id?: Maybe<Scalars['String']>;
};

export type WarehouseProductInboundConnection = {
  __typename?: 'WarehouseProductInboundConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<WarehouseProductInboundEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `WarehouseProductInbound` and its cursor. */
export type WarehouseProductInboundEdge = {
  __typename?: 'WarehouseProductInboundEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<WarehouseProductInbound>;
};

export type WarehouseProductMutationOutput = {
  __typename?: 'WarehouseProductMutationOutput';
  complexity?: Maybe<Scalars['Int']>;
  request_id?: Maybe<Scalars['String']>;
  warehouse_product?: Maybe<WarehouseProduct>;
};

export type WarehouseProductsQueryResult = {
  __typename?: 'WarehouseProductsQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<WarehouseProductConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type WarehouseProductsQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type Webhook = {
  __typename?: 'Webhook';
  account_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  legacy_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  /** This will only be returned once when the webhook is created. */
  shared_signature_secret?: Maybe<Scalars['String']>;
  shop_name?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type WebhookConnection = {
  __typename?: 'WebhookConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<WebhookEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `Webhook` and its cursor. */
export type WebhookEdge = {
  __typename?: 'WebhookEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Webhook>;
};

export type WebhooksQueryResult = {
  __typename?: 'WebhooksQueryResult';
  complexity?: Maybe<Scalars['Int']>;
  data?: Maybe<WebhookConnection>;
  request_id?: Maybe<Scalars['String']>;
};


export type WebhooksQueryResultDataArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<Scalars['String']>;
};

export type AddOrderLineItemsMutationVariables = Exact<{
  data: AddLineItemsInput;
}>;


export type AddOrderLineItemsMutation = { __typename?: 'Mutation', order_add_line_items?: { __typename?: 'OrderMutationOutput', request_id?: string | null, order?: { __typename?: 'Order', line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', sku?: string | null, product?: { __typename?: 'Product', warehouse_products?: Array<{ __typename?: 'WarehouseProduct', on_hand?: number | null, warehouse?: { __typename?: 'Warehouse', identifier?: string | null } | null } | null> | null } | null } | null } | null> } | null } | null } | null };

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', order_create?: { __typename?: 'OrderMutationOutput', request_id?: string | null, complexity?: number | null, order?: { __typename?: 'Order', line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', sku?: string | null, product?: { __typename?: 'Product', warehouse_products?: Array<{ __typename?: 'WarehouseProduct', on_hand?: number | null, warehouse?: { __typename?: 'Warehouse', identifier?: string | null } | null } | null> | null } | null } | null } | null> } | null } | null } | null };

export type GetProductInventoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductInventoryQuery = { __typename?: 'Query', products?: { __typename?: 'ProductsQueryResult', data?: { __typename?: 'ProductConnection', edges: Array<{ __typename?: 'ProductEdge', node?: { __typename?: 'Product', sku?: string | null, warehouse_products?: Array<{ __typename?: 'WarehouseProduct', on_hand?: number | null } | null> | null } | null } | null> } | null } | null };

export type GetCustomerOrderByEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetCustomerOrderByEmailQuery = { __typename?: 'Query', orders?: { __typename?: 'OrdersQueryResult', data?: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', node?: { __typename?: 'Order', order_number?: string | null, fulfillment_status?: string | null, order_date?: any | null, email?: string | null, line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', fulfillment_status?: string | null, product_name?: string | null, sku?: string | null, product?: { __typename?: 'Product', kit?: boolean | null, kit_components?: Array<{ __typename?: 'KitComponent', sku?: string | null } | null> | null } | null } | null } | null> } | null } | null } | null> } | null } | null };

export type GetLastFulfilledOrderByEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetLastFulfilledOrderByEmailQuery = { __typename?: 'Query', orders?: { __typename?: 'OrdersQueryResult', data?: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', node?: { __typename?: 'Order', id?: string | null, order_number?: string | null, fulfillment_status?: string | null, order_date?: any | null, email?: string | null, line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', fulfillment_status?: string | null, product_name?: string | null, sku?: string | null } | null } | null> } | null } | null } | null> } | null } | null };

export type GetLastFulfilledOrderByUuidQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type GetLastFulfilledOrderByUuidQuery = { __typename?: 'Query', orders?: { __typename?: 'OrdersQueryResult', data?: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', node?: { __typename?: 'Order', id?: string | null, order_number?: string | null, fulfillment_status?: string | null, order_date?: any | null, email?: string | null, line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', fulfillment_status?: string | null, product_name?: string | null, sku?: string | null } | null } | null> } | null } | null } | null> } | null } | null };

export type GetLastOrderByEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type GetLastOrderByEmailQuery = { __typename?: 'Query', orders?: { __typename?: 'OrdersQueryResult', data?: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', node?: { __typename?: 'Order', id?: string | null, order_number?: string | null, fulfillment_status?: string | null, order_date?: any | null, email?: string | null, line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', fulfillment_status?: string | null, product_name?: string | null, sku?: string | null } | null } | null> } | null } | null } | null> } | null } | null };

export type GetLastOrderByUuidQueryVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type GetLastOrderByUuidQuery = { __typename?: 'Query', orders?: { __typename?: 'OrdersQueryResult', data?: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', node?: { __typename?: 'Order', id?: string | null, order_number?: string | null, fulfillment_status?: string | null, order_date?: any | null, email?: string | null, partner_order_id?: string | null, line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', fulfillment_status?: string | null, product_name?: string | null, sku?: string | null } | null } | null> } | null } | null } | null> } | null } | null };

export type GetOrderByOrderNumberQueryVariables = Exact<{
  orderNumber: Scalars['String'];
}>;


export type GetOrderByOrderNumberQuery = { __typename?: 'Query', orders?: { __typename?: 'OrdersQueryResult', data?: { __typename?: 'OrderConnection', edges: Array<{ __typename?: 'OrderEdge', node?: { __typename?: 'Order', id?: string | null, order_number?: string | null, shop_name?: string | null, fulfillment_status?: string | null, order_date?: any | null, email?: string | null, packing_note?: string | null, line_items?: { __typename?: 'LineItemQuerySpecConnection', edges: Array<{ __typename?: 'LineItemQuerySpecEdge', node?: { __typename?: 'LineItem', fulfillment_status?: string | null, product_name?: string | null, sku?: string | null, quantity?: number | null } | null } | null> } | null } | null } | null> } | null } | null };

export type UpdateOrderMutationVariables = Exact<{
  input: UpdateOrderInput;
}>;


export type UpdateOrderMutation = { __typename?: 'Mutation', order_update?: { __typename?: 'OrderMutationOutput', request_id?: string | null, complexity?: number | null, order?: { __typename?: 'Order', hold_until_date?: any | null, order_number?: string | null } | null } | null };


export const AddOrderLineItemsDocument = gql`
    mutation AddOrderLineItems($data: AddLineItemsInput!) {
  order_add_line_items(data: $data) {
    request_id
    order {
      line_items {
        edges {
          node {
            sku
            product {
              warehouse_products {
                warehouse {
                  identifier
                }
                on_hand
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const CreateOrderDocument = gql`
    mutation createOrder($input: CreateOrderInput!) {
  order_create(data: $input) {
    request_id
    complexity
    order {
      line_items {
        edges {
          node {
            sku
            product {
              warehouse_products {
                warehouse {
                  identifier
                }
                on_hand
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetProductInventoryDocument = gql`
    query getProductInventory {
  products {
    data {
      edges {
        node {
          sku
          warehouse_products {
            on_hand
          }
        }
      }
    }
  }
}
    `;
export const GetCustomerOrderByEmailDocument = gql`
    query getCustomerOrderByEmail($email: String!) {
  orders(email: $email) {
    data(last: 10) {
      edges {
        node {
          order_number
          fulfillment_status
          order_date
          email
          line_items {
            edges {
              node {
                fulfillment_status
                product_name
                sku
                product {
                  kit
                  kit_components {
                    sku
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetLastFulfilledOrderByEmailDocument = gql`
    query getLastFulfilledOrderByEmail($email: String!) {
  orders(email: $email) {
    data(last: 2) {
      edges {
        node {
          id
          order_number
          fulfillment_status
          order_date
          email
          line_items {
            edges {
              node {
                fulfillment_status
                product_name
                sku
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetLastFulfilledOrderByUuidDocument = gql`
    query getLastFulfilledOrderByUuid($uuid: String!) {
  orders(partner_order_id: $uuid) {
    data(last: 2) {
      edges {
        node {
          id
          order_number
          fulfillment_status
          order_date
          email
          line_items {
            edges {
              node {
                fulfillment_status
                product_name
                sku
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetLastOrderByEmailDocument = gql`
    query getLastOrderByEmail($email: String!) {
  orders(email: $email) {
    data(last: 1) {
      edges {
        node {
          id
          order_number
          fulfillment_status
          order_date
          email
          line_items {
            edges {
              node {
                fulfillment_status
                product_name
                sku
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetLastOrderByUuidDocument = gql`
    query getLastOrderByUuid($uuid: String!) {
  orders(partner_order_id: $uuid) {
    data(last: 1) {
      edges {
        node {
          id
          order_number
          fulfillment_status
          order_date
          email
          partner_order_id
          line_items {
            edges {
              node {
                fulfillment_status
                product_name
                sku
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetOrderByOrderNumberDocument = gql`
    query getOrderByOrderNumber($orderNumber: String!) {
  orders(order_number: $orderNumber) {
    data(last: 1) {
      edges {
        node {
          id
          order_number
          shop_name
          fulfillment_status
          order_date
          email
          packing_note
          line_items {
            edges {
              node {
                fulfillment_status
                product_name
                sku
                quantity
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($input: UpdateOrderInput!) {
  order_update(data: $input) {
    request_id
    complexity
    order {
      hold_until_date
      order_number
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AddOrderLineItems(variables: AddOrderLineItemsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddOrderLineItemsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddOrderLineItemsMutation>(AddOrderLineItemsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddOrderLineItems', 'mutation');
    },
    createOrder(variables: CreateOrderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateOrderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateOrderMutation>(CreateOrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createOrder', 'mutation');
    },
    getProductInventory(variables?: GetProductInventoryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProductInventoryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProductInventoryQuery>(GetProductInventoryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getProductInventory', 'query');
    },
    getCustomerOrderByEmail(variables: GetCustomerOrderByEmailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCustomerOrderByEmailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomerOrderByEmailQuery>(GetCustomerOrderByEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getCustomerOrderByEmail', 'query');
    },
    getLastFulfilledOrderByEmail(variables: GetLastFulfilledOrderByEmailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLastFulfilledOrderByEmailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLastFulfilledOrderByEmailQuery>(GetLastFulfilledOrderByEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLastFulfilledOrderByEmail', 'query');
    },
    getLastFulfilledOrderByUuid(variables: GetLastFulfilledOrderByUuidQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLastFulfilledOrderByUuidQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLastFulfilledOrderByUuidQuery>(GetLastFulfilledOrderByUuidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLastFulfilledOrderByUuid', 'query');
    },
    getLastOrderByEmail(variables: GetLastOrderByEmailQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLastOrderByEmailQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLastOrderByEmailQuery>(GetLastOrderByEmailDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLastOrderByEmail', 'query');
    },
    getLastOrderByUuid(variables: GetLastOrderByUuidQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLastOrderByUuidQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLastOrderByUuidQuery>(GetLastOrderByUuidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLastOrderByUuid', 'query');
    },
    getOrderByOrderNumber(variables: GetOrderByOrderNumberQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetOrderByOrderNumberQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetOrderByOrderNumberQuery>(GetOrderByOrderNumberDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOrderByOrderNumber', 'query');
    },
    UpdateOrder(variables: UpdateOrderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateOrderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateOrderMutation>(UpdateOrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateOrder', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;