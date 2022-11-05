export declare namespace CreateCalendarEventResponse {
    export interface Creator {
        email: string;
        self: boolean;
    }

    export interface Organizer {
        email: string;
        self: boolean;
    }

    export interface Start {
        date: string;
    }

    export interface End {
        date: string;
    }

    export interface Override {
        method: string;
        minutes: number;
    }

    export interface Reminders {
        useDefault: boolean;
        overrides: Override[];
    }

    export interface RootObject {
        kind: string;
        etag: string;
        id: string;
        status: string;
        htmlLink: string;
        created: Date;
        updated: Date;
        summary: string;
        description: string;
        colorId: string;
        creator: Creator;
        organizer: Organizer;
        start: Start;
        end: End;
        recurrence: string[];
        iCalUID: string;
        sequence: number;
        reminders: Reminders;
        eventType: string;
    }

}

