class GameStateManager {
    private static instance: GameStateManager;
    private state: string;
  
    private constructor() {
      this.state = "GAME_INIT";  // İlk durum
    }
  
    public static getInstance(): GameStateManager {
      if (!GameStateManager.instance) {
        GameStateManager.instance = new GameStateManager();
      }
      return GameStateManager.instance;
    }
  
    public getState(): string {
      return this.state;
    }
  
    public setState(state: string): void {
      this.state = state;
    }
  }
  