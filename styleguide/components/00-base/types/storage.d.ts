export interface StorageData {
  [hostname: string]: {
    [url: string]: {
      runner: string; // Chaîne JSON stringifiée pour les résultats automatiques
      user?: string;  // Chaîne JSON stringifiée pour les résultats modifiés par l'utilisateur (optionnel)
    };
  };
}
