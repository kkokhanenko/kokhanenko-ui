import { onBeforeUnmount, onMounted, type Ref } from 'vue';

export function useDismissableLayer(
  roots: Array<Ref<HTMLElement | null>>,
  close: () => void,
  enabled: () => boolean = () => true,
): void {
  const onPointerDown = (event: PointerEvent) => {
    if (!enabled()) return;
    const target = event.target as Node | null;
    if (target && roots.some((root) => root.value?.contains(target))) return;
    close();
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (enabled() && event.key === 'Escape') close();
  };

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeydown);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('keydown', onKeydown);
  });
}
