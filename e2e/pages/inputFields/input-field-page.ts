import { Locator, Page } from '@playwright/test';

import { selector } from '../../utils/test-data-attribute';
import { fieldIdErrorMessage } from './common';
import { CommonFieldPageInterface } from './model';

export class InputFieldPage implements CommonFieldPageInterface {
  constructor(
    readonly parent: Page | Locator,
    public fieldId?: string
  ) {}

  get field() {
    if (!this.fieldId) {
      throw new Error(fieldIdErrorMessage);
    }

    return this.parent.locator(selector(this.fieldId));
  }

  setFieldId = (fieldId: string) => {
    this.fieldId = fieldId;
  };

  setValue = async (value: string) => {
    await this.field.fill(value);
  };

  getValue = () => {
    return this.field.inputValue();
  };

  isVisible = () => {
    return this.field.isVisible();
  };

  click = () => {
    return this.field.click();
  };

  selectOption = (option: string) => {
    return this.field.selectOption(option);
  };

  clear = () => {
    return this.setValue('');
  };
}
