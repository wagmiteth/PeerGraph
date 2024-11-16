'use client'

import { useEffect, useState } from 'react';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

interface User {
  fid: number;
  username: string;
  displayName?: string;
}

export function NeynarFollowers() {
  const [mutualFollowers, setMutualFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowerData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
      
      if (!apiKey) {
        setError('Neynar API key is missing from environment variables');
        setLoading(false);
        return;
      }

      try {
        const client = new NeynarAPIClient(apiKey);

        const fetchAllFollowing = async (fid: number) => {
          let cursor: string | null = "";
          let users: User[] = [];
          do {
            const result = await client.fetchUserFollowing(fid, {
              limit: 150,
              cursor,
            });
            users = users.concat(result.result.users);
            cursor = result.result.next.cursor;
          } while (cursor !== "" && cursor !== null);

          return users;
        };

        const fetchAllFollowers = async (fid: number) => {
          let cursor: string | null = "";
          let users: User[] = [];
          do {
            const result = await client.fetchUserFollowers(fid, {
              limit: 150,
              cursor,
            });
            users = users.concat(result.result.users);
            cursor = result.result.next.cursor;
          } while (cursor !== "" && cursor !== null);

          return users;
        };

        const rishFID = 194;
        const mananFID = 191;

        const [rishFollowings, mananFollowers] = await Promise.all([
          fetchAllFollowing(rishFID),
          fetchAllFollowers(mananFID)
        ]);

        const mutualFollowings = rishFollowings.filter((following) =>
          mananFollowers.some((follower) => follower.fid === following.fid)
        );

        setMutualFollowers(mutualFollowings);
      } catch (err) {
        console.error('Neynar API Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowerData();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 text-red-500 border border-red-200 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Mutual Followers</h2>
      <div className="grid gap-4">
        {mutualFollowers.map((user) => (
          <div key={user.fid} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{user.displayName || user.username}</h3>
            <p className="text-sm text-gray-500">FID: {user.fid}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
