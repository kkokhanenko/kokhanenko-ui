import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import KPagination from '../src/data/pagination/KPagination.vue';

afterEach(() => { document.body.innerHTML = ''; });

describe('KPagination', () => {
  it('navigates and changes page size', async () => {
    const wrapper = mount(KPagination, {
      attachTo: document.body,
      props: { page: 2, totalPages: 10, totalRows: 95, pageSize: 10 },
    });
    await wrapper.get('[aria-label="Следующая страница"]').trigger('click');
    expect(wrapper.emitted('update:page')?.[0]).toEqual([3]);

    await wrapper.get('.kui-select__trigger').trigger('click');
    const option = [...document.body.querySelectorAll<HTMLButtonElement>('.kui-select__option')]
      .find((item) => item.textContent?.trim() === '20');
    option?.click();
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20]);
    wrapper.unmount();
  });

  it('does not render for an empty result', () => {
    const wrapper = mount(KPagination, { props: { page: 1, totalPages: 1, totalRows: 0, pageSize: 10 } });
    expect(wrapper.find('.kui-pagination').exists()).toBe(false);
  });
});
