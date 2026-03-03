export interface CommonFieldPageInterface {
  setValue: (value: any) => Promise<void>;
  getValue: () => Promise<any>;
  isVisible: () => Promise<boolean>;
  clear: () => Promise<void>;
}
