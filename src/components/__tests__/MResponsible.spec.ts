// MResponsible.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia, defineStore } from 'pinia'; // Импорт для Pinia
import MResponsible from '@/pages/appeal/appealEditFields/MResponsible.vue'; // Укажите правильный путь

// 1. Создаем моки для Pinia сторов
// Важно: Эти моки должны повторять структуру ваших реальных сторов,
// но их методы могут быть замоканы с помощью vi.fn()
const useMockAppealStore = defineStore('appeal', {
    state: () => ({
        // Имитируем любое состояние, если оно нужно для ваших тестов
        // Например, если getRoles зависит от какого-то состояния в сторе
    }),
    actions: {
        getRoles: vi.fn(), // Мокируем метод getRoles
        changeResponsible: vi.fn(), // Мокируем метод changeResponsible
    },
});

const useMockGlobalStore = defineStore('global', {
    state: () => ({
        isWaiting: false, // Имитируем состояние isWaiting
    }),
    actions: {
        // Если есть другие экшены, их тоже можно мокировать
    },
});


describe('MResponsible', () => {
    let wrapper;
    let mockProps;
    let mockResponsibles;
    let appealStore; // Переменная для доступа к замоканному стору
    let globalStore; // Переменная для доступа к замоканному стору

    beforeEach(() => {
        // 2. Инициализация Pinia перед каждым тестом
        setActivePinia(createPinia());
        appealStore = useMockAppealStore(); // Получаем экземпляр замоканного стора
        globalStore = useMockGlobalStore();



        // Сброс моков и состояний сторов перед каждым тестом
        vi.clearAllMocks(); // Очищаем все вызовы мок-функций

        // Настраиваем поведение замоканных методов сторов
        appealStore.getRoles({
            data: {
                items: [
                    { id: 1, title: 'Менеджер 1' },
                    { id: 2, title: 'Менеджер 2' },
                    { id: 3, title: 'Менеджер 3' },
                ],
            },
        });

        appealStore.changeResponsible(true); // Мокаем успешный ответ

        // Инициализация данных для компонента
        mockResponsibles = [
            { id: 1, title: 'Менеджер 1' },
            { id: 2, title: 'Менеджер 2' },
            { id: 3, title: 'Менеджер 3' },
        ];

        mockProps = {
            appeal: {
                id: 123,
                managerId: null,
                managerName: null,
                workflowLeadType: 1,
            },
        };

        wrapper = mount(MResponsible, {
            props: mockProps,
            global: {
                // Мы уже инициализировали Pinia и моки сторов выше,
                // поэтому здесь не нужно их "provide" или "stub" явно,
                // они будут доступны через импорты useAppealStore/useGlobalStore
                // благодаря setActivePinia.
                stubs: {
                    // Если EditPensilCtrl - это другой ваш компонент, его тоже стоит заглушить
                    EditPensilCtrl: { template: '<button>Edit</button>' },
                    // Заглушки для компонентов Element Plus, чтобы они не мешали
                    'el-select': true,
                    'el-option': true,
                    'el-button': true,
                },
            },
        });

        // После монтирования компонента, мы можем получить доступ к его внутренним реактивным данным
        // через `wrapper.vm` и установить их, если это необходимо для конкретного теста.
        // Это нужно, потому что `responsibles` изначально пустой до вызова `toGetManagers`.
        (wrapper.vm as any).responsibles = mockResponsibles;
    });


    // --- Тесты для toChangeManager ---
    describe('toChangeManager', () => {
        it('должен обновить managerName при выборе существующего менеджера', async () => {
            const selectedId = 2; // ID "Менеджера 2"
            (wrapper.vm as any).toChangeManager(selectedId);

            expect(mockProps.appeal.managerName).toBe('Менеджер 2');
            // Также можно проверить через vm.props
            expect((wrapper.vm as any).props.appeal.managerName).toBe('Менеджер 2');
        });

        // it('должен установить isEditManagerName в false после изменения менеджера', async () => {
        //     (wrapper.vm as any).isEditManagerName = true; // Устанавливаем в true для проверки
        //     const selectedId = 1;
        //     (wrapper.vm as any).toChangeManager(selectedId);
        //
        //     expect((wrapper.vm as any).isEditManagerName).toBe(false);
        // });
        //
        // it('не должен изменять managerName, если выбранный id не найден', async () => {
        //     const initialManagerName = mockProps.appeal.managerName;
        //     const nonExistentId = 999;
        //     (wrapper.vm as any).toChangeManager(nonExistentId);
        //
        //     expect(mockProps.appeal.managerName).toBe(initialManagerName);
        // });
        //
        // it('должен установить isEditManagerName в false, даже если id не найден', async () => {
        //     (wrapper.vm as any).isEditManagerName = true;
        //     const nonExistentId = 999;
        //     (wrapper.vm as any).toChangeManager(nonExistentId);
        //
        //     expect((wrapper.vm as any).isEditManagerName).toBe(false);
        // });
    });

    // --- Тесты для toGetManagers ---
    // describe('toGetManagers', () => {
    //     it('должен вызвать getRoles из appealStore и обновить responsibles', async () => {
    //         // Сбросим responsibles компонента, чтобы убедиться, что они будут обновлены
    //         (wrapper.vm as any).responsibles = [];
    //         // Установим isEditManagerName в false для проверки его установки в true
    //         (wrapper.vm as any).isEditManagerName = false;
    //
    //         await (wrapper.vm as any).toGetManagers();
    //
    //         // Проверяем, что getRoles был вызван с правильным аргументом
    //         expect(appealStore.getRoles).toHaveBeenCalledWith(mockProps.appeal.workflowLeadType);
    //         // Проверяем, что responsibles обновились
    //         expect((wrapper.vm as any).responsibles).toEqual(mockResponsibles); // mockResponsibles уже определен выше
    //         // Проверяем, что isEditManagerName стал true
    //         expect((wrapper.vm as any).isEditManagerName).toBe(true);
    //         // Проверяем, что globalStore.isWaiting корректно установился и сбросился
    //         expect(globalStore.isWaiting).toBe(false);
    //     });
    //
    //     it('должен установить oldResponsibleId на managerId из props', async () => {
    //         mockProps.appeal.managerId = 5; // Устанавливаем managerId для этого теста
    //         // Перемонтируем компонент, чтобы props вступили в силу
    //         wrapper = mount(MResponsible, { props: mockProps });
    //         (wrapper.vm as any).responsibles = mockResponsibles; // Убедимся, что responsibles доступны
    //
    //         await (wrapper.vm as any).toGetManagers();
    //
    //         expect((wrapper.vm as any).oldResponsibleId).toBe(5);
    //     });
    //
    //     it('должен установить globalStore.isWaiting в true, а затем в false', async () => {
    //         // Имитируем задержку для асинхронной операции
    //         appealStore.getRoles.mockImplementationOnce(() => {
    //             return new Promise(resolve => setTimeout(() => resolve({ data: { items: [] } }), 100));
    //         });
    //
    //         const promise = (wrapper.vm as any).toGetManagers();
    //
    //         expect(globalStore.isWaiting).toBe(true); // Должен стать true сразу
    //         await promise; // Дожидаемся завершения асинхронной операции
    //         expect(globalStore.isWaiting).toBe(false); // Должен стать false после
    //     });
    // });
    //
    // // --- Тесты для saveResponsible ---
    // describe('saveResponsible', () => {
    //     it('должен вызвать changeResponsible и сбросить oldResponsibleId, если val true', async () => {
    //         // Установим некоторые значения для теста
    //         (wrapper.vm as any).oldResponsibleId = 1;
    //         mockProps.appeal.managerId = 2; // Предполагаемый новый менеджер
    //
    //         await (wrapper.vm as any).saveResponsible(true);
    //
    //         // Проверяем, что changeResponsible был вызван с правильными аргументами
    //         expect(appealStore.changeResponsible).toHaveBeenCalledWith(mockProps.appeal.id, mockProps.appeal.managerId);
    //         // Проверяем, что oldResponsibleId сброшен
    //         expect((wrapper.vm as any).oldResponsibleId).toBeNull();
    //     });
    //
    //     it('должен вызвать toChangeManager с oldResponsibleId и сбросить oldResponsibleId, если val false', async () => {
    //         const initialOldId = 1;
    //         (wrapper.vm as any).oldResponsibleId = initialOldId;
    //         // Мокируем toChangeManager, так как мы не хотим тестировать ее в этом тесте,
    //         // а хотим убедиться, что она ВЫЗВАНА
    //         const spyToChangeManager = vi.spyOn(wrapper.vm as any, 'toChangeManager');
    //
    //         await (wrapper.vm as any).saveResponsible(false);
    //
    //         // Проверяем, что toChangeManager был вызван с старым ID
    //         expect(spyToChangeManager).toHaveBeenCalledWith(initialOldId);
    //         // Проверяем, что changeResponsible НЕ был вызван
    //         expect(appealStore.changeResponsible).not.toHaveBeenCalled();
    //         // Проверяем, что oldResponsibleId сброшен
    //         expect((wrapper.vm as any).oldResponsibleId).toBeNull();
    //
    //         spyToChangeManager.mockRestore(); // Очищаем шпион
    //     });
    // });
});