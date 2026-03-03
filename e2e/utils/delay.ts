import { SECOND } from '../../core/constants/common';

export const waitForSeconds = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time * SECOND));
