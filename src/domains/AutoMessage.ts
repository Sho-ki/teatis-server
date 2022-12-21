export interface AutoMessage {
  id: number;
  delayDaysSincePurchase: number;
  content: string;
  media?: autoMessageMedia[];
}

interface autoMessageMedia {
  urlTemplate: string;
  variableName?: string;
}
