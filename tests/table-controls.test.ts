import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import KColumnPicker from '../src/data/column-picker/KColumnPicker.vue';
import KTableToolbar from '../src/data/table-toolbar/KTableToolbar.vue';
import KTableViewToggle from '../src/data/table-view-toggle/KTableViewToggle.vue';

afterEach(() => { document.body.innerHTML = ''; });

describe('table controls', () => {
  const options = [
    { value: 'name', label: 'Название', locked: true },
    { value: 'amount', label: 'Сумма' },
  ];

  it('switches table view', async () => {
    const wrapper = mount(KTableViewToggle, { props: { modelValue: 'table' } });
    await wrapper.findAll('button')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['cards']);
  });

  it('changes visible columns and their order', async () => {
    const wrapper = mount(KColumnPicker, {
      attachTo: document.body,
      props: { modelValue: ['name', 'amount'], columnOrder: ['name', 'amount'], options, reorderable: true, searchable: true },
    });
    await wrapper.get('.kui-column-picker__trigger').trigger('click');
    const checks = document.body.querySelectorAll<HTMLInputElement>('.kui-column-picker__option input');
    checks[1].click();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['name']]);
    expect(document.body.querySelector('.kui-column-picker__drag')).toBeNull();
    document.body.querySelector<HTMLButtonElement>('.kui-column-picker__reorder-toggle')?.click();
    await wrapper.vm.$nextTick();
    const handles = document.body.querySelectorAll<HTMLButtonElement>('.kui-column-picker__drag');
    expect(handles).toHaveLength(2);
    handles[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(wrapper.emitted('update:columnOrder')?.[0]).toEqual([['amount', 'name']]);
    const search = document.body.querySelector<HTMLInputElement>('.kui-column-picker__search');
    expect(search?.type).toBe('search');
    search!.value = 'сум';
    search!.dispatchEvent(new Event('input', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(document.body.querySelector('.kui-column-picker__drag')).toBeNull();
    expect(document.body.querySelector('.kui-column-picker__footer')).toBeNull();
    wrapper.unmount();
  });

  it('returns focus to the column trigger after Escape', async () => {
    const wrapper = mount(KColumnPicker, {
      attachTo: document.body,
      props: { modelValue: ['name', 'amount'], columnOrder: ['name', 'amount'], options },
    });
    const trigger = wrapper.get<HTMLButtonElement>('.kui-column-picker__trigger');
    await trigger.trigger('click');
    const checkbox = document.body.querySelector<HTMLInputElement>('.kui-column-picker__option input');
    checkbox?.focus();
    checkbox?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(document.body.querySelector('.kui-column-picker__panel')).toBeNull();
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('emits search changes through the toolbar', async () => {
    const wrapper = mount(KTableToolbar, { props: { modelValue: '' } });
    await wrapper.get('input[type="search"]').setValue('чек');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['чек']);
  });

  it('connects the view toggle and exposes card sorting only in card mode', async () => {
    const wrapper = mount(KTableToolbar, {
      props: {
        viewMode: 'table',
        showModeToggle: true,
        cardSortKey: 'name',
        cardSortOptions: [{ value: 'name', label: 'Название' }],
        cardSortLabel: 'Упорядочить карточки',
      },
    });
    expect(wrapper.find('.kui-table-toolbar__card-controls').exists()).toBe(false);
    await wrapper.findAll('.kui-table-view-toggle button')[1].trigger('click');
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['cards']);
    await wrapper.setProps({ viewMode: 'cards' });
    expect(wrapper.get('.kui-table-toolbar__card-controls').text()).toContain('Упорядочить карточки');
  });

  it('renders only the library clear action for a filled search', async () => {
    const wrapper = mount(KTableToolbar, { attachTo: document.body, props: { modelValue: 'чек' } });
    expect(wrapper.get('input[type="search"]').classes()).toContain('kui-table-toolbar__search-input');
    const clearActions = wrapper.findAll('button[aria-label="Очистить поиск"]');
    expect(clearActions).toHaveLength(1);
    await clearActions[0].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['']);
    expect(document.activeElement).toBe(wrapper.get('input[type="search"]').element);
  });
});
