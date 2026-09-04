import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import KTabs from '../src/controls/tabs/KTabs.vue';

describe('KTabs', () => {
  it('selects a tab and supports arrow navigation', async () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { callback(0); return 1; });
    const wrapper = mount(KTabs, {
      props: {
        modelValue: 'one',
        options: [{ value: 'one', label: 'Первый' }, { value: 'two', label: 'Второй' }],
      },
    });
    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two']);
    vi.unstubAllGlobals();
  });
});
