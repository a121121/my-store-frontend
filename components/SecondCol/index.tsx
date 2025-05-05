"use client"

import { cn } from "@/lib/utils"
import { useRegion } from "@/providers/region"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const SecondCol = () => {
    const { region, regions, setRegion } = useRegion()

    return (
        <div className={cn(
            "flex flex-col justify-center items-center gap-6",
            "lg:w-1/2 w-full"
        )}>
            <div className="flex flex-col justify-center gap-1">
                <h1 className="text-muted-foreground text-xl font-bold">
                    Sunglee Baby
                </h1>
                <span className="text-xs text-muted-foreground">
                    Stackwise Studio
                </span>
            </div>
            <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">
                    Region:
                </span>
                <Select
                    value={region?.id}
                    onValueChange={(value) => {
                        const selectedRegion = regions.find(
                            (r) => r.id === value
                        )
                        setRegion(selectedRegion)
                    }}
                >
                    <SelectTrigger className="w-auto h-8 text-sm">
                        <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                        {regions.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                                {r.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}