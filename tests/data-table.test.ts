import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import KDataTable from '../src/data/data-table/KDataTable.vue';

describe('KDataTable', () => {
  const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'amount', label: 'Сумма', align: 'end' as const },
  ];
  const rows = [
    { id: 1, name: 'Первый', amount: 100 },
    { id: 2, name: 'Второй', amount: 200 },
  ];

  it('renders cells through defaults and named slots', () => {
    const wrapper = mount(KDataTable, {
      props: { columns, rows, caption: 'Документы' },
      slots: { 'cell-name': '<template #cell-name="{ value }"><strong>{{ value }}</strong></template>' },
    });
    expect(wrapper.get('caption').text()).toBe('Документы');
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    expect(wrapper.get('tbody strong').text()).toBe('Первый');
  });

  it('emits sorting and selection updates', async () => {
    const wrapper = mount(KDataTable, { props: { columns, rows, selectable: true, selectedKeys: [] } });
    await wrapper.get('.kui-data-table__sort').trigger('click');
    expect(wrapper.emitted('sort')?.[0]).toEqual(['name']);
    await wrapper.findAll('tbody input[type="checkbox"]')[0].setValue(true);
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([[1]]);
  });

  it('supports card mode and empty state', () => {
    const cards = mount(KDataTable, { props: { columns, rows, mode: 'cards' } });
    expect(cards.classes()).toContain('kui-data-table--cards');
    expect(cards.get('tbody td').attributes('data-label')).toBe('Название');
    expect(cards.get('tbody td .kui-data-table__cell-content').text()).toBe('Первый');

    const empty = mount(KDataTable, { props: { columns, rows: [], emptyText: 'Пока пусто' } });
    expect(empty.get('.kui-data-table__empty').text()).toBe('Пока пусто');
  });

  it('changes column width from the keyboard', async () => {
    const wrapper = mount(KDataTable, { props: { columns, rows, resizable: true, columnWidths: { name: 120 } } });
    await wrapper.get('.kui-data-table__resizer').trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:columnWidths')?.[0]).toEqual([{ name: 130 }]);
  });

  it('renders declarative filters and emits a complete filter map', async () => {
    const filterColumns = [{ key: 'date', label: 'Дата', filter: { type: 'date-range' as const, label: 'Период' } }];
    const wrapper = mount(KDataTable, { attachTo: document.body, props: { columns: filterColumns, rows: [], filters: { state: ['ready'] } } });
    await wrapper.get('button[aria-label="Период"]').trigger('click');
    const from = document.body.querySelector<HTMLInputElement>('.kui-table-filter__panel input[type="date"]');
    expect(from).not.toBeNull();
    from!.value = '2026-09-01';
    from!.dispatchEvent(new Event('input', { bubbles: true }));
    expect(wrapper.emitted('update:filters')?.[0]).toEqual([{ state: ['ready'], date: { from: '2026-09-01', to: '' } }]);
    wrapper.unmount();
  });

  it('shows a count and keeps a table multi-select filter open', async () => {
    const filterColumns = [{
      key: 'state',
      label: 'Проверка',
      filter: {
        type: 'multi-select' as const,
        options: [
          { value: 'ready', label: 'Готово' },
          { value: 'review', label: 'Проверить' },
          { value: 'error', label: 'Ошибка' },
        ],
      },
    }];
    const wrapper = mount(KDataTable, {
      attachTo: document.body,
      props: { columns: filterColumns, rows: [], filters: { state: [] } },
    });
    const trigger = wrapper.get('button[aria-label="Проверка"]');
    expect(trigger.text()).toContain('Проверка');
    expect(trigger.get('.kui-table-filter__count').text()).toBe('3');

    await trigger.trigger('click');
    const items = document.body.querySelectorAll<HTMLButtonElement>('.kui-select__option');
    expect(items[0].textContent).toContain('Все');
    items[2].click();
    await nextTick();

    expect(wrapper.emitted('update:filters')?.at(-1)).toEqual([{ state: ['ready', 'error'] }]);
    expect(document.body.querySelector('.kui-select__panel')).not.toBeNull();
    wrapper.unmount();
  });

  it('only treats rows as interactive when explicitly enabled', async () => {
    const passive = mount(KDataTable, { props: { columns, rows } });
    await passive.get('tbody tr').trigger('click');
    expect(passive.emitted('rowClick')).toBeUndefined();
    expect(passive.get('tbody tr').classes()).not.toContain('kui-data-table__row--clickable');

    const interactive = mount(KDataTable, { props: { columns, rows, rowClickable: true } });
    await interactive.get('tbody tr').trigger('click');
    expect(interactive.emitted('rowClick')?.[0]).toEqual([rows[0]]);
  });
});
