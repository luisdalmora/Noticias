import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export class StorageService {
  constructor() {
    // Resolve o caminho de 'data' sempre partindo da raiz do projeto onde foi executado
    this.dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      logger.info(`Criado diretório de dados: ${this.dataDir}`);
    }
  }

  saveData(data) {
    try {
      const today = new Date();
      // YYYY-MM-DD
      const dateStr = today.toISOString().split('T')[0];
      
      const dailyPath = path.join(this.dataDir, `${dateStr}.json`);
      const latestPath = path.join(this.dataDir, 'latest.json');

      const jsonStr = JSON.stringify(data, null, 2);

      fs.writeFileSync(dailyPath, jsonStr, 'utf8');
      fs.writeFileSync(latestPath, jsonStr, 'utf8');
      
      logger.info(`Dados salvos em ${dailyPath} e latest.json`);
    } catch (error) {
      logger.error('Erro ao salvar dados no StorageService:', error);
      throw error;
    }
  }

  getLatestData() {
    try {
      const latestPath = path.join(this.dataDir, 'latest.json');
      if (fs.existsSync(latestPath)) {
        return JSON.parse(fs.readFileSync(latestPath, 'utf8'));
      }
      return [];
    } catch (error) {
      logger.error('Erro ao ler os dados no StorageService:', error);
      return [];
    }
  }
}

// Exporta uma instância global (Singleton pattern simples)
export const storage = new StorageService();
