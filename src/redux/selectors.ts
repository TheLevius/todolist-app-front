/// selectors

import {AppStateType} from './store';
import {TodolistDomainType} from './todolist-reducer';

export const todoListSelector = (state: AppStateType, todoListId: string) : TodolistDomainType | null => {
    return state.todolist.filter(t => t.id === todoListId)[0] || null
};

export const todoListsSelector = (state: AppStateType) : TodolistDomainType[] => {
    return state.todolist
};