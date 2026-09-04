import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import KActionMenu from '../src/overlays/action-menu/KActionMenu.vue';
import KModal from '../src/overlays/modal/KModal.vue';

afterEach(() => { document.body.innerHTML = ''; });

describe('overlays', () => {
  it('emits the selected action and ignores hidden actions', async () => {
    const wrapper = mount(KActionMenu, {
      attachTo: document.body,
      props: {
        items: [
          { id: 'edit', label: 'Изменить' },
          { id: 'hidden', label: 'Скрыто', hidden: true },
        ],
      },
    });
    await wrapper.get('.kui-action-menu__trigger').trigger('click');
    const items = document.body.querySelectorAll<HTMLButtonElement>('.kui-action-menu__item');
    expect(items).toHaveLength(1);
    items[0].click();
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'edit' });
    wrapper.unmount();
  });

  it('closes a modal with Escape', async () => {
    const wrapper = mount(KModal, {
      attachTo: document.body,
      props: { open: true, title: 'Настройки' },
      slots: { default: '<button type="button">Действие</button>' },
    });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });
});
