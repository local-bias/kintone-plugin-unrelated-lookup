import { ReactElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

export class ComponentManager {
  private static instance: ComponentManager;
  #debug: boolean = false;
  #components: Map<string, { root: Root; rootElement: HTMLElement; parentElement: HTMLElement }> =
    new Map();

  private constructor() {}

  public static getInstance(): ComponentManager {
    if (!ComponentManager.instance) {
      ComponentManager.instance = new ComponentManager();
    }
    return ComponentManager.instance;
  }

  public renderComponent(params: {
    elementId: string;
    component: ReactElement;
    parentElement?: HTMLElement;
    onRootElementReady?: (element: HTMLElement) => void;
  }): void {
    const { elementId, component, parentElement = document.body } = params;
    let rootElement = document.getElementById(elementId);

    if (!rootElement) {
      if (this.#debug && this.#components.has(elementId)) {
        console.warn(
          `%c[ComponentManager] %c⚠ The element with id ${elementId} might have been removed from the DOM. Recreating it.`,
          'color: #0d9488;',
          'color: #6b7280;'
        );
      }
      rootElement = document.createElement('div');
      rootElement.id = elementId;

      parentElement.appendChild(rootElement);
    } else {
      if (this.#debug) {
        console.info(
          `%c[ComponentManager] %cReusing the element with id ${elementId}`,
          'color: #0d9488;',
          'color: #6b7280;'
        );
      }
    }

    if (params.onRootElementReady) {
      params.onRootElementReady(rootElement);
    }

    let componentData = this.#components.get(elementId);

    if (!componentData || !rootElement.isConnected) {
      const root = createRoot(rootElement);
      root.render(component);
      this.#components.set(elementId, { root, rootElement, parentElement });
    } else {
      const parent = componentData.parentElement;
      if (!parent.isConnected) {
        const newParent = parentElement;
        newParent.appendChild(componentData.rootElement);
        componentData.parentElement = newParent;
      }
      componentData.root.render(component);
    }
  }

  public set debug(value: boolean) {
    this.#debug = value;
  }
}
