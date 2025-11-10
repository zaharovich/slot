import './style.css';
import { Application } from '@core/Application';
import { AssetLoader } from '@core/AssetLoader';
import { SlotMachine } from '@game/SlotMachine';

async function init() {
  const app = new Application();
  const canvas = document.createElement('canvas');
  document.querySelector<HTMLDivElement>('#app')!.appendChild(canvas);
  
  await app.init(canvas);
  await AssetLoader.load();
  
  const slotMachine = new SlotMachine();
  app.stage.addChild(slotMachine);
  
  app.ticker.add((ticker) => {
    slotMachine.update(ticker.deltaTime);
  });
}

init().catch(console.error);
