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

type Project = {
  id: number
  name: string
  followers: number
}

const initialProjects: Project[] = [
  { id: 1, name: "Project Alpha", followers: 1200 },
  { id: 2, name: "Project Beta", followers: 980 },
  { id: 3, name: "Project Gamma", followers: 1500 },
  { id: 4, name: "Project Delta", followers: 750 },
  { id: 5, name: "Project Epsilon", followers: 2000 },
  { id: 6, name: "Project Zeta", followers: 1100 },
  { id: 7, name: "Project Eta", followers: 890 },
  { id: 8, name: "Project Theta", followers: 1300 },
  { id: 9, name: "Project Iota", followers: 670 },
  { id: 10, name: "Project Kappa", followers: 1800 },
]

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <Button variant="outline" className="bg-white text-black border-black hover:bg-gray-100">
          Farcaster Login
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Project Name</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={handleSort} className="hover:bg-gray-100">
                Followers
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