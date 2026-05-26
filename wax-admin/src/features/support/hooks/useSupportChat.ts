import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import type { HubConnection } from '@microsoft/signalr';
import { env } from '@/config/env';
import { queryKeys } from '@/lib/queryKeys';
import type { CommentDto } from '@/features/support/types/support';

export const useSupportChat = (ticketId: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    let stopped = false;

    queryClient.setQueryData<CommentDto[]>(queryKeys.support.comments(ticketId), (old) => old ?? []);

    const connection = new HubConnectionBuilder()
      .withUrl(`${env.hubUrl}?ticketId=${ticketId}`, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // El backend puede devolver los comentarios agrupados por autor en vez de
    // cronológicamente; los ordenamos por fecha de creación para reflejar la conversación real.
    const byCreatedAt = (a: CommentDto, b: CommentDto) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    connection.on('LoadComments', (loaded: CommentDto[]) => {
      if (stopped) return;
      queryClient.setQueryData<CommentDto[]>(
        queryKeys.support.comments(ticketId),
        [...loaded].sort(byCreatedAt),
      );
    });

    connection.on('CommentAdded', (comment: CommentDto) => {
      if (stopped) return;
      queryClient.setQueryData<CommentDto[]>(
        queryKeys.support.comments(ticketId),
        (prev) => {
          if (!prev) return [comment];
          if (prev.some((c) => c.id === comment.id)) return prev;
          return [...prev, comment].sort(byCreatedAt);
        },
      );
    });

    connection.onreconnecting(() => {
      if (!stopped) setIsConnected(false);
    });
    connection.onreconnected(() => {
      if (!stopped) setIsConnected(true);
    });
    connection.onclose(() => {
      if (!stopped) setIsConnected(false);
    });

    connection
      .start()
      .then(() => {
        if (!stopped) setIsConnected(true);
      })
      .catch(() => {
        // Expected in React 18 Strict Mode — first mount's connection
        // gets stopped during negotiation when cleanup runs immediately.
        if (!stopped) setIsConnected(false);
      });

    return () => {
      stopped = true;
      connection.stop();
      queryClient.removeQueries({ queryKey: queryKeys.support.comments(ticketId) });
    };
  }, [ticketId, queryClient]);

  const sendComment = useCallback(
    async (body: string) => {
      const connection = connectionRef.current;
      if (!connection || connection.state !== HubConnectionState.Connected) return;
      await connection.invoke('SendComment', { body, ticketId });
    },
    [ticketId],
  );

  return { isConnected, sendComment };
};
