const MIN_SALT_SIZE = 16;
const MAX_SALT_SIZE = 24;

function createSalt(minSize: number, maxSize: number): Uint8Array {
  const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  const salt = new Uint8Array(size);
  crypto.getRandomValues(salt);
  return salt;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function getHash(
  username: string,
  password: string,
  saltBytes?: Uint8Array
): Promise<string> {
  if (!saltBytes) {
    saltBytes = createSalt(MIN_SALT_SIZE, MAX_SALT_SIZE);
  }
  const encoder = new TextEncoder()
  const encodedLogin = encoder.encode(`${username}:${password}`);

  const buffer = new Uint8Array(encodedLogin).buffer;
  const hashBuffer = await crypto.subtle.digest('SHA-512', buffer);
  const digest = new Uint8Array(hashBuffer);

  const digestWithSalt = new Uint8Array(digest.length + saltBytes.length);
  digestWithSalt.set(digest);
  digestWithSalt.set(saltBytes, digest.length);

  return bytesToBase64(digestWithSalt);
}