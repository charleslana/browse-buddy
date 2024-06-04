import { Action } from 'electron/types/action';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faRoute,
  faComputerMouse,
  faFill,
  faKeyboard,
  faEraser,
  faEye,
  faEyeSlash,
  faReply,
  faHourglassEnd,
} from '@fortawesome/free-solid-svg-icons';

export function formatBreakLines(text: string): string {
  text = text.replace(/\n/g, '<br>');
  return text;
}

export function getIcon(action: Action): IconDefinition {
  switch (action) {
    case 'navigate':
      return faRoute;
    case 'wait-click':
      return faComputerMouse;
    case 'click':
      return faComputerMouse;
    case 'fill':
      return faFill;
    case 'type':
      return faKeyboard;
    case 'clear':
      return faEraser;
    case 'wait-visible':
      return faEye;
    case 'wait-hidden':
      return faEyeSlash;
    case 'click-wait-response':
      return faReply;
    case 'end':
      return faHourglassEnd;
    default:
      return faRoute;
  }
}
