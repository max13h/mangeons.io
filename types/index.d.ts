declare global {
  interface NestedStepList {
    id: number;
    value: string;
    index: number
  }
  interface StepsList {
    id: number;
    value: string;
    nested: NestedStepList[];
    index: number,
  }
}

export {};
