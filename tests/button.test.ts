import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import KButton from '../src/controls/button/KButton.vue';

describe('KButton', () => {
  it('preserves native click and exposes loading state', async () => {
    const wrapper = mount(KButton, { props: { loading: false }, slots: { default: 'Сохранить' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    await wrapper.setProps({ loading: true });
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
