import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import KAppShell from '../src/shell/app-shell/KAppShell.vue';

describe('KAppShell', () => {
  it('renders configuration and emits navigation without router coupling', async () => {
    const wrapper = mount(KAppShell, {
      props: {
        brand: { name: 'Продукт', subtitle: 'CRM' },
        navigation: [{ id: 'service', label: 'Сервис' }],
        activeId: 'service',
        title: 'Документы',
        user: { name: 'Иван' },
      },
      slots: { default: '<p>Рабочая область</p>' },
    });
    expect(wrapper.text()).toContain('Продукт');
    expect(wrapper.text()).toContain('Рабочая область');
    expect(wrapper.text()).toContain('Иван');
    await wrapper.get('.kui-app-sidebar__item').trigger('click');
    expect(wrapper.emitted('navigate')?.[0]?.[0]).toMatchObject({ id: 'service' });
  });

  it('renders a visible page header and expands nested navigation', async () => {
    const wrapper = mount(KAppShell, {
      props: {
        brand: { name: 'Продукт', subtitle: 'Сервисы' },
        navigation: [{
          id: 'reports',
          label: 'Отчёты',
          children: [{ id: 'advance', label: 'Авансовые отчёты', hint: 'Расходные документы' }],
        }],
        activeId: '',
        title: 'Главная',
      },
    });

    expect(wrapper.get('.kui-app-topbar').text()).toContain('Главная');
    expect(wrapper.find('.kui-app-sidebar__children').exists()).toBe(false);
    await wrapper.get('.kui-app-sidebar__item').trigger('click');
    expect(wrapper.get('.kui-app-sidebar__children').text()).toContain('Авансовые отчёты');
    await wrapper.get('.kui-app-sidebar__child').trigger('click');
    expect(wrapper.emitted('navigate')?.[0]?.[0]).toMatchObject({ id: 'advance' });
  });

  it('keeps the subsection count visible on a collapsed navigation item', () => {
    const wrapper = mount(KAppShell, {
      props: {
        brand: { name: 'Продукт' },
        navigation: [{
          id: 'reports',
          label: 'Отчёты',
          icon: '▤',
          children: [{ id: 'advance', label: 'Авансовые отчёты' }],
        }],
        activeId: 'advance',
        title: 'Авансовые отчёты',
        sidebarCollapsed: true,
      },
    });

    expect(wrapper.classes()).toContain('kui-app-shell--collapsed');
    expect(wrapper.get('.kui-app-sidebar__caret').text()).toBe('1');
    expect(wrapper.find('.kui-app-sidebar__item-copy').exists()).toBe(false);
  });
});
