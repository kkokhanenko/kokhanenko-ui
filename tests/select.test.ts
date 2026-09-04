import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import KSelect from '../src/controls/select/KSelect.vue';

afterEach(() => { document.body.innerHTML = ''; });

describe('KSelect', () => {
  const options = [
    { value: 'one', label: 'Первый' },
    { value: 'two', label: 'Второй' },
  ];

  it('emits a selected single value', async () => {
    const wrapper = mount(KSelect, { attachTo: document.body, props: { modelValue: null, options } });
    await wrapper.get('.kui-select__trigger').trigger('click');
    const option = document.body.querySelectorAll<HTMLButtonElement>('.kui-select__option')[1];
    option.click();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two']);
    wrapper.unmount();
  });

  it('keeps the dropdown indicator pointing down while open', async () => {
    const wrapper = mount(KSelect, { attachTo: document.body, props: { modelValue: null, options } });
    const chevron = wrapper.get('.kui-select__chevron');

    expect(chevron.text()).toBe('▾');
    await wrapper.get('.kui-select__trigger').trigger('click');
    expect(chevron.text()).toBe('▾');

    wrapper.unmount();
  });

  it('measures the panel as floating on its first opening', async () => {
    const rect = (left: number, width: number, top = 0, height = 40) => ({
      x: left,
      y: top,
      left,
      right: left + width,
      top,
      bottom: top + height,
      width,
      height,
      toJSON: () => ({}),
    });
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('kui-select__trigger')) return rect(787, 192, 44, 40);
      if (this.classList.contains('kui-select__panel')) {
        return this.style.position === 'fixed' ? rect(0, 194, 0, 112) : rect(0, 465, 0, 112);
      }
      return rect(0, 0);
    });
    const wrapper = mount(KSelect, {
      attachTo: document.body,
      props: { modelValue: null, options, placement: 'bottom-end' },
    });

    await wrapper.get('.kui-select__value').trigger('click');
    const panel = document.body.querySelector<HTMLElement>('.kui-select__panel');

    expect(panel?.style.position).toBe('fixed');
    expect(panel?.style.left).toBe('785px');

    bounds.mockRestore();
    wrapper.unmount();
  });

  it('shows checkboxes only in multiple mode', async () => {
    const wrapper = mount(KSelect, { attachTo: document.body, props: { modelValue: [], options, multiple: true, closeOnSelect: false } });
    await wrapper.get('.kui-select__trigger').trigger('click');
    expect(document.body.querySelectorAll('.kui-select__check')).toHaveLength(2);
    wrapper.unmount();
  });

  it('supports an implicit select-all option and stays open while values change', async () => {
    const wrapper = mount(KSelect, {
      attachTo: document.body,
      props: {
        modelValue: [],
        options,
        multiple: true,
        closeOnSelect: false,
        showSelectAll: true,
        allSelectionMode: 'implicit-empty',
      },
    });
    await wrapper.get('.kui-select__trigger').trigger('click');
    const items = document.body.querySelectorAll<HTMLButtonElement>('.kui-select__option');

    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('Все');
    expect(document.body.querySelectorAll('.kui-select__option--selected')).toHaveLength(3);

    items[1].click();
    await nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['two']]);
    expect(document.body.querySelector('.kui-select__panel')).not.toBeNull();
    wrapper.unmount();
  });
});
