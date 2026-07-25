/**
 * Integer encoding helpers exported from the package root.
 * @module Integer utilities
 */
import { Buffer } from "buffer";
import { InvalidBufferLengthError, U64OverflowError } from "./error";
/** Unsigned 32-bit integer wrapper for SPL Name Service instruction encoding. */
export class Numberu32 {
  /** Wrapped unsigned integer value. */
  value: bigint;

  constructor(value: number | string | bigint) {
    this.value = BigInt(value);
  }

  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = Buffer.alloc(4);
    a.writeUInt32LE(Number(this.value));
    return a;
  }

  /**
   * Construct a Numberu32 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Numberu32 {
    if (buffer.length !== 4) {
      throw new InvalidBufferLengthError(
        `Invalid buffer length: ${buffer.length}`,
      );
    }

    const value = BigInt(buffer.readUInt32LE(0));
    return new Numberu32(value);
  }

  toNumber(): number {
    return Number(this.value);
  }

  toString(): string {
    return String(this.value);
  }
}

/** Unsigned 64-bit integer wrapper for SPL Name Service instruction encoding. */
export class Numberu64 {
  /** Wrapped unsigned integer value. */
  value: bigint;

  constructor(value: number | string | bigint) {
    this.value = BigInt(value);
  }

  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = Buffer.alloc(8);
    a.writeBigUInt64LE(this.value);
    return a;
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Numberu64 {
    if (buffer.length !== 8) {
      new U64OverflowError(`Invalid buffer length: ${buffer.length}`);
    }

    const value = buffer.readBigUInt64LE(0);
    return new Numberu64(value);
  }

  toNumber(): number {
    return Number(this.value);
  }

  toString(): string {
    return String(this.value);
  }
}
