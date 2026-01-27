'use client'

import { BookOpen } from 'lucide-react'
import { GuidelineCard } from '@/components/community/guideline-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function GuidelinesPage() {
    const categories = ['all', 'society', 'security', 'amenities']

    // Fetch guidelines from API
    const { data: guidelines = [], isLoading, error } = useQuery({
        queryKey: ['guidelines'],
        queryFn: residentService.getGuidelines
    })

    if (error) {
        toast.error('Failed to load guidelines')
    }

    return (
        <div className="space-y-6 container mx-auto p-6 max-w-5xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    Community Guidelines
                </h1>
                <p className="text-muted-foreground">
                    Please read and acknowledge the society rules and policies to ensure a harmonious living environment.
                </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-lg">
                    {categories.map(cat => (
                        <TabsTrigger key={cat} value={cat} className="capitalize px-6">
                            {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {categories.map(category => (
                    <TabsContent key={category} value={category} className="space-y-4 mt-6">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-6 border rounded-lg">
                                        <Skeleton className="h-6 w-1/3 mb-2" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3 mt-2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {guidelines
                                    .filter((g: any) => category === 'all' || g.category.toLowerCase() === category)
                                    .map((guideline: any) => (
                                        <GuidelineCard key={guideline.id} guideline={guideline} />
                                    ))}
                                {guidelines.filter((g: any) => category === 'all' || g.category.toLowerCase() === category).length === 0 && (
                                    <div className="text-center py-10 text-gray-500">
                                        No guidelines found in this category.
                                    </div>
                                )}
                            </>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
