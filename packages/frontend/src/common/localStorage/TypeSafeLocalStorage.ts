// ESLint の追加ルールにより、本ファイル以外からの localstorage の参照を禁止しています。 (see: .eslintrc.json)
/* eslint-disable no-restricted-syntax */

/** LocalStorage の値をタイプセーフに扱うためのラッパーです。
 * 参考: https://zenn.dev/jiftechnify/articles/2489f4103918a2 */

import { strCodec } from '~/common/localStorage/codec/strCodec';

/** Storageの基本機能を抽象したI/F */
export interface BaseStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/** 型Tの値と文字列との間の相互変換方法を規定するオブジェクトのI/F */
export interface Codec<T> {
  encode: (t: T) => string;
  decode: (s: string) => T;
}

/** キーと、それに紐つく値を処理するCodecの対応関係の型 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StorageCodecSpec = Record<string, Codec<any>>;

/** StorageCodecをとり、利用可能なキーの集合をunion型として返す型関数 */
type StorageKeys<Spec extends StorageCodecSpec> = {
  [K in keyof Spec]: K extends string ? K : never;
}[keyof Spec];

/** StorageCodecと1つのキーをとり、そのキーに紐つく値の型を返す型関数 */
type StorageValTypeOf<Spec extends StorageCodecSpec, K extends StorageKeys<Spec>> = Spec[K] extends Codec<infer T>
  ? T
  : never;

/** 型安全StorageラッパーのAPI */
interface TypedStorage<Spec extends StorageCodecSpec> {
  get<K extends StorageKeys<Spec>>(key: K): StorageValTypeOf<Spec, K> | null;
  set<K extends StorageKeys<Spec>>(key: K, value: StorageValTypeOf<Spec, K>): void;
  remove(key: StorageKeys<Spec>): void;
}

/** 型安全Storageラッパーのコンストラクタ */
const createTypedStorage = <Spec extends StorageCodecSpec>(
  codecs: Spec,
  baseStorage: BaseStorage,
): TypedStorage<Spec> => {
  return Object.freeze({
    get<K extends StorageKeys<Spec>>(key: K): StorageValTypeOf<Spec, K> | null {
      const rawVal = baseStorage.get(key);
      if (rawVal === null) {
        return null;
      }
      const codec = codecs[key] as Codec<StorageValTypeOf<Spec, K>>;

      return codec.decode(rawVal);
    },
    set<K extends StorageKeys<Spec>>(key: K, value: StorageValTypeOf<Spec, K>): void {
      const codec = codecs[key] as Codec<StorageValTypeOf<Spec, K>>;
      const encoded = codec.encode(value);
      baseStorage.set(key, encoded);
    },
    remove(key: StorageKeys<Spec>): void {
      baseStorage.remove(key);
    },
  });
};

export const typedStorage = createTypedStorage(
  {
    accessToken: strCodec,
    refreshToken: strCodec,
  },
  {
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
  },
);
