import { comboBoxContentMotionVariants } from '../../../../packages/design-system/src/components/combo-box/ComboBox.variants';
import {
  dropdownMenuContentMotionVariants,
  dropdownMenuContentVariants,
} from '../../../../packages/design-system/src/components/dropdown/DropdownMenu.variants';
import {
  modalContainerMotionVariants,
  modalContainerVariants,
  modalOverlayClassName,
  modalOverlayMotionVariants,
} from '../../../../packages/design-system/src/components/modal/Modal.variants';
import {
  popupContainerClassName,
  popupContainerMotionVariants,
} from '../../../../packages/design-system/src/components/popup/Popup.variants';
import {
  selectContentMotionVariants,
  selectContentVariants,
  selectMenuContentVariants,
  selectSearchVariants,
  selectViewportVariants,
} from '../../../../packages/design-system/src/components/select/Select.variants';
import {
  sidepanelPanelMotionVariants,
  sidepanelPanelVariants,
} from '../../../../packages/design-system/src/components/sidepanel/Sidepanel.variants';
import {
  statusModalContainerMotionVariants,
  statusModalContainerVariants,
  statusModalOverlayClassName,
  statusModalOverlayMotionVariants,
} from '../../../../packages/design-system/src/components/status-modal/StatusModal.variants';
import {
  toastContainerVariants,
  toastViewportMotionVariants,
} from '../../../../packages/design-system/src/components/toast/Toast.variants';
import {
  tooltipArrowVariants,
  tooltipContentMotionVariants,
  tooltipContentVariants,
} from '../../../../packages/design-system/src/components/tooltip/Tooltip.variants';
import type { Values } from './playground-kit';

/**
 * Where the token graph reads a part that no server render can show: a part Radix mounts in a
 * portal once open (portals render nothing on the server), or one that exists only while
 * something is running (the toast stack). Its classes come from the same `*.variants.ts`
 * exports the component calls, never from the hand-drawn stand-ins in `src/playgrounds/`,
 * which only draw the Anatomy picture.
 *
 * `classes` are called with every combination of the selects and switches of `from` (a props
 * table in src/generated/controls.json), plus `args`; a string is a class list with no axes.
 * `inner` is the same for an element inside the part with no slot of its own (Select's
 * viewport). An empty `classes` is a part that renders its child (`asChild` triggers).
 *
 * The build fails when a playground draws a `data-slot` by hand that has no entry here, and
 * when an entry names a part its component does not have (src/lib/tokenUsage.ts).
 */
export type ClassSource = string | ((values: Values) => string);
export type PortalledPart = {
  from?: string;
  args?: Values;
  classes: ClassSource[];
  inner?: ClassSource[];
};

/** Motion classes are only there when motion is on, which is the default. */
const MOTION = { enabled: true };

export const PORTALLED: Record<string, Record<string, PortalledPart>> = {
  'combo-box': {
    'combo-box-content': {
      args: { ...MOTION, position: 'popper' },
      classes: [selectContentVariants, comboBoxContentMotionVariants],
    },
  },
  'dropdown-menu': {
    'dropdown-menu-content': {
      args: MOTION,
      classes: [dropdownMenuContentVariants, dropdownMenuContentMotionVariants],
    },
  },
  modal: {
    'modal-overlay': { args: MOTION, classes: [modalOverlayClassName, modalOverlayMotionVariants] },
    'modal-content': {
      args: MOTION,
      classes: [modalContainerVariants, modalContainerMotionVariants],
    },
  },
  // MultiSelect lists through DropdownMenu.Content (`shouldUsePrimitive={false}`).
  'multi-select': {
    'multi-select-content': {
      args: MOTION,
      classes: [
        dropdownMenuContentVariants,
        dropdownMenuContentMotionVariants,
        selectMenuContentVariants,
      ],
    },
  },
  popup: {
    'popup-container': {
      args: MOTION,
      classes: [popupContainerClassName, popupContainerMotionVariants],
    },
  },
  select: {
    'select-content': {
      from: 'SelectContentProps',
      args: MOTION,
      classes: [selectContentVariants, selectContentMotionVariants],
      inner: [selectViewportVariants],
    },
    'select-search': { classes: [selectSearchVariants] },
  },
  sidepanel: {
    'sidepanel-panel': {
      from: 'SidepanelPanelProps',
      args: MOTION,
      classes: [sidepanelPanelVariants, sidepanelPanelMotionVariants],
    },
  },
  'status-modal': {
    'status-modal-overlay': {
      args: MOTION,
      classes: [statusModalOverlayClassName, statusModalOverlayMotionVariants],
    },
    'status-modal-content': {
      from: 'StatusModalContentProps',
      args: MOTION,
      classes: [statusModalContainerVariants, statusModalContainerMotionVariants],
    },
  },
  toast: {
    'toast-container': {
      from: 'ToastContainerProps',
      args: { ...MOTION, stacked: true },
      classes: [toastContainerVariants, toastViewportMotionVariants],
    },
  },
  tooltip: {
    'tooltip-trigger': { classes: [] },
    'tooltip-content': {
      from: 'TooltipProps',
      args: MOTION,
      classes: [tooltipContentVariants, tooltipContentMotionVariants],
    },
    'tooltip-arrow': { from: 'TooltipProps', classes: [tooltipArrowVariants] },
  },
};
