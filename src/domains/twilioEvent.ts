export interface TwilioEvent {
  MessagingServiceSid: string;
  EventType: string;
  Attributes: string;
  DateCreated: string;
  Index: string;
  ChatServiceSid: string;
  MessageSid: string;
  AccountSid: string;
  Source: string;
  RetryCount: string;
  Author: string;
  ParticipantSid: string;
  Body: string;
  ConversationSid: string;
}
