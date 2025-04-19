/**
 * Unified LLM interface for cross-platform use
 */
import { isPlatform } from './platform';

export interface LLMConfig {
  model: string;           // Model name
  temperature?: number;    // Randomness (0-1)
  maxTokens?: number;      // Maximum tokens to generate
  systemPrompt?: string;   // System prompt for chat models
}

export interface LLMResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class LLMService {
  private modelLoaded = false;
  private webLLM: any = null;
  private config: LLMConfig = {
    model: 'tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
    temperature: 0.7,
    maxTokens: 512,
    systemPrompt: 'You are a helpful assistant.'
  };

  constructor() {
    // Initial setup
    this.initOnStart();
  }

  private async initOnStart() {
    // For Electron, pre-initialize the bridge if needed
    if (isPlatform('electron') && (window as any).electronAPI?.initLLM) {
      try {
        await (window as any).electronAPI.initLLM(this.config);
      } catch (error) {
        console.warn('LLM initialization deferred:', error);
      }
    }
  }

  private async initPlatformImplementation() {
    if (isPlatform('electron')) {
      // For Electron, use IPC to communicate with the main process
      if ((window as any).electronAPI?.initLLM) {
        await (window as any).electronAPI.initLLM(this.config);
      } else {
        console.warn('Electron LLM API not available');
        // Fall back to web implementation
        await this.initWebImplementation();
      }
    } else if (isPlatform('capacitor')) {
      // For Capacitor, use the plugin if available
      try {
        // Dynamic import to support tree-shaking
        const { Capacitor } = await import('@capacitor/core');
        // Capacitor plugins would be checked here in a real implementation
        console.warn('Capacitor LLM plugin not available yet');
        await this.initWebImplementation();
      } catch (error) {
        console.error('Error initializing Capacitor LLM:', error);
        await this.initWebImplementation();
      }
    } else {
      // Web implementation
      await this.initWebImplementation();
    }
    
    this.modelLoaded = true;
  }
  
  private async initWebImplementation() {
    try {
      // Dynamic import to avoid loading web-llm when not needed
      // This would be replaced with the actual web-llm package in a real implementation
      console.log('Initializing web LLM implementation (stub)');
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This is a stub - in a real implementation, you would:
      // const { WebLLM } = await import('@mlc-ai/web-llm');
      // this.webLLM = new WebLLM();
      // await this.webLLM.loadModel(this.config.model);
      
      this.webLLM = {
        generate: async (prompt: string, options: any) => {
          console.log('Web LLM generate called with:', prompt, options);
          return {
            text: `[Web LLM response to: ${prompt}]`,
            prompt_tokens: prompt.length / 4,
            completion_tokens: 20,
            total_tokens: prompt.length / 4 + 20
          };
        },
        chat: async (messages: ChatMessage[], options: any) => {
          console.log('Web LLM chat called with:', messages, options);
          const lastMsg = messages[messages.length - 1];
          return {
            text: `[Web LLM response to: ${lastMsg.content}]`,
            prompt_tokens: lastMsg.content.length / 4,
            completion_tokens: 20,
            total_tokens: lastMsg.content.length / 4 + 20
          };
        }
      };
    } catch (error) {
      console.error('Failed to initialize web LLM:', error);
      throw error;
    }
  }

  async loadModel(config: Partial<LLMConfig>): Promise<boolean> {
    this.config = { ...this.config, ...config };
    
    try {
      if (isPlatform('electron') && (window as any).electronAPI?.loadModel) {
        const result = await (window as any).electronAPI.loadModel(this.config.model);
        this.modelLoaded = result.success;
        return result.success;
      } else if (isPlatform('capacitor')) {
        // Placeholder for Capacitor implementation
        console.log('Capacitor loadModel called (stub)');
      }
      
      // Fall back to web implementation
      await this.initWebImplementation();
      this.modelLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to load model:', error);
      return false;
    }
  }

  async generate(prompt: string): Promise<LLMResponse> {
    if (!this.modelLoaded) {
      await this.initPlatformImplementation();
    }

    try {
      if (isPlatform('electron') && (window as any).electronAPI?.generate) {
        return await (window as any).electronAPI.generate(prompt, this.config);
      } else if (isPlatform('capacitor')) {
        // Capacitor implementation would go here in a real app
        console.log('Capacitor generate called (stub)');
      }
      
      // Fall back to web implementation
      if (!this.webLLM) {
        await this.initWebImplementation();
      }
      
      const result = await this.webLLM.generate(prompt, {
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      });
      
      return {
        text: result.text,
        usage: {
          promptTokens: result.prompt_tokens,
          completionTokens: result.completion_tokens,
          totalTokens: result.total_tokens
        }
      };
    } catch (error) {
      console.error('Generation error:', error);
      return {
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error during generation'}`,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        }
      };
    }
  }

  async chat(messages: ChatMessage[]): Promise<LLMResponse> {
    if (!this.modelLoaded) {
      await this.initPlatformImplementation();
    }

    // System prompt handling
    if (this.config.systemPrompt && messages.length > 0 && messages[0].role !== 'system') {
      messages = [{ role: 'system', content: this.config.systemPrompt }, ...messages];
    }

    try {
      if (isPlatform('electron') && (window as any).electronAPI?.chat) {
        return await (window as any).electronAPI.chat(messages, this.config);
      } else if (isPlatform('capacitor')) {
        // Capacitor implementation would go here in a real app
        console.log('Capacitor chat called (stub)');
      }
      
      // Fall back to web implementation
      if (!this.webLLM) {
        await this.initWebImplementation();
      }
      
      const result = await this.webLLM.chat(messages, {
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      });
      
      return {
        text: result.text,
        usage: {
          promptTokens: result.prompt_tokens,
          completionTokens: result.completion_tokens,
          totalTokens: result.total_tokens
        }
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error during chat'}`,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        }
      };
    }
  }
}

// Export a singleton instance
export const llmService = new LLMService();