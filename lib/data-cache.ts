type CacheTag = "user" | "organization";

export function getGlobalTag(tag: CacheTag) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CacheTag, id: string) {
  return `id:${tag}-${id}` as const;
}

export function getOrganizationTag(tag: CacheTag, organizationId: string) {
  return `organization:${tag}-${organizationId}` as const;
}

export function getOrganizationIdTag(
  tag: CacheTag,
  organizationId: string,
  id: string
) {
  return `organization:${tag}-${organizationId}-${id}` as const;
}
