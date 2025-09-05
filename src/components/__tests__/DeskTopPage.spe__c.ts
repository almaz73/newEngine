import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DeskTopPage from '@/pages/desktop/DeskTopPage.vue'
import ElementPlus from 'element-plus';
import ModalParams from '@/pages/desktop/ModalParams.vue';
import { createPinia, setActivePinia } from 'pinia';

const pinia = createPinia();
setActivePinia(pinia);

describe('DeskTopPage', () => {
    it('Получает ли параметр tel после изменения input', async () => {
      const wrapper = mount(DeskTopPage, {
        global: {
          plugins: [ElementPlus,pinia],
        },});

      const elInput = wrapper.find('input[placeholder="* Основной телефон"]');
      await elInput.setValue('+12312312312');
      const modalParamsWrapper = wrapper.findComponent(ModalParams);
      
      expect(modalParamsWrapper.props().tel).toBe('+12312312312');
    });
    it('Вывод текста', async () => {
      const wrapper = mount(DeskTopPage, {
        global: {
          plugins: [ElementPlus,pinia],
        },});
      console.log(" wrapper.text() = ", wrapper.text())
    });

    it('Скрывается ли поле "Название организации" при нажатии на кнопку "Физ. лицо"', async () => {
      const wrapper = mount(DeskTopPage, {
        global: {
          plugins: [ElementPlus,pinia],
        },
        });

        const buttons = wrapper.findAll('button');
        const individualButton = buttons.find(btn => btn.text() === 'Физ. лицо');
        const entityButton = buttons.find(btn => btn.text() === 'Юр. лицо');
        let inputElement = wrapper.find('input[placeholder="* Название организации"]');
        expect(inputElement.exists()).toBe(false);
        await entityButton.trigger('click')
        inputElement = wrapper.find('input[placeholder="* Название организации"]');
        expect(inputElement.exists()).toBe(true);
        await individualButton.trigger('click')
        inputElement = wrapper.find('input[placeholder="* Название организации"]');
        expect(inputElement.exists()).toBe(false);
    });

  });