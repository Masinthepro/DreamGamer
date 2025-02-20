export class AudioManager {
  private static instance: AudioManager;
  private context: AudioContext;
  private sounds: Map<string, AudioBuffer>;
  private musicPlaying: boolean = false;

  private constructor() {
    this.context = new AudioContext();
    this.sounds = new Map();
    this.loadSounds();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async loadSounds() {
    const soundUrls = {
      shoot: "https://assets.codepen.io/123/shoot.wav",
      explosion: "https://assets.codepen.io/123/explosion.wav",
      bgMusic: "https://assets.codepen.io/123/space-music.mp3"
    };

    for (const [name, url] of Object.entries(soundUrls)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.sounds.set(name, audioBuffer);
      } catch (error) {
        console.error(`Failed to load sound: ${name}`, error);
      }
    }
  }

  playSound(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      const source = this.context.createBufferSource();
      source.buffer = sound;
      source.connect(this.context.destination);
      source.start(0);
    }
  }

  playMusic() {
    if (!this.musicPlaying) {
      const music = this.sounds.get("bgMusic");
      if (music) {
        const source = this.context.createBufferSource();
        source.buffer = music;
        source.loop = true;
        source.connect(this.context.destination);
        source.start(0);
        this.musicPlaying = true;
      }
    }
  }

  stopMusic() {
    this.context.close();
    this.context = new AudioContext();
    this.musicPlaying = false;
  }
}
