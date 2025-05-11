export function formatSAFUri(uri?: string, fallback?: string) {
  return decodeURIComponent(
    uri?.replace("content://com.android.externalstorage.documents/tree/primary%3A", "") ?? fallback ?? "",
  );
}
