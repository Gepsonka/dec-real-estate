export type WalletAddress = `0x${string}`;

export class ErrorWithContext extends Error {
  constructor(message: string, public context: any) {
    super(message);
  }
}

// Makes mongo collections clearable, for development purposes!
export interface Clearable {
  clearCollection(): Promise<void>;
}
