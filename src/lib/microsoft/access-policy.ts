import type { JWTPayload } from "jose";
import { fetchWithTimeout } from "@/lib/http/fetch-with-timeout";
import { getMicrosoftServerConfig } from "./config";

export type PortalAccessDecision = {
  allowed: boolean;
  reason: string;
  matchedBy?: "domain" | "security-group" | "token-groups";
};

function parseCsvEnv(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getPortalAccessPolicy() {
  const { accessPolicy } = getMicrosoftServerConfig();
  return accessPolicy;
}

export function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  return at >= 0 ? email.slice(at + 1).toLowerCase() : "";
}

export function emailMatchesDomain(email: string, domain: string): boolean {
  return emailDomain(email) === domain.toLowerCase().replace(/^@/, "");
}

export function emailMatchesAnyDomain(email: string, domains: string[]): boolean {
  return domains.some((domain) => emailMatchesDomain(email, domain));
}

export function groupsFromIdToken(payload: JWTPayload): string[] {
  if (!Array.isArray(payload.groups)) return [];
  return payload.groups.map((group) => String(group).toLowerCase());
}

export function hasAnyGroup(memberGroupIds: string[], requiredGroupIds: string[]): boolean {
  if (requiredGroupIds.length === 0) return false;
  const required = new Set(requiredGroupIds.map((id) => id.toLowerCase()));
  return memberGroupIds.some((id) => required.has(id.toLowerCase()));
}

async function fetchTransitiveGroupIds(accessToken: string): Promise<string[]> {
  const url =
    "https://graph.microsoft.com/v1.0/me/transitiveMemberOf/microsoft.graph.group?$select=id&$top=999";

  const response = await fetchWithTimeout(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
    timeoutMs: 8_000,
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { value?: Array<{ id?: string }> };
  return (data.value ?? [])
    .map((group) => group.id?.toLowerCase())
    .filter((id): id is string => Boolean(id));
}

export async function evaluateStudentPortalAccess(input: {
  email: string;
  idTokenPayload: JWTPayload;
  accessToken: string;
}): Promise<PortalAccessDecision> {
  const policy = getPortalAccessPolicy();
  const email = input.email.toLowerCase();

  const tokenGroupIds = groupsFromIdToken(input.idTokenPayload);

  if (hasAnyGroup(tokenGroupIds, policy.blockedSecurityGroupIds)) {
    return {
      allowed: false,
      reason:
        "Your Microsoft account is assigned to a staff security group. Use the admin control panel instead of the student portal.",
    };
  }

  // Fast path: official student email domains skip the Graph group lookup on login.
  if (emailMatchesAnyDomain(email, policy.allowedStudentDomains)) {
    return {
      allowed: true,
      reason: "Allowed by institutional email domain.",
      matchedBy: "domain",
    };
  }

  const needsGraphGroupLookup =
    (policy.studentSecurityGroupIds.length > 0 && tokenGroupIds.length === 0) ||
    (policy.blockedSecurityGroupIds.length > 0 && tokenGroupIds.length === 0);

  const memberGroupIds = needsGraphGroupLookup
    ? [...new Set([...tokenGroupIds, ...(await fetchTransitiveGroupIds(input.accessToken))])]
    : tokenGroupIds;

  if (hasAnyGroup(memberGroupIds, policy.blockedSecurityGroupIds)) {
    return {
      allowed: false,
      reason:
        "Your Microsoft account is assigned to a staff security group. Use the admin control panel instead of the student portal.",
    };
  }

  const blockedDomainWithoutGroup =
    policy.blockedEmailDomains.length > 0 &&
    emailMatchesAnyDomain(email, policy.blockedEmailDomains) &&
    !hasAnyGroup(memberGroupIds, policy.studentSecurityGroupIds);

  if (blockedDomainWithoutGroup) {
    return {
      allowed: false,
      reason: `Student portal sign-in requires an official school email (for example @${policy.allowedStudentDomains[0] ?? "student.mbsnm.org"}) or membership in an approved student security group.`,
    };
  }

  if (hasAnyGroup(memberGroupIds, policy.studentSecurityGroupIds)) {
    return {
      allowed: true,
      reason: "Allowed by Azure AD student security group membership.",
      matchedBy: memberGroupIds.some((id) => tokenGroupIds.includes(id))
        ? "token-groups"
        : "security-group",
    };
  }

  const domainHint =
    policy.allowedStudentDomains.length > 0
      ? `@${policy.allowedStudentDomains.join(", @")}`
      : "@student.mbsnm.org";

  return {
    allowed: false,
    reason: `Access denied. Sign in with an official MBSNM student account (${domainHint}) or ask ICT to add you to the student security group.`,
  };
}

export function formatAllowedDomainsForDisplay(): string {
  const { allowedStudentDomains } = getPortalAccessPolicy();
  if (allowedStudentDomains.length === 0) return "@student.mbsnm.org";
  return allowedStudentDomains.map((domain) => `@${domain}`).join(", ");
}
