'use client'

import { useState } from 'react'
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
  { id: 5, name: "StarkNet", followers: 2000 },
  { id: 6, name: "zkSync", followers: 1100 },
  { id: 7, name: "Mantle", followers: 890 }
]

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [authenticatedUser, setAuthenticatedUser] = useState<{ signerUuid: string; fid: string } | null>(null)

  const handleSort = () => {
    const sortedProjects = [...projects].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.followers - b.followers
      } else {
        return b.followers - a.followers
      }
    })
    setProjects(sortedProjects)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const handleSignInSuccess = (data: { signerUuid: string; fid: string }) => {
    console.log("Sign-in success:", data)
    setAuthenticatedUser(data)
    // Add your login logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <NeynarSignIn 
          clientId={process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!}
          onSuccess={handleSignInSuccess}
          theme="light"
        />
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
    </div>
  )
}