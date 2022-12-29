export interface TwilioConversationHeader {
    channelSid:string;
    channelName:string;
    coachPhone:string;
    customerPhone:string;
}

export interface TwilioConversationBody {
    messageSid:string;
    body:string;

}
