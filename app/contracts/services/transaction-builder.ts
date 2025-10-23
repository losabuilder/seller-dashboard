import { Call } from 'viem'

/**
 * Transaction builder for composing multicalls
 */
export class TransactionBuilder {
  private calls: Call[] = []

  /**
   * Add a call to the transaction
   */
  addCall(call: Call): TransactionBuilder {
    this.calls.push(call)
    return this
  }

  /**
   * Add multiple calls to the transaction
   */
  addCalls(calls: Call[]): TransactionBuilder {
    this.calls.push(...calls)
    return this
  }

  /**
   * Get all calls
   */
  getCalls(): Call[] {
    return this.calls
  }

  /**
   * Clear all calls
   */
  clear(): TransactionBuilder {
    this.calls = []
    return this
  }
} 