"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { BetterAuthActionButton } from "@/features/auth/components/better-auth-action-button";
import { authClient } from "@/lib/auth-client";
import { formatDateTime } from "@/lib/utils";
import { Session } from "better-auth";
import { AlertTriangleIcon, MonitorIcon, SmartphoneIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";

export function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const router = useRouter();

  const otherSessions = sessions.filter(
    (session) => session.token !== currentSessionToken
  );
  const currentSession = sessions.find(
    (session) => session.token === currentSessionToken
  );

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-4">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Other Active Sessions</h3>
          {otherSessions.length > 0 && (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={revokeOtherSessions}
              successMessage="All other sessions revoked successfully"
            >
              <AlertTriangleIcon className="size-4 mr-2" />
              Revoke All Other Sessions
            </BetterAuthActionButton>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <MonitorIcon />
                  </EmptyMedia>
                  <EmptyTitle>No other active sessions</EmptyTitle>
                  <EmptyDescription>
                    You don&apos;t have any other active sessions.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard key={session.token} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null)
      return "Unknown device";

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function revokeSession() {
    return authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <SmartphoneIcon />
            ) : (
              <MonitorIcon />
            )}
            <div>
              <p className="text-xs text-muted-foreground">
                Created: {formatDateTime(session.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                Expires: {formatDateTime(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <BetterAuthActionButton
              variant="destructive"
              action={() => revokeSession()}
              successMessage="Session revoked successfully"
            >
              <Trash2Icon />
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}