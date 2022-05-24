export interface Question {
  id: number;
  name: string;
  label: string;
  mustBeAnswered: boolean;
  instruction?: string;
  placeholder?: string;
  answerType: string;
  options?: { id: number; name: string; label: string }[];
}
