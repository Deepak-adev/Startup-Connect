const UI_STATE_KEY = 'startup_connect_ui_state';

interface UIState {
  aguiChatExpanded: boolean;
}

export class UIStateService {
  static getAGUIChatState(): boolean {
    const state = localStorage.getItem(UI_STATE_KEY);
    if (!state) return true; // Default: expanded
    try {
      const parsed = JSON.parse(state) as UIState;
      return parsed.aguiChatExpanded ?? true;
    } catch (error) {
      console.error('Failed to parse UI state:', error);
      return true;
    }
  }

  static setAGUIChatState(expanded: boolean): void {
    const current = this.getAllState();
    current.aguiChatExpanded = expanded;
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(current));
  }

  static getAllState(): UIState {
    const state = localStorage.getItem(UI_STATE_KEY);
    try {
      return state ? JSON.parse(state) : { aguiChatExpanded: true };
    } catch (error) {
      console.error('Failed to parse UI state:', error);
      return { aguiChatExpanded: true };
    }
  }
}
