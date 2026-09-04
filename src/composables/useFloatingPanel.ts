import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export type FloatingPlacement = 'bottom-start' | 'bottom-end';

export function useFloatingPanel(
  trigger: Ref<HTMLElement | null>,
  panel: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  placement: () => FloatingPlacement = () => 'bottom-start',
) {
  // The panel must already be floating before its first measurement. Otherwise
  // a teleported block is measured at its normal-flow width and bottom-end
  // placement jumps left until the second opening.
  const panelStyle = ref<Record<string, string>>({ position: 'fixed' });

  const update = () => {
    if (!isOpen.value || !trigger.value || !panel.value) return;
    const triggerRect = trigger.value.getBoundingClientRect();
    const panelRect = panel.value.getBoundingClientRect();
    const gap = 6;
    const edge = 8;
    const width = panelRect.width || 220;
    const height = panelRect.height || 0;
    const preferredLeft = placement() === 'bottom-end'
      ? triggerRect.right - width
      : triggerRect.left;
    const left = Math.max(edge, Math.min(window.innerWidth - width - edge, preferredLeft));
    const below = window.innerHeight - triggerRect.bottom - gap - edge;
    const above = triggerRect.top - gap - edge;
    const openAbove = below < Math.min(height, 160) && above > below;
    const top = openAbove
      ? Math.max(edge, triggerRect.top - height - gap)
      : triggerRect.bottom + gap;

    panelStyle.value = {
      position: 'fixed',
      left: `${left}px`,
      top: `${Math.max(edge, top)}px`,
      maxHeight: `${Math.max(120, openAbove ? above : below)}px`,
    };
  };

  const updateAfterRender = async () => {
    await nextTick();
    update();
  };

  onMounted(() => {
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update);
    window.removeEventListener('scroll', update, true);
  });

  return { panelStyle, update, updateAfterRender };
}
