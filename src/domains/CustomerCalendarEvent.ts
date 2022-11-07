
export interface End {
  date: string;
}

export interface Start {
  date: string;
}

export interface Override {
  method: 'popup' | 'email';
  minutes: number;
}

export interface Reminders {
  overrides: Override[];
  useDefault: boolean;
}

export interface CustomerCalendarEvent {
  summary: string;
  end: End;
  start: Start;
  recurrence: string[];
  reminders: Reminders;
  description: string;
  colorId: string;
}

