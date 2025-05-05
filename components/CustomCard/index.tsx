"use client"

import { CheckIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type CustomCardProps = {
    title: string
    isActive: boolean
    isDone: boolean
    path: string
    children: React.ReactNode
}

export const CustomCard = ({
    title,
    isActive,
    isDone,
    path,
    children,
}: CustomCardProps) => {
    const router = useRouter()

    const handleClick = () => {
        if (!isActive) {
            router.push(path)
        }
    }

    return (
        <Card
            className={cn(
                "w-full shadow-sm",
                !isActive && "cursor-pointer hover:shadow-md transition-shadow"
            )}
            onClick={handleClick}
        >
            <CardHeader className="px-6 py-4">
                <CardTitle className="flex justify-between items-center text-xl">
                    <span>{title}</span>
                    {isDone && <CheckIcon className="h-5 w-5 text-green-500" />}
                </CardTitle>
            </CardHeader>
            {isActive && <CardContent className="px-6 pb-4 pt-0">{children}</CardContent>}
        </Card>
    )
}