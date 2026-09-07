import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import KDisclosure from '../src/controls/disclosure/KDisclosure.vue';

describe('KDisclosure', () => {
  it('renders a native controlled disclosure and emits its next state', async () => {
    const wrapper = mount(KDisclosure, {
      props: {
        modelValue: false,
        title: 'Текст промта',
        description: 'Инструкция модели',
      },
      slots: { default: '<p>Содержимое</p>' },
    });

    const details = wrapper.get('details');
    expect(details.attributes()).not.toHaveProperty('open');
    expect(wrapper.text()).toContain('Текст промта');
    expect(wrapper.text()).toContain('Инструкция модели');
    expect(wrapper.text()).toContain('Содержимое');

    await wrapper.get('summary').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
    expect(wrapper.emitted('toggle')?.at(-1)).toEqual([true]);
  });

  it('reflects programmatic state and supports named slots', async () => {
    const wrapper = mount(KDisclosure, {
      props: { modelValue: true, title: 'Fallback' },
      slots: {
        title: '<span>Свой заголовок</span>',
        description: '<span>Своё описание</span>',
      },
    });

    expect(wrapper.get('details').attributes()).toHaveProperty('open');
    expect(wrapper.text()).toContain('Свой заголовок');
    expect(wrapper.text()).toContain('Своё описание');

    await wrapper.setProps({ modelValue: false });
    expect(wrapper.get('details').attributes()).not.toHaveProperty('open');
  });
});
