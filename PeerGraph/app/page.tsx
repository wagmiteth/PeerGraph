'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpDown } from 'lucide-react'
import { NeynarSignIn } from '@/components/NeynarSignIn'
import DuneFollowerQuery from '@/components/DuneFollowerQuery'

type Project = {
  id: number
  name: string
  followers: number
}

const initialProjects: Project[] = [
  { id: 1, name: "Arbitrum", followers: 1200 },
  { id: 2, name: "Optimism", followers: 980 },
  { id: 3, name: "Polygon", followers: 1500 },
  { id: 4, name: "Base", followers: 750 },
  { id: 5, name: "StarkNet", followers: 2000 }
]

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [authenticatedUser, setAuthenticatedUser] = useState<{ signerUuid: string; fid: string } | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyUser = async (userData: { signer_uuid: string; fid: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to verify user:', userData);
      
      const response = await fetch('/api/verify-signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signerUuid: userData.signer_uuid,
          fid: userData.fid
        }),
      });
      
      const data = await response.json();
      console.log('Verification API response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Verification request failed');
      }

      setIsVerified(data.verified);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSuccess = async (data: NeynarSignInResponse) => {
    console.log("Sign-in success data:", data);
    
    if (!data.signer_uuid || !data.fid) {
      console.error('Invalid sign-in data received:', data);
      setError('Invalid sign-in data received');
      return;
    }

    setAuthenticatedUser({
      signerUuid: data.signer_uuid,
      fid: data.fid
    });

    await verifyUser({
      signer_uuid: data.signer_uuid,
      fid: data.fid
    });
  };

  const handleSort = () => {
    const sortedProjects = [...projects].sort((a, b) => {
      return sortOrder === 'asc' ? a.followers - b.followers : b.followers - a.followers
    })
    setProjects(sortedProjects)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  // Debug useEffect
  useEffect(() => {
    console.log('Current state:', {
      isVerified,
      authenticatedUser,
      projectsCount: projects.length
    })
  }, [isVerified, authenticatedUser, projects])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Dashboard</h1>
        <div className="flex items-center gap-4">
          {isLoading && <span>Verifying...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {isVerified ? (
            <div className="text-green-600">✓ Verified User (FID: {authenticatedUser?.fid})</div>
          ) : (
            <NeynarSignIn 
              clientId={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!}
              onSuccess={handleSignInSuccess}
              theme="light"
            />
          )}
        </div>
      </div>

      {/* Always show the table for debugging */}
      <div className="mb-4">
        <p>Debug Info:</p>
        <p>Verified: {String(isVerified)}</p>
        <p>User FID: {authenticatedUser?.fid}</p>
        <p>Projects Count: {projects.length}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Project Name</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={handleSort} className="hover:bg-gray-100">
                Peer Followers
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell className="text-right">{project.followers.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <NeynarFollowers /> */}
      <DuneFollowerQuery />
    </div>
  )
}
