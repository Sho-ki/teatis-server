export interface PurchaseDateBasedAutoMessage extends PurchaseDateBasedAutoMessageHeader{
  body: string;
  media?: AutoMessageMedia[];

}

export interface PurchaseDateBasedAutoMessageHeader {
  id: number;
  delayDaysSincePurchase: number;
  type:'purchaseDateBased';
}

export interface SequenceBasedAutoMessageHeader {
  id: number;
  sequence:number;
  type:'sequenceBased';
 }

export interface SequenceBasedAutoMessage extends SequenceBasedAutoMessageHeader {
  body: string;
  media?: AutoMessageMedia[];
 }

export interface AutoMessageMedia {
  urlTemplate: string;
  type: 'mp3'|'mp4'|'image'|'webPage';
}
